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

- Kubernetes Version은 아래와 같다. 1.23.6-00은 MinIO에서 Docker 관련 오류가 발생하여, 수정을 하였다. 자세한 사항은 

   https://velog.io/@borab/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-docker-%EC%A7%80%EC%9B%90-%EC%A4%91%EB%8B%A8%EC%97%90-%EB%94%B0%EB%A5%B8-%EB%8C%80%EC%95%88

  https://kubernetes.io/ko/blog/2020/12/02/dont-panic-kubernetes-and-docker/

  https://www.google.com/search?rlz=1C5CHFA_enKR935KR935&q=Kubernetes+Docker+%EC%A7%80%EC%9B%90+%EC%A4%91%EB%8B%A8&sa=X&ved=2ahUKEwi_upa7xtH3AhUVtlYBHR2rBFgQ1QJ6BAgnEAE&biw=1280&bih=969&dpr=1

  - kubelet=1.22.0-00
  - kubeadm=1.22.0-00 
  - kubectl=1.22.0-00

![](/Users/jamang/Desktop/Softbeep-Server/img/스크린샷 2022-05-07 오후 10.15.47.png)

- 총 4대의 node를 바탕으로 Softbeep Server의 K8S Cluster를 완성하였다. 

