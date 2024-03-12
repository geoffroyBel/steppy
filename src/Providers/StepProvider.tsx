import { createContext, useMemo, useState } from "react";
import { IStepContext } from "../types";
import Podometer from "../podometer/Podometer";

export const StepContext = createContext<IStepContext>({
  isLoading: true,
});

const StepProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const podometer = Podometer();
  const [lastUpdateTime, setLastUpdateTime] = useState();
  const [isLoading, setIsloading] = useState(false);

  const value = useMemo(
    () => ({
      isLoading,
    }),
    [isLoading]
  );
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
