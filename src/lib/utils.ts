import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict, getDaysInMonth, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import locale from "date-fns/locale/id";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysInMonths(month: string, year?: string) {
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const currentYear = new Date().getFullYear();
  const index = monthNames.indexOf(month);

  if (!year) {
    const result = getDaysInMonth(new Date(currentYear, index));
    return result;
  } else {
    const result = getDaysInMonth(new Date(Number(year), index));
    return result;
  }
}

export function generateYearArray() {
  const currentYear = new Date().getFullYear();
  const startYear = 1950;

  const yearArray = [];

  for (let year = currentYear; year >= startYear; year--) {
    yearArray.push({ value: year.toString(), label: year.toString() });
  }

  return yearArray;
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result;
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

export function removeAtSymbol(username: string) {
  if (username.startsWith("@")) {
    return username.substring(1); // Remove the "@" character
  } else {
    return username;
  }
}

export function formatBirthdate(inputDate: string): string {
  const parsedDate = parseISO(inputDate);
  return format(parsedDate, "MMMM dd, yyyy");
}

export function formatJoinDate(inputDate: Date): string {
  const mysqlDatetime = "2023-10-04T14:17:48.700Z";

  // Parse the MySQL datetime string into a JavaScript Date object
  const date = new Date(mysqlDatetime);

  // Use date-fns to format the date in the "MMMM yyyy" format
  return format(date, "MMMM yyyy");
}

export function formatSinglePostDate(mysqlDatetime: Date = new Date()) {
  const jsDate = new Date(mysqlDatetime);

  // Format the date in the desired output format
  const formattedDate = format(jsDate, "h:mm a · MMM d, yyyy");

  return formattedDate;
}

export function truncateString(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  } else {
    return input.substring(0, maxLength - 3) + "...";
  }
}
