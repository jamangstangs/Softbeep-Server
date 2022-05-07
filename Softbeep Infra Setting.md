# Softbeep Infra Setting

## Ubuntu PC Setting

- Ubuntu PC 4대 20.04LTS Version 설치

- Partition 설정은 아래와 같다. 

  - EFI partition : 512MB
  - ext4 partition : 20GB -> mount to root
  - ext4 partition : 20GB x 2 -> mount 안함
  - 나머지는 Free Space

- 해당 파티션은 MinIO 세팅을 위해 나누어놓았으며, 후에 Free Space에서 필요한 파티션을 추가로 할당할 예정이다. 

- openssh-server 설치 후 머신의 이름은 다음과 같다. 

  - minio1 : master node
  - minio2 : worker node
  - minio3 : worker node
  - mino4 : worker node

  세팅을 위와같이 한 뒤에, NetAI Master Portal에에 먼저 접속을 한 뒤, 각각의 node로 접속이 가능하다. 

## Kubernetes Setting 

- Kubernetes Version은 아래와 같다. 
  - kubelet=1.23.6-00 
  - kubeadm=1.23.6-00 
  - kubectl=1.23.6-00

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-07 오후 10.15.47.png)

- 총 4대의 node를 바탕으로 Softbeep Server의 K8S Cluster를 완성하였다. 

