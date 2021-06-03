# Uting
2021-1 ajou university SW Capstone Project - Uting


### Motivation
---
코로나 19로 인한 사회적 거리두기가 지속되면서 비대면 사회로의 전환이 이루어졌습니다. 이전과 달리 사람들 사이의 직접적인 만남이 힘들어지게 되었고 새로운 인연을 만나는 일이 더욱 어려워졌습니다. 이에 따라 사회적 단절, 고립으로 인한 우울증 등의 증상을 코로나 블루라고 합니다. 특히나 이제 대학 생활을 시작하는 신입생 그리고 여러 사람을 만나고 싶어하는 다양한 요구를 충족하기 위해 비대면 미팅 서비스 플랫폼인 UTING을 기획하였습니다.

### Build
---

* Clone repository

		git clone https://github.com/GardenTyphoon/uting.git

* How to build Front-End (Test)

		cd uting-front
        
        npm install
        
        npm run start

* How to build Back-End (Test)

		cd uting-back
        
        npm install
        
        npm run back
---

* Use Docker and Nginx

		cd uting
        
        docker-compose up --build
        
	* Pre-installed Docker, Nginx
	*  ! Docker version (20.10.5) 

### Tech
---
+ AWS
	+ 화상 채팅 구현
		+ Amazon-chime-sdk-component-library-react
 		+ Amazon-chime-sdk-js

+ SocketIo
	+ Mc Bot
	+ 실시간 게임

* Docker and Nginx




### System architecture overview
---
![image](https://user-images.githubusercontent.com/76544552/120697755-1396b500-c4e9-11eb-86e3-db2f0ff8acac.png)


* Front-End : React.js를 이용하여 구현  

* Back-End : Node.js를 이용하여 구현  

* Ngnix : Front_Back-End 와 Client 사이의 통신을 중개  

* AWS : 실시간 기능 구현을 위한 SocketIo, 화상 회의 기술 등 Back-End의 부담이 크므로 AWS 서비스를 연동  



### Author
---

|   |이름|Link to|
|------|---|---|
||권태풍|[@KEHP](https://github.com/KEHP-K)|
||백승수|[@gnupdev](https://github.com/gnupdev)|
||유미리|[@MiiRii](https://github.com/MiiiRiii)|
||조민제|[@minje0204](https://github.com/minje0204)|
||홍수민|[@sumiini](https://github.com/sumiini)|

