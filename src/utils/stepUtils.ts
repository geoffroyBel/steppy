import dayjs from "dayjs";
export const getMaxLastUpdateDate = (
  from: string,
  to: string
): { max: number; lastUpdatedate: dayjs.Dayjs } => {
  var previous = dayjs(from);
  var now = dayjs(to);
  const days_diff = now.diff(previous, "day");
  let max;
  if (days_diff > 30) {
    max = 30;
  } else {
    max = days_diff;
  }

  return { max, lastUpdatedate: dayjs().subtract(max) };
};
