export function getLast30Days() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return { start, end };
}

export function getPrevious30Days() {
  const end = new Date();
  end.setDate(end.getDate() - 30);
  const start = new Date(end);
  start.setDate(end.getDate() - 30);
  return { start, end };
}

export function calcPercentChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}