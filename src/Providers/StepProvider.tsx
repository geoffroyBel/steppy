import { createContext, useCallback, useMemo, useState } from "react";
import { GetPodemeterStep, IStepContext, Range } from "../types";
import Podometer from "../podometer/Podometer";
import { updateDailySteps } from "../store/actions/dailySteps";

export const StepContext = createContext<IStepContext>({
  isLoading: true,
  handleUpdateDaily: undefined,
  handleFetchDaily: undefined,
});

const StepProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const podometer = Podometer();
  const [lastUpdateTime, setLastUpdateTime] = useState();
  const [isLoading, setIsloading] = useState(false);

  const getPodometerStep: GetPodemeterStep = useMemo(
    () => (podometer && podometer.getSteps ? podometer.getSteps : undefined),
    [podometer]
  );

  const handleUpdateDaily = useCallback(async () => {
    if (getPodometerStep) {
      await updateDailySteps(getPodometerStep);
    }
  }, [getPodometerStep]);

  const handleFetchDaily = useCallback(
    async ({ from, to }: Range) => {
      return getPodometerStep({ from, to });
    },
    [getPodometerStep]
  );
  const value = useMemo(
    () => ({
      isLoading,
      handleUpdateDaily,
      handleFetchDaily,
    }),
    [isLoading, handleUpdateDaily, handleFetchDaily]
  );
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
export default StepProvider;
