# DirectPV

## Definitions

- **DirectPV**는 Direct Attached Storage를 위한 CSI Driver이다. 즉, K8S와 Storage를 제어하는 인터페이스라고 이해하자. 여기서는 K8S와 Distribute Persistent Volume사이의 인터페이스라고 이해하면 된다. 
  - Direct Attached Storage(DAS) : Server, Computer에 **네트워크**를 거치지 않고 **직접 저장되는 저장장치**
  - CSI : Container Storage Interface로, K8S와 Storage 를 제어하는 Plugin 사이를 제어하는 Interface이다. 
  - SAN : Storage Area Networking, Storage를 위한 **네트워크**이다. 
  - NAS : Network Attached Storage, DAS와 달리 **네트워크**를 거쳐서 저장장치에 저장한다. 
- Direct PV는 왜 사용할까?
  - K8S의 hostpath, local PVs들은 정적으로 provisioned되고 기능에 제한이 있지만, 
  - **DirectPV**는 이러한 제한을 해결하기 위해 생성되었다. 

- DirectPV의 이점

![https://github.com/minio/directpv](/Users/jamang/Desktop/Softbeep-Server/img/architecture.png)

- Distributed Data Store : 분산 저장소

  - Object Storage
  - DataBases
  - Message Queues

  위와 같은 것들이 분산 저장소이며, 이것들은 **Direct Attached Storage**로 디자인 되었고, 높은 Availability와 Data Durability의 성질을 가진다. 

- Distributed Data Store들을 SAN, NAS 기반의 CSI Drivers를 가동하면, data path에 **extra Network hops**를 추가한다. (Replication, erasure coding과 같은 Layer라고 생각하면 된다. 위의 그림을 참고하자. )

  - 따라서, 오른쪽 Network Persistent Volume을 보면, 1개의 층이 더 있어서, 왼쪽 DirectPV보다 성능이 떨어지는 것을 알 수 있다. 

## Architecture

DirectPV는 3개의 Components로 구성되어 있다. 

- **Controller** : Volume Clamin이 생성이 되면, pool에서 free drives에 바로 volumes들을 할당할 수 있도록 준비해준다. (Provisioning)
  - Pod's Affinity 제약에 주의해야한다. 
  - 아래 그림과 같이 Drives에서 pod로 volume을 할당한다. 
- **Node Driver** : Node에 있는 drives를 discovery, format, mount, monitoring하는 volume management를 담당한다. 
  - Node Driver Instance는 각 Storage Server에서 동작한다. 
- **UI :** 개발중

![](/Users/jamang/Desktop/Softbeep-Server/img/directpv_architecture.png)

## Installation

```shell
# krew plugin manager를 사용해서 directpv plugin를 설치하자. 
$ kubectl krew install directpv

# K8S CLuster에 directpv 를 설치하자. 
$ kubectl directpv install

# directpv 확인
$ kubectl directpv info

# cluster에서 사용 가능한 drives를 확인하자. 
$ kubectl directpv drives ls

# directpv가 manage, format할 drives를 선책하자. 
$ kubectl directpv drives format --drives /dev/sd{a...f} --nodes directpv-{1...4}

# 'directpv' can now be specified as the storageclass in PodSpec.VolumeClaimTemplates
```

## Result

```shell
$ kubectl get pods -n direct-csi-min-io
NAME                                READY   STATUS    RESTARTS   AGE
direct-csi-min-io-5mjpx             4/4     Running   0          67s
direct-csi-min-io-b5c6b6497-2rg6s   2/2     Running   0          67s
direct-csi-min-io-b5c6b6497-mhttm   2/2     Running   0          67s
direct-csi-min-io-b5c6b6497-qc9tb   2/2     Running   0          67s
direct-csi-min-io-j5gf6             4/4     Running   0          67s
direct-csi-min-io-sqn52             4/4     Running   0          67s
direct-csi-min-io-vfj5b             4/4     Running   0          67s

$ kubectl directpv info
 NODE      CAPACITY  ALLOCATED  VOLUMES  DRIVES
 • minio1  -         -          -        -
 • minio2  -         -          -        -
 • minio3  -         -          -        -
 • minio4  -         -          -        -
 
 $ kubectl directpv drives ls
 DRIVE      CAPACITY  ALLOCATED  FILESYSTEM  VOLUMES  NODE    ACCESS-TIER  STATUS
 /dev/sda5  19 GiB    -          ext4        -        minio1  -            Available
 /dev/sda6  19 GiB    -          ext4        -        minio1  -            Available
 /dev/sda3  19 GiB    -          ext4        -        minio2  -            Available
 /dev/sda4  19 GiB    -          ext4        -        minio2  -            Available
 /dev/sda3  19 GiB    -          ext4        -        minio3  -            Available
 /dev/sda4  19 GiB    -          ext4        -        minio3  -            Available
 /dev/sda3  19 GiB    -          ext4        -        minio4  -            Available
 /dev/sda4  19 GiB    -          ext4        -        minio4  -            Available
```



## Upgrade

```shell
# Uninstall directpv
kubectl directpv uninstall 

# Download latest krew plugin
kubectl krew upgrade directpv

# Install using new plugin
kubectl directpv install
```

출처 : https://github.com/minio/directpv

