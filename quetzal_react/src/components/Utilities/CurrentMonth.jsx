function CurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const formattedFirstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  return {
    currentMonth: formattedFirstDay,
  };
}
export default CurrentMonth;
