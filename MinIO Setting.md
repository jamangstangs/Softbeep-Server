## MinIO Object Storage for Hybrid Cloud

### 용어 정리

- Hybrid Cloud : 다양한 환경의 조합으로 Application이 실행되는 **Cloud 환경**, 예시는 아래와 같다. 

  - On-Premise + Public Cloud + Private Cloud

  따라서, MinIO는 위와 같은 Hybrid Cloud를 위한 Object Storage라는 것을 알 수 있다. 그렇다면 각각 환경에 대해서 우수한 호환성을 가지고 있다는 것을 알 수 있다. 

- First Party vs Third Party : 하드웨어 생산자와 소프트웨어 개발자의 관계를 나타내는 용어

  - First Party : 하드웨어 생산자가 Software 직접 개발
  - Third Party : 하드웨어 생산자와 관계없이 Software 개발하는 회사

### 본문 정리

- MinIO는 높은 성능의 S3-Compatible API를 제공하기 위해 디자인 된 Kubernetes-native Object Storage이다. 

  1. 따라서, Kubernetes Orchestration을 활용하는 **관리자**들은 Hybird Cloud하에서, MinIO를 **multi-tenant환경**으로 배포할 수 있다. -> K8S Multi-Tenancy 성질을 생각해보면, Namespace를 나누어서 사용자에게 제공하는데, K8S Native한 MinIO 또한 Multi-Tenancy를 제공하는 것을 알 수 있다. 
  2. **개발자**들은 **Single Cloud or Legacy Ingrastructures -> MinIO-backend Hybrid Cloud Object Storage**로 Migrating할때, S3-Compatibility에 의존할 수 있다. -> Hybrid Cloud 환경으로 Migration하기가 수월하다. 

- **MinIO Operator** : **First Party K8S Extension**이다. -> K8S Clusters에 MinIO Tenants를 배포하기 위한 Custom Resource Definition을 MINIO에서 만들었다.

  - 해당 Custom Resource Definition을 MINIO에서 만들었기에 아래와 같이 kubectl command line을 사용할 수 있다. 

  - ```shell
    $ kubectl minio
    # 해당 Command는 MinIO Tenants를 배포, 관리하는데 사용된다. 
    ```

## Core Concepts

### 용어 정리

- RAID : Redundant Array of Independent/Inexpensive Disk

  1. 여러 개의 Disk를 묶어 하나의 디스크 처럼 사용하는 기술 -> 대용량의 단일 볼륨으로 사용 가능하다.
  2. I/O를 병렬화 -> 성능 향상
  3. 여러 개의 Disk에서 일부 중복된 데이터를 나눠서 저장한다.

  - RAID 레벨에 따라 분산 저장의 품질이 달라진다. 
    1. RAID 0 : 데이터를 말 그대로 분산 저장만 한다. -> 데이터 유실 발생하면 전체가 손상된다. 
    2. RAID 1 : 말 그대로, 한 디스크를 다른 디스크에 미러링 한다. -> 전체 데이터의 2배의 공간이 요구된다. 
    3. RAID 5 : Disk 4개의 블록 -> 데이터를 위한 3개, Parity를 위한 1개, 이렇게 사용하면, 디스크 하나에 장애가 날 경우, Parity 파트를 참고하여 데이터 복구를 한다. Parity -> 디스크 장애시 복구하기 위해 사전에 계산된 값이다. 
    4. RAID 6 : 장애에 대비하기 위해 Parity블록을 다른 Disk에 구축해놓는다. -> 높은 안정성

- Erasure Sets

  - MinIO Deployment에서 Erasure Coding을 지원하는 **Drives의 Set**이다.
  - MinIO -> Data, Parity 블록들을 Erasure Set의 Drives에 분산시켜서 고르게 저장한다. 

### Erasure Coding

- 특징 : Data Redundancy, Data Availability -> 이러한 특징들이, MinIO가 Cluster의 다양한 node들의 loss가 있음에도 불구하고 그 즉시 **object를 자동적으로 복구한다. ** Erasure Coding은 Object Level에서 healing을 제공하며, 이는 근접한 다른 RAID, Replication 기술보다 Overhead가 적다. 

- 원리 : **Object**를 아래와 같이 2개로 나눈다. 

  	1. Data Blocks -> 저장할 데이터 파트
  	1. Parity Blocks -> 손상된 Data를 복구하기 위해 사용된다. 

  이러한 Object들을 어떻게 저장하나?

  - Data, Parity Block -> minio server nodes와 **Erasure Set** 전체에 분산시킨다. 
  - Drives의 절반에서 loss가 발생했을때 견딜 수 있다. 

