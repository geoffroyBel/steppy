import api from "../../api";
import { IChallenge } from "../../types";
export async function getStats(): Promise<IChallenge> {
  try {
    const { data } = await api.get(`/stats`, {
      withCredentials: true,
    });
    return data;
  } catch (error: unknown) {
    console.log(error);

    throw new Error("Get Stat");
  }
}
