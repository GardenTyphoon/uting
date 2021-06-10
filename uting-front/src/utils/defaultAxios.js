import axios from "axios";

const defaultAxios = axios.create({
  baseURL: "/api",
  timeout: 1000,
});

export default defaultAxios;
