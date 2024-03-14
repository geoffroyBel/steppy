import api from "../../api";


export async function getProfilBadge() {
    try {
      const { data } = await api.get(`/users/badges`, {
        withCredentials: true,
      });
      return data;
    } catch (error: unknown) {
      throw new Error("Fail get badge of user");
    }
  }

  // export async function getProfilAvatar() {
  //   try {
  //     const { data } = await api.get(`/users/badges`, {
  //       withCredentials: true,
  //     });
  //     return data;
  //   } catch (error: unknown) {
  //     throw new Error("Fail get User badge");
  //   }
  // }