- Parity Setting 표

  - ![](/Users/jamang/Desktop/ScreenShot/스크린샷 2022-04-25 오전 9.52.05.png)

- MinIO는 2개의 Parity Level을 지원한다.

  1. Standard(Default) : Erasure Set에 있는 Volumes에 따라 달라진다. 

     - 8개 이상의 Volume : EC->4
     - 6-7개의 Volume : EC -> 3
     - 4-5개의 Volume : EC -> 2

     이전 저번은, EC가 1/2로 잡힌다.

  2. Reduces

- Custom으로 Parity를 세팅 가능하다. 

  - MINIO_STORAGE_CLASS_STANDARD
  - MINIO_STORAGE_CLASS_RSS

  환경 변수를 세팅하면 가능하다. 

### Bucket Versioning

- Single Bucket에 있는 하나의 object를 **Version**관리가 가능하다. 
  - Write Operation : 새로운 version의 Object를 생성하기 보다는 기존에 있는 데이터를 Overwrite한다. 
  - Undoing Write Operation : 의도치 않은 overwrite를 되돌릴 수 있다. 
- 각 Object에 대해 Immutable ID를 부여한다. 
  - 즉, 현재 **존재하는 Object**를 복사하면, 복제된 Object는 Older Object의 ID와는 다른 ID를 가진다는 것이다. 
  - 모든 Version의 Object를 유지하면서, 가장 최근에 쓰인 Object를 Latest Version으로 여긴다.

출처 : https://docs.min.io/minio/k8s/core-concepts/core-concepts.html, 2022/04/25

## Deploy MinIO Operator on Kubernetes

### 용어 정리

- CRD(Custom Resource Definitions) : K8S가 지원하는 API로, 커스텀 Resource를 사용자가 선언할 수 있게 제공하는 기능이다. 

  - CRD를 정의하면, 새로운 이름의 resource가 생긴다. 
  - CRD object의 이름은 반드시 유요한 DNS Subdomain의 이름이어야한다. 

- DNS Subdomain Names : K8S에서 사용되는 Resource의 이름은 DNS Subdomain에 사용되어야 하기 때문에 RFC 1122에 정의된 방식을 따라야 한다. 

  - contain no more than 253 characters
  - contain only lowercase alphanumeric characters, '-' or '.'
  - start with an alphanumeric character
  - end with an alphanumeric character

  출처 : https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names

### 개요

- **MinIO K8S Operator** -> MinIO Tenants를 **Hybird Cloud** 환경에서 배포 가능하게 한다. 
  1. Multi Tenant를 구현하는 방법 : MinIO Operator가 **CRD**(Custom Resource Definitions)를 설치하여, MinIO Tenants를 K8S Object로 표현한다. 
  2. kubectl minio 커맨드 : K8S Cluster 상에서 MinIO Tenants를 관리할 수 있다.

### 필수 개념

- Kubernetes TLS Certificate API

  - MinIO Operator가 자동으로 TLS Certificate Signing Requests를 생성하고, K8S Certificates.k8s.io를 사용하여 인증된 TLS Certificates를 생성한다. 
  - 따라서, MinIO Operator는 kube-controller-manager 구성이 아래와 같이 필요하다. 
    - `--cluster-signing-key-file` 
    - `--cluster-signing-cert-file`
  - Operator는 K8S Cluster가 생성된 CSR(Certificate Signing Requests)에 반응하도록 세팅을 안해놓았다면, 초기화 될 수 없다. 따라서, 따로 설정해주어야한다. 

  세팅하는 방법은 아래와 같다. 

  1. kube-controller-manager가 세팅을 만족하는지 아래 커맨드로 확인해보자. 

     ```shell
     $ kubectl get pod kube-controller-manager-$CLUSTERNAME-control-plane -n kube-system -o yaml
     ```

     ```
       containers:
       - command:
         - kube-controller-manager
         - --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf
         - --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf
         - --bind-address=127.0.0.1
         - --client-ca-file=/etc/kubernetes/pki/ca.crt
         - --cluster-name=kubernetes
         - --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt
         - --cluster-signing-key-file=/etc/kubernetes/pki/ca.key
     ```

## 설치

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

### Build the Tenant Configuration

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-07 오후 11.52.22.png)

- MinIO
  - Name

출처 : https://docs.min.io/minio/k8s/deployment/deploy-minio-operator.html