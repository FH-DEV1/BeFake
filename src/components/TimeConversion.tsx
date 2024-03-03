import { formatToTimeZone } from 'date-fns-timezone';

export function UTCtoParisTime(utcTime: string) {
  const frTime = formatToTimeZone(new Date(utcTime), 'YYYY-MM-DDTHH:mm:ss.SSSSZ', { timeZone: 'Europe/Paris' });
  const date = new Date(frTime)
  const UTCdate = new Date();
  let timeString = date.toLocaleTimeString('fr-FR');
  if (date.getDate() < UTCdate.getDate()) {
    timeString = `Hier a ${timeString}`;
  }
  return timeString;
}

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