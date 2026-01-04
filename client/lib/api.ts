import axios from "axios";

// 환경 변수에서 API URL 가져오기 (기본값: localhost:4000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
