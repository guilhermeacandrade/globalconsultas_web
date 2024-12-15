import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL as string,
});

export { api };
