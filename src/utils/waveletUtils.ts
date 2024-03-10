export const lastDayOfMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

export const currentDayOfMonth = () => new Date().getDate();
