const currentTime = new Date();

export const getGreeting = () => {
  const hour = currentTime.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
