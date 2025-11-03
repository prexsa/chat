const convertToHumanReadable = (unix) => {
  const date = new Date(unix * 1000);
  return date.toLocaleString([], { timeStyle: 'short' });
};
// console.log('selectedRoom; ', selectedRoom);

export { convertToHumanReadable };
