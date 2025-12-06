import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: "https://api.recomind.site/api/Authentication",
});
