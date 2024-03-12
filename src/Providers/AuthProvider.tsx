import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, FC, useEffect, useMemo, useState } from "react";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { TOKEN } from "../store/actions/auth";

export type IAuthContext = {
  token: string | undefined;
  isAuthenticated: boolean;
  authenticate: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<IAuthContext>({
  token: undefined,
  isAuthenticated: false,
  authenticate: () => undefined,
  logout: () => undefined,
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string>();

  const authenticate = (token: string) => {
    // console.log("set token:", token);

    setToken(token);
    AsyncStorage.setItem(TOKEN, token);
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
    }),
    [token]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
