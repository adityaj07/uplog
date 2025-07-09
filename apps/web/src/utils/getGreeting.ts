export const getGreeting = () => {
  const hour = new Date().getHours();

  const greetings = {
    earlyMorning: [
      "You're up early",
      "Early bird gets the worm!",
      "Awake before the world?",
    ],
    morning: [
      "Good morning",
      "Hope you're ready for a great day",
      "Rise and shine!",
    ],
    midMorning: [
      "Hope your morning’s going well",
      "A productive morning to you",
      "You're smashing it already!",
    ],
    earlyAfternoon: [
      "Good afternoon",
      "Hope you had a good lunch",
      "Keep the momentum going!",
    ],
    lateAfternoon: [
      "Hope your afternoon’s productive",
      "Powering through the afternoon?",
      "You're doing great!",
    ],
    earlyEvening: [
      "Good evening",
      "Hope you're winding down well",
      "Wrapping up a solid day?",
    ],
    night: [
      "Hope you're winding down nicely",
      "Almost time to relax",
      "Evenings are for reflection",
    ],
    lateNight: [
      "Good night",
      "Time to rest and recharge",
      "You deserve some sleep!",
    ],
    midnight: [
      "Burning the midnight oil?",
      "Late night hustle?",
      "You’re a true night owl!",
    ],
  };

  const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (hour >= 4 && hour < 6) return random(greetings.earlyMorning);
  if (hour >= 6 && hour < 9) return random(greetings.morning);
  if (hour >= 9 && hour < 12) return random(greetings.midMorning);
  if (hour >= 12 && hour < 14) return random(greetings.earlyAfternoon);
  if (hour >= 14 && hour < 17) return random(greetings.lateAfternoon);
  if (hour >= 17 && hour < 19) return random(greetings.earlyEvening);
  if (hour >= 19 && hour < 21) return random(greetings.night);
  if (hour >= 21 && hour < 24) return random(greetings.lateNight);
  return random(greetings.midnight);
};
