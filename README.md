# Uting

2021-1 ajou university SW Capstone Project - Uting

### Motivation

---

코로나 19로 인한 사회적 거리두기가 지속되면서 비대면 사회로의 전환이 이루어졌습니다. 이전과 달리 사람들 사이의 직접적인 만남이 힘들어지게 되었고 새로운 인연을 만나는 일이 더욱 어려워졌습니다. 이에 따라 사회적 단절, 고립으로 인한 우울증 등의 증상을 코로나 블루라고 합니다. 특히나 이제 대학 생활을 시작하는 신입생 그리고 여러 사람을 만나고 싶어하는 다양한 요구를 충족하기 위해 비대면 미팅 서비스 플랫폼인 UTING을 기획하였습니다.

### Build

---

#### Requirement

| name    | version   | etc                     |
| ------- | --------- | ----------------------- |
| Node.js | v16.2.0   |                         |
| Npm     | v7.13.0   |                         |
| Ubuntu  | 18.04 LTS |                         |
| Docker  | v20.10.5  | If use docker and nginx |
| Nginx   | v1.20.0   | If use docker and nginx |

---

- Clone repository

      git clone https://github.com/GardenTyphoon/uting.git

- How to build Front-End (Test)

      cd uting-front

        npm install

        npm run start

- How to build Back-End (Test)

      cd uting-back

        npm install

        npm run back

---

- Use Docker and Nginx

      cd uting

        docker-compose up --build


### Tech

---

- AWS

  - 화상 채팅 구현
    - Amazon-chime-sdk-component-library-react
    - Amazon-chime-sdk-js

- SocketIo
  - Mc Bot
  - 실시간 게임

* Docker and Nginx
  - Deploy

### System architecture overview

---

![image](https://user-images.githubusercontent.com/76544552/120697755-1396b500-c4e9-11eb-86e3-db2f0ff8acac.png)

- React.js

  - Front-end client 구현

- Node.js

  - Back-End server 구현

- Ngnix

  - Client의 요청에 따라 서버에 대해 리버스 프록시로 작용함으로써 Front-End, Back-End와의 통신을 중개

- Docker
  - 컨테이너 환경을 구성하여 배포에 용이하고, Nginx와 함께 사용함으로써 무중단 배포가 이루어지도록 함.
- SocketIo
  - WebSocket을 이용한 클라이언트 간, 혹은 클라이언트-서버 간 실시간 양방향 통신
- Chime
  - WebRTC를 이용하여 구현된 화상회의 기술. AWS에서 지원.

### Author

---

|     | 이름   | Link to                                    |
| --- | ------ | ------------------------------------------ |
|     | 권태풍 | [@KEHP](https://github.com/KEHP-K)         |
|     | 백승수 | [@gnupdev](https://github.com/gnupdev)     |
|     | 유미리 | [@MiiRii](https://github.com/MiiiRiii)     |
|     | 조민제 | [@minje0204](https://github.com/minje0204) |
|     | 홍수민 | [@sumiini](https://github.com/sumiini)     |
