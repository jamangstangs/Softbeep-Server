#! /bin/bash

# krew plugin manager를 사용해서 directpv plugin를 설치하자. 
kubectl krew install directpv

# K8S CLuster에 directpv 를 설치하자. 
kubectl directpv install

# directpv 확인
kubectl directpv info

# cluster에서 사용 가능한 drives를 확인하자. 
kubectl directpv drives ls

# directpv가 manage, format할 drives를 선책하자. 
kubectl directpv drives format --drives /dev/sd{a...f} --nodes directpv-{1...4}
