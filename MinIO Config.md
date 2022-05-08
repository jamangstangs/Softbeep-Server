# MinIO Setting on K8S Environment

## Install Process

- K8S 환경은 아래와 같이 구성하였다 .

  - Ubuntu 20.04 LTS -> 4 Node

  - Docker 20.10.15

  - K8S v1.23.6 -> 1.24로 설치하고자 했지만, Docker 관련한 문제가 발생하여 설치를 못함. 아래 K8S 공식 문서를 참조하자. 

    - 이제 K8S에서 Docker가 기본 엔진으로 사용되지 않는다는 것을 확인할 수 있다. 

    https://kubernetes.io/blog/2021/11/12/are-you-ready-for-dockershim-removal/

- 아래 절차를 따라 설치를 진행해주자. 

### Krew Install

- Krew란? 

  - kubectl 확장하기 위한 Plugin Manager이다. 
  - kubectl v1.12이상 버전에서만 지원된다. 

- 설치 방법은 아래와 같다. 

  ```shell
  $ sudo apt install git
  
  $ (
    set -x; cd "$(mktemp -d)" &&
    OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
    ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
    KREW="krew-${OS}_${ARCH}" &&
    curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
    tar zxvf "${KREW}.tar.gz" &&
    ./"${KREW}" install krew
  )
  
  # $HOME/.krew/bin 디렉토리를 PATH에 추가해준다. 
  $ export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
  
  # .bashrc 적용
  $ source ~/.bashrc
  
  # krew 버전 확인
  $ kubectl krew version
  OPTION            VALUE
  GitTag            v0.4.3
  ```

- 출처 : https://krew.sigs.k8s.io/docs/user-guide/setup/install/

### Install MinIO K8S Operator with Krew Plugin manager

```shell
# 설치
$ kubectl krew update
$ kubectl krew install minio

# 버전 체크
$ kubectl minio version
v4.4.17

# Initialize
$ kubectl minio init
```

- 설치를 하고난 뒤, pod 확인을 해보자. 

```shell
# pod 체크
$ kubectl get pods -n minio-operator
NAME                              READY   STATUS    RESTARTS   AGE
console-64b557c49b-rqxzz          1/1     Running   0          26s
minio-operator-6c7675f6c8-66pgp   1/1     Running   0          26s
minio-operator-6c7675f6c8-8hrhk   1/1     Running   0          26s
```

- console : MinIO Operator Console을 실행시킨다. GUI 환경의 MinIO Tenant Portal을 제공한다. 
- minio-operator : MinIO Operator 자체를 실행시킨다. 

MinIO Operator Console에 접근해보자. 

```shell
$ kubectl minio proxy -n minio-operator

Starting port forward of the Console UI.

To connect open a browser and go to http://localhost:9090

Current JWT to login: TOKENSTRING
```

- 9090 포트로 접속이 가능하다. 
- JWT : Json Web Token, 해당 값을 로그인할때 입력하자. 

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-07 오후 11.49.42.png)

- 위와 같이 Tenants Portal로 접근이 가능하다. 
- Create Tenant +를 눌러서 Tenant를 생성하자. 

## MinIO Tenant Portal 

### Prerequisites

MinIO Tenant Configuration을 하는 과정에서, 설정을 하는 부분을 모르겠어서, Documentation을 보고 각 부분이 어떤 것을 의미하는지 알아보겠다. 

#### Namespace

Namespace : MinIO는 각 Namespace 당 **하나의 Tenent만** 허용한다. 다음 명령어로 MinIO Tenant를 위한 **namespace**하나를 할당하자. 

```shell
$ kubectl create namespace minio-tenant-1

# namespace가 생성된 것을 확인할 수 있다. 
$ kubectl get namespace
NAME              STATUS   AGE
default           Active   17h
...
minio-tenant-1    Active   11s
```

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-08 오후 3.52.09.png)

```shell
# 혹은, Operator Console에서 직접 추가할 수 있다. aa 이름의 namespace를 오른쪽의 +를 누르고 추가해보았다. 
$ kubectl get namespace
NAME              STATUS   AGE
aa                Active   3s
....
kube-public       Active   17h
```

#### Tenant Storage Class

MinIO K8S Operator는 Tenant를 Deploy하는 과정에서, **자동으로 PVC를** 생성한다. 이 내용을 이해하기 위해, PV, PVC, Storage Class가 무엇인지 알아보자. 

1. PersistentVolume : Cluster 관리자가 데이터를 어떻게 제공할지에 관련된 리소스
2. PersistentVolumeClaim : 일반 사용자가 데이터 저장소를 어떻게 활용할 것인지 정의하는 리소스
3. StorageClass : Cluster관리자가 사용자들에게 제공하는 저장소 종류

