export function UTCtoParisTime(utcTime: string) {
    const date = new Date(utcTime);
    const localTime = date.toLocaleTimeString('en-US', { hour12: false });
    return localTime;
};

export function formatTime(seconds: number) {
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);

    if (seconds >= 3600) {
      return `${hours}h late`;
    } else if (seconds >= 60){
      return `${minutes} min late`;
    } else {
      return `${seconds}s late`;
    }
}

export function UTCtoParisDate(utcTime: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const date = new Date(utcTime);
  const localTime = date.toLocaleDateString('fr-FR', options);

  return localTime;
};