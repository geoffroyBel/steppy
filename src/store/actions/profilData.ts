import api from "../../api";
import { DailySteps } from "../../types";
import { getMaxLastUpdateDate } from "../../utils/stepUtils";

export async function getProfilAvatar() {
    try {
      const {
        data: { day, stepCount },
      } = await api.get(`/daily-steps/user/last`, {
        withCredentials: true,
      });
      return { day, stepCount };
    } catch (error: unknown) {
      throw new Error("Fail create User");
    }
  }