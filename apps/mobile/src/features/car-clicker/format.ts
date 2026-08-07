export function formatCarClickerCash(value: number) {
  return Math.floor(value).toLocaleString('pl-PL');
}

export function formatCarClickerDuration(totalSeconds: number) {
  const seconds = Math.floor(Math.max(totalSeconds, 0));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
      ? `${hours} h ${remainingMinutes} min`
      : `${hours} h`;
  }

  if (minutes > 0) {
    return `${minutes} min`;
  }

  return `${seconds} s`;
}
