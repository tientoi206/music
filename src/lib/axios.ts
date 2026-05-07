import axios from 'axios';

export const mockApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MOCKAPI_URL || "https://your-project.mockapi.io/api/v1",
  timeout: 10000,
});
