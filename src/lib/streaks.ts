export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!today) return 0;
  
  const uniqueDates = Array.from(new Set(completions)).sort((a, b) => b.localeCompare(a));
  
  if (!uniqueDates.includes(today)) {
    return 0;
  }

  let streak = 0;
  const currentDate = new Date(today);

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDateStr = currentDate.toISOString().split('T')[0];
    if (uniqueDates.includes(expectedDateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
