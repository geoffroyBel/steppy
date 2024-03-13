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
  handleFetchStats: () => Promise.resolve(),
});

const StepProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const podometer = Podometer();
  const [stats, setStats] = useState<IChallenge>();
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState<string>();
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

  const handleFetchStats = async (): Promise<void> => {
    try {
      const data = await getStats();
      setStats(data);
      setTotalSteps(data.totalSteps);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Nous avons nous aussi encore des etapes a franchir");
        // Gérer d'autres types d'erreurs ici si nécessaire
      }
    }
  };
  const value = useMemo(
    () => ({
      stats,
      totalSteps,
      isLoading,
      handleUpdateDaily,
      handleFetchDaily,
      handleFetchStats,
    }),
    [isLoading, handleUpdateDaily, handleFetchDaily, totalSteps]
  );
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};
export default StepProvider;
