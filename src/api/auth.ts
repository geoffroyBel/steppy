import axios from "axios";
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

export async function signin(email: string, password: string) {
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
