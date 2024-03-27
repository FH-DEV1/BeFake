import { formatToTimeZone } from 'date-fns-timezone';

export function UTCtoParisTime(utcTime: string, t: Function): string {
  const timezone = {
    "fr": "fr-FR",
    "en": "en-US"
  }
  const frTime = formatToTimeZone(new Date(utcTime), 'YYYY-MM-DDTHH:mm:ss.SSSSZ', { timeZone: 'Europe/Paris' });
  const date = new Date(frTime)
  const UTCdate = new Date();
  let timeString = date.toLocaleTimeString(timezone[t("lng") as "fr" | "en"]);
  if (date.getDate() < UTCdate.getDate()) {
    timeString = t("YesterdayAt", {timestring: timeString});
  }
  return timeString;
}

export function formatTimeLate(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);

    if (seconds >= 3600) {
      return `${hours}h`;
    } else if (seconds >= 60){
      return `${minutes} min`;
    } else {
      return `${seconds}s`;
    }
}

export function UTCtoParisDate(utcTime: string, lng: "fr" | "en"): string {
  const timezone = {
    "fr": "fr-FR",
    "en": "en-US"
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const date = new Date(utcTime);
  const localTime = date.toLocaleDateString(timezone[lng], options);

  return localTime;
};

export function formatDate(dateString: string, t: Function): string {
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
      return `${elapsedYears} ${t("Year")}${elapsedYears > 1 ? t("Plural") : ''}`;
  } else if (elapsedMonths > 0) {
      return `${elapsedMonths} ${t("Month")}`;
  } else if (elapsedDays > 0) {
      return `${elapsedDays} ${t("Day")}${elapsedDays > 1 ? t("Plural") : ''}`;
  } else if (elapsedHours > 0) {
      return `${elapsedHours} ${t("Hour")}${elapsedHours > 1 ? t("Plural") : ''}`;
  } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} ${t("Minute")}${elapsedMinutes > 1 ? t("Plural") : ''}`;
  } else {
      return `${elapsedSeconds} ${t("Seconde")}${elapsedSeconds > 1 ? t("Plural") : ''}`;
  }
}