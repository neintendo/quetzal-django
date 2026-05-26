function PreviousMonth() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() - 1;
  if (month === 0) {
    month = 11;
    year -= 1;
  }
  const formattedFirstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const formattedLastDay = `${year}-${String(month + 1).padStart(2, "0")}-${numberOfDays}`;

  return {
    previousMonth: formattedFirstDay,
    previousMonthLastDay: formattedLastDay,
    prevMonthNumberOfDays: numberOfDays,
  };
}
export default PreviousMonth;
