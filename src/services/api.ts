import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-chama.up.railway.app/", 
});

export default api;
