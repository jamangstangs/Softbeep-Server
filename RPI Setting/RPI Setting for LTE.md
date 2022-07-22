# RPI LTE Setting 

## CAT.M1 PPP 설치하기

### Network Setting 

- 패키지를 받기 위해 우선 RPI에 연결을 해준다. 
- 연구실 특성상 고정 IP를 할당해서 받아야 했으므로 세팅을 해준다. 
  - IP : xxx.xxx.xxx.41/24
  - Router : xxx.xxx.xxx.167
  - DNS : xxx.xxx.xxx.254

### CAT.M1 PPP Install 과정 

```shell
# Installer File을 다운받자.
wget https://raw.githubusercontent.com/sixfab/Sixfab_PPP_Installer/master/ppp_install_standalone.sh

# 파일의 퍼미션 변경
sudo chmode +x ppp_install_standalone.sh

# ppp_install_standalone.sh을 실행한다. 
sudo ./ppp_install_standalone.sh
```

![스크린샷 2022-07-07 오후 12.48.02](/Users/jamang/Library/Application Support/typora-user-images/스크린샷 2022-07-07 오후 12.48.02.png)

- 실행하면 위와 같이 나오는데, 우리는 3G/4G Base HAT으로 선택해준다. 

![스크린샷 2022-07-07 오후 12.49.50](/Users/jamang/Library/Application Support/typora-user-images/스크린샷 2022-07-07 오후 12.49.50.png)

- Carrier APN
  - Access Point Name : 3G/4G 네트워크를 이용하는 단말기의 데이터 통신에 필요한 인증 정보 입력과 사용 목적을 지정하는 설정이다. 
  - 우리는 Telenor Usim을 사용하므로 **internet.lte.cxn을 입력해주자**

![스크린샷 2022-07-07 오후 12.53.54](/Users/jamang/Library/Application Support/typora-user-images/스크린샷 2022-07-07 오후 12.53.54.png)

- 기타 설정
  - communication PORT -> USB3을 사용해서 연결할 것이다. 




https://wiki.52pi.com/index.php?title=EZ-0048





