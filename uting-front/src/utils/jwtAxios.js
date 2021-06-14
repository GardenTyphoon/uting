import axios from "axios";

/*
    axios 인스턴스를 생성합니다.
    생성할때 사용하는 옵션들 (baseURL, timeout, headers 등)은 다음 URL에서 확인할 수 있습니다.
    https://github.com/axios/axios 의 Request Config 챕터 확인
*/

 const tokenAxios = axios.create({
   baseURL: "/api",
 });
/*
const tokenAxios = axios.create({
  baseURL: "http://localhost:3001",
});
var token = sessionStorage.getItem("token");*/

tokenAxios.interceptors.request.use(
  function (config) {
    if (!sessionStorage.getItem("token")) {
      console.log("토큰없슴");
      return config;
    } else {
      token = sessionStorage.getItem("token");
      config.headers["x-access-token"] = token;
      return config;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

tokenAxios.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    if (!error.response) {
      return error;
    }

    if (error.response.status === 401) {
      sessionStorage.clear();
      window.location = "/";
    } else {
      return error;
    }
  }
);
export default tokenAxios;
