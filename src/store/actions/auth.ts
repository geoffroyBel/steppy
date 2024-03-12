import axios from "axios";
import { Credentials } from "../../types";
import { API_URL } from "../../config";
const API_KEY = "AIzaSyDTsF8_CZHX5io1xBmrPy8n4Od4YBvT4AE";
export const TOKEN = "fbtoken";
export async function createuser(email: string, password: string) {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  } catch (error: unknown) {
    throw new Error("Fail create User");
  }
}

export async function signinWithFb(email: string, password: string) {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    return data.idToken;
  } catch (error: unknown) {
    throw new Error("Fail login User");
  }
}

export async function signin({ code, password }: Credentials) {
  console.log(code);
  console.log(password);
  try {
    const { data } = await axios.post(`${API_URL}/login`, {
      code,
      password,
    });
    return data.access_token;
  } catch (error: unknown) {
    throw new Error("Fail login User");
  }
}
