import { createContext, useCallback, useMemo, useState } from "react";
import { GetPodemeterStep, IChallenge, IStepContext, Range } from "../types";
import Podometer from "../podometer/Podometer";
import { updateDailySteps } from "../store/actions/dailySteps";
import { getStats } from "../store/actions/stats";

export const StepContext = createContext<IStepContext>({
  totalSteps: 0,
  isLoading: true,
  handleUpdateDaily: undefined,
  handleFetchDaily: undefined,
  handleFetchTotals: undefined,
});

const StepProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const podometer = Podometer();
  const [lastUpdateTime, setLastUpdateTime] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [totalSteps, setTotalSteps] = useState(0);

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

  const handleFetchTotals = async (): Promise<IChallenge> => {
    const data = await getStats();

    setTotalSteps(data.totalSteps);
  };
  const value = useMemo(
    () => ({
      totalSteps,
      isLoading,
      handleUpdateDaily,
      handleFetchDaily,
      handleFetchTotals,
    }),
    [isLoading, handleUpdateDaily, handleFetchDaily, totalSteps]
  );
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
export default StepProvider;
