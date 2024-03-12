import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config";
import { TOKEN } from "../store/actions/auth";

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN);

    if (token && config.withCredentials) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.Authorization = "";
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default instance;
