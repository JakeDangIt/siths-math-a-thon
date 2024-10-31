// function to get the first name of a user
export const useFirstName = (user) => {
  if (!user) return;
  const [first] = user.split(' ');
  return first
    ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
    : '';
};
