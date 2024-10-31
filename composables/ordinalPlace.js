// function to get the ordinal place, if 11th, 12th, or 13th, return the number with th
export const useOrdinalPlace = (place) => {
  const onesDigit = place % 10,
    specialNotTeens = place % 100;
  if (onesDigit == 1 && specialNotTeens != 11) {
    return place + 'st';
  }
  if (onesDigit == 2 && specialNotTeens != 12) {
    return place + 'nd';
  }
  if (onesDigit == 3 && specialNotTeens != 13) {
    return place + 'rd';
  }
  return place + 'th';
};
