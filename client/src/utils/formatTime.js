export const formatMessageTime = (createdAt) => {
  const messageDate = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare only dates
  const msgDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  // Format time (HH:MM)
  const time = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Compare dates
  if (msgDateOnly.getTime() === todayOnly.getTime()) {
    return time; // "14:30"
  } else if (msgDateOnly.getTime() === yesterdayOnly.getTime()) {
    return `Yesterday, ${time}`; // "Yesterday, 14:30"
  } else {
    // Format as "Jan 23" or "23/01" depending on locale
    const monthDay = messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    return `${monthDay}, ${time}`;
  }
};
