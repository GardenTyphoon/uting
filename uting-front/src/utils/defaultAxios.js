import axios from "axios";

const defaultAxios = axios.create({
  baseURL: "http://localhost:3001",
<<<<<<< Updated upstream
  //timeout: 1000,
=======
  timeout: 1000,
>>>>>>> Stashed changes
});

export default defaultAxios;
