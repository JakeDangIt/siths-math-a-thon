// function to get the first name of a user
export const useFirstName = (user) => {
  const [first] = user.split(' ');
  return first
    ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
    : '';
};
