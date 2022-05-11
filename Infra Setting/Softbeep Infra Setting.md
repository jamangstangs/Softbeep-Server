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

- Kubelet 오류

  ```shell
  "Failed to run kubelet" err="failed to run Kubelet: misconfiguration: kubelet cgroup driver: \"cgroupfs\" is different from docker cgroup driver: \"systemd\""
  
  # 현재, Kubelet 의 cgroup이 systemd이므로, 변경해준다. 
  # /etc/systemd/system/kubelet.service.d/10-kubeadm.conf 라인추가
  Environment="KUBELET_CGROUP_ARGS=–cgroup-driver=systemd"
  
  # cgroup driver 변경
  sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
  
  kubeadm join 210.125.84.129:6443 --token 0fku2j.9ocfegsz39w9kvq5 --discovery-token-ca-cert-hash sadfkjashfjwahnfwenksdfsdhnfasklfhshnfkasndfsahd
  ```

- coreDNS Pending -> CNI 설치가 안됨, Node 사이의 통신이 안됨

  - CNI 가 무엇인가 https://ykarma1996.tistory.com/179
  - MinIO에 적합한 CNI plugin이 있다. -> calico
  - calico를 설치하자 .https://projectcalico.docs.tigera.io/getting-started/kubernetes/quickstart

  

  ## K8S CNI : Calico 설치

  https://ykarma1996.tistory.com/179

  

  

  https://projectcalico.docs.tigera.io/getting-started/kubernetes/quickstart

  

  **설치**

  ```shell
  ```

  **Preferred Setup**

  ```shell
  ```

  