MinIO Operator Plugin은 각 PVC를 K8S **default Storage Class**에 할당한다. 만약, default Storage Class가 PVC 생성을 하용하지 않으면, **Tenant Deploy는 실패한다. **

따라서, **MinIO Tenants**는 StorageClass가 VolumeBindingMode를 WaitForFirstConsumer로 설정하는 것을 요구한다. 

```yaml
# default StorageClass 세팅
volumeBindingMode: Immediate

# MinIO가 원하는 pvc binding Mode는 아래와 같다. 
volumeBindingMode: WaitForFirstConsumer
```

- 따라서, MinIO는 Custom StorageClass를 따로 생성하여, **MinIO Tenant를위한 PV를 생성할 것을 추천한다.** 

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
    name: direct-csi-min-io
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

```shell
$ kubectl apply -f direct-csi-min-io.yaml
$ kubectl get sc --all-namespaces
NAME                PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      
direct-csi-min-io   kubernetes.io/no-provisioner   Delete          WaitForFirstConsumer   
```

- 적용하여 StorageClass 리소스를 생성하였다. 

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-08 오후 5.03.37.png)

- 선언한 StorageClass를 이와 같이 선택할 수 있다. 

#### Tenant Persistent Volumes

MinIO Operator는 아래와 같이 PVC를 생성한다. 

- Tenant에 있는 각각의 volume에 PVC를 생성한다. 
- Tenant metrics와 logs를 수집하기 위해 2개의 PVC를 생성한다. 

따라서, MinIO를 정상적으로 작동시키고 싶으면, Cluster는 반드시 각 PVC가 요구하는 capacity를 만족하기 위해 충분한 PV를 **반드시 가지고 있어야한다. ** 예시를 보자.

- 16개의 volumes을 가진 Tenant
- 18개의 PVC가 필요하다. 
  - 16 : 각각의 Volume에 PVC를 생성해야한다. 
  - 2 : 2개의 추가적인 PVC가 필요하다 -> Tenant Metrics, Logs를 수집하기 위해서
- 각 PVC가 1TB의 용량을 요청한다면, 각 PV는 최소 1TB의 용량을 제공해야한다. 

MinIO는 DirectPV를 사용하여 Attached Dirves에서 PV를 자동으로 **Provision**하기 위해 사용한다. 아래 과정은 DirectPV를 설치한 것을 가정한다. -> https://velog.io/@jamangstangs/MinIO-DirectPV 참고

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-08 오후 5.37.46.png)

- PVC 계산은 다음과 같이 한다. 
  - Node의 수 x Drives per Node
    - 필자가 구성한 Cluster Node -> 4개
    - Node당 Driver 수 -> 2개
    - 총 8개의 PVC가 필요하며, 8개의 PV가 있다. 

출처 : https://github.com/minio/operator/blob/master/README.md

### Build the Tenant Configuration

#### Setup

- Direct CSI Driver -> PV를 Provisioning해놓는다. 이미 PVC는 Drives마다
- MinIO Operator에서 Tenant를 생성하면, PVC를 자동으로 할당한다. 

아래 과정을 따라서 Tenant를 생성해보자. 

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-07 오후 11.52.22.png)

**Name**

- Name : 사용자 이름을 정의한다. 
- Namespace : namespace 하나당 **Tenant 하나만** 할당이 가능하다. 생성할 or 존재하는 Namespace를 적어주자. 
- Storage Class 
  1. 직접 정의한 Stroage Class를 사용
  2. DirectPV를 설치했다면, direct-csi-min-io를 사용하도록하자. 

**Capacity**

- Number of Servers : Node가 4대이므로 4대로 설정한다. 
  - Operator는 default로 
- Drives per Server : Node 당 Drive를 2개로 할당했으므로, 일단은 2개로 설정한다. 
  - Tenant Persistent Volumes -> 여기에서 확인할 수 있다. 
- Total Size : 총 8대의 Drive를 사용할 수 있다. 
  - 각 Drive에 최소 1GB는 할당해야한다. 
  - 우선, 각 GB에 2GB씩 할당하자.
  - 8 x 2 = 16GB, 총 **16GB**를 할당하겠다. 
- Erasure Code Parity : Erasure Coding parity를 얼마나 지정할 것인지 정한다. 
  - EC에 관한 정보는 아래 필자가 정리한 링크를 따라서 확인하자. 
  - https://velog.io/@jamangstangs/MinIO-Prerequisite

출처 : https://docs.min.io/minio/k8s/deployment/deploy-minio-operator.html

출처 : https://docs.min.io/minio/k8s/tenant-management/deploy-minio-tenant.html#