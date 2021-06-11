import axios from "axios";

const defaultAxios = axios.create({
  baseURL: "http://localhost:3001/",
});

export default defaultAxios;
