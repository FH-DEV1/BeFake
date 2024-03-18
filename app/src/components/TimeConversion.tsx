import { formatToTimeZone } from 'date-fns-timezone';

export function UTCtoParisTime(utcTime: string): string {
  const frTime = formatToTimeZone(new Date(utcTime), 'YYYY-MM-DDTHH:mm:ss.SSSSZ', { timeZone: 'Europe/Paris' });
  const date = new Date(frTime)
  const UTCdate = new Date();
  let timeString = date.toLocaleTimeString('fr-FR');
  if (date.getDate() < UTCdate.getDate()) {
    timeString = `Hier a ${timeString}`;
  }
  return timeString;
}

export function formatTime(seconds: number): string {
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

export function UTCtoParisDate(utcTime: string): string {
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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();
  const elapsedMilliseconds = currentDate.getTime() - date.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedYears = Math.floor(elapsedMonths / 12);

  if (elapsedYears > 0) {
      return `Amis depuis ${elapsedYears} année${elapsedYears > 1 ? 's' : ''}`;
  } else if (elapsedMonths > 0) {
      return `Amis depuis ${elapsedMonths} mois`;
  } else if (elapsedDays > 0) {
      return `Amis depuis ${elapsedDays} jour${elapsedDays > 1 ? 's' : ''}`;
  } else if (elapsedHours > 0) {
      return `Amis depuis ${elapsedHours} heure${elapsedHours > 1 ? 's' : ''}`;
  } else if (elapsedMinutes > 0) {
      return `Amis depuis ${elapsedMinutes} minute${elapsedMinutes > 1 ? 's' : ''}`;
  } else {
      return `Amis depuis ${elapsedSeconds} seconde${elapsedSeconds > 1 ? 's' : ''}`;
  }
}