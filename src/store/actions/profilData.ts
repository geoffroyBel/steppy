import api from "../../api";
import axios from "axios";
import { DailySteps } from "../../types";
import { getMaxLastUpdateDate } from "../../utils/stepUtils";
import { API_URL } from "../../config";

export async function getProfilAvatar() {
    try {
      const { data } = await axios.post(`${API_URL}/api/users/badges`);
      return { data };
    } catch (error: unknown) {
      throw new Error("Fail get User badge");
    }
  }