import api from "../../api";
import axios from "axios";
import { DailySteps } from "../../types";
import { getMaxLastUpdateDate } from "../../utils/stepUtils";
import { API_URL } from "../../config";

export async function getAllBadgeIndividual() {
    try {
      const { data } = await api.get(`/badges/individuals`, {
        withCredentials: true,
      });
      return data;
    } catch (error: unknown) {
      throw new Error("Fail get Badges individual");
    }
  }

export async function getAllBadgeGlobal() {
    try {
      const { data } = await api.get(`/badges/globals`, {
        withCredentials: true,
      });
      return data;
    } catch (error: unknown) {
      throw new Error("Fail get Badges global");
    }
  }

