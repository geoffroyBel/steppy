import { createContext, useMemo, useState } from "react";
import { IStepContext } from "../types";
import Podometer from "../podometer/Podometer";

export const StepContext = createContext<IStepContext>({
  isLoading: true,
  getPodometerStep: undefined,
});

const StepProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const podometer = Podometer();
  const [lastUpdateTime, setLastUpdateTime] = useState();
  const [isLoading, setIsloading] = useState(false);

  const getPodometerStep = useMemo(
    () => (podometer && podometer.getSteps ? podometer.getSteps : undefined),
    [podometer]
  );

  const value = useMemo(
    () => ({
      isLoading,
      getPodometerStep,
    }),
    [isLoading]
  );
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
export default StepProvider;
