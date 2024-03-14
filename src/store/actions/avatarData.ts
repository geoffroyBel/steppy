import api from "../../api";
import axios from "axios";
import { DailySteps } from "../../types";
import { getMaxLastUpdateDate } from "../../utils/stepUtils";
import { API_URL } from "../../config";

export async function getAllAvatar() {
    try {
      const { data } = await api.get(`/avatars`, {
        withCredentials: true,
      });
      return data;
    } catch (error: unknown) {
      throw new Error("Fail get Avatars");
    }
  }

