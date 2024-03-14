import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, FC, useEffect, useMemo, useState, useContext } from "react";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { getUser, TOKEN } from "../store/actions/auth";
import { User } from "../types";

export type IAuthContext = {
  token: string | undefined;
  isAuthenticated: boolean;
  authenticate: (token: string) => void;
  logout: () => void;
  user?: User;
  error?: string;
};

export const AuthContext = createContext<IAuthContext>({
  token: undefined,
  isAuthenticated: false,
  authenticate: () => undefined,
  logout: () => undefined,
  user: undefined,
  error: undefined,
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User | undefined>();
  const [error, setError] = useState<string | undefined>();

  const authenticate = async (token: string) => {
    setToken(token);
    await AsyncStorage.setItem(TOKEN, token);
    try {
      const _user = await getUser();
      setUser(_user);
      console.log("USER IS OK");
      console.log(_user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Impossible de recuperer le profil");
      }
    }
  };

  const logout = () => {
    setToken(undefined);
    AsyncStorage.removeItem(TOKEN);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      authenticate,
      logout,
      user,
    }),
    [token, user, error]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
