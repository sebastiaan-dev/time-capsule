import axios from "axios";
import { API_BASE_URL } from "../config";

export default axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
