https://ykarma1996.tistory.com/179





https://projectcalico.docs.tigera.io/getting-started/kubernetes/quickstart

# Calico

## Calico란?

## Calico Install

1. kubeadm 설치 이후, 바로 설정하자..

2. master에 아래 명령어를 적용하자. 

   ```shell
   sudo kubeadm init --pod-network-cidr=192.168.0.0/16
   ```

   - 네트워크 아래에서, 192.168.0.0/16 -> 이미 사용중이라면, 다른 ip로 교체하자. 

3. 

