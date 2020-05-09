const days_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getMonday = (date) => {
  date = date ? new Date(date) : new Date();
  const day = date.getDay(),
    diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const getSunday = (date) => {
  date = date ? new Date(date) : new Date();
  const day = date.getDay(),
    diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const getShortDate = (date) => {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

const getDateString = (date) => {
  const day = days_EN[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = months_EN[date.getMonth()];
  const yyyy = date.getFullYear();

  return `${day}, ${dd} ${mm} ${yyyy}`;
};

const getTimeString = (date) => {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
};

const isSameDay = (d1, d2) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export default {
  days_EN,
  months_EN,
  addDays,
  getMonday,
  getSunday,
  getShortDate,
  getDateString,
  getTimeString,
  isSameDay,
};
