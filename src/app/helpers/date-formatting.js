export const getStringMonth = (monthNumber) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return months[monthNumber];
};

export const getMonthFromString = (monthName) => {
  const date = Date.parse(monthName + ' 1, 2018');
  if (!isNaN(date)) {
    return new Date(date).getMonth() + 1;
  }
  return -1;
};

export const getShortMonthName = (monthName) => {
  const months = {
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec'
  };

  return months[monthName.toLowerCase()];
};