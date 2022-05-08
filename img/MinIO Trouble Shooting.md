# MinIO Trouble Shooting

## 문제 정의

```shell
# log-search-api pod에서 에러가 나서 log를 확인한다. 
$ kubectl logs -n minio-tenant-jms jms-log-search-api-598894cd5-chh54
2022/05/08 12:16:30 Error connecting to db: dial tcp: lookup jms-log-hl-svc.minio-tenant-jms.svc.cluster.local on 10.96.0.10:53: no such host

# jms-log-hl-svc.minio-tenant-jms.svc.cluster.local 를 확인한다. 하지만, 해당 도메인을 인식할 수 없다. 
$ nslookup jms-log-hl-svc.minio-tenant-jms.svc.cluster.local
;; Got recursion not available from 10.96.0.10, trying next server
Server:		127.0.0.53
Address:	127.0.0.53#53

** server can't find jms-log-hl-svc.minio-tenant-jms.svc.cluster.local: NXDOMAIN

# /etc/resolv.conf 파일은 다음과 같다. 
nameserver 10.96.0.10
nameserver 127.0.0.53
options edns0 trust-ad

# 10.96.0.10 : kube-dns가 
$ kubectl get svc --all-namespaces
NAMESPACE           NAME                              TYPE           CLUSTER-IP      
kube-system         kube-dns                          ClusterIP      10.96.0.10           

```

- nslookup : Domain IP를 조회한다. 

- Kubernetes Cluster 내 Pod에서 어떤 Domain을 찾고자 할때, Kube-system Namespace에 실행되고 있는 CoreDNS가 네임서버로 채택된다. 

  - K8S 버전1.12 ~ : CoreDNS가 표준
  - 한번 확인해보자. 

  ```shell
  # CoreDNS를 확인하였다. 
  $ kubectl get po -n kube-system
  NAME                             READY   STATUS    RESTARTS      AGE
  coredns-64897985d-5x982          1/1     Running   0             23h
  coredns-64897985d-xbdcc          1/1     Running   0             23h
  
  # Pod이기 때문에, 어쨌든 Service Obejct가 존재할 것이다. 확인해보자. 
  $ kubectl get svc -n kubesystem
  NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
  kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   23h
  ```

  - 여기서 Cluster-IP가 10.96.0.10이다. 여기가 DNS의 주소이다. 
  - 하지만, **Cluster 내에서 ** 10.96.0.10을 찾아갈 수가 없다. Pod안에서 도메인을 어떻게 찾을까?

## Pod 안에서 Domain을 찾기

- kubelet : pod 및 컨테이너 시작의 작업을 수행한다. 

  - 여기서, Pod를 실핼할 때, coreDNS가 가리키는 IP주소를 Nameserver로 등록한다. 
  - /etc/resolv.conf 파일을 확인해보자. 

  ```shell
  nameserver 127.0.0.53
  options edns0 trust-ad
  ```

  - 여기서 CoreDNS의 IP 주소는 확인할 수 없다. 
  - 수정할 방법을 알아보자. 

## /etc/resolv.conf에 Pod