// Every 20 XP is a new level.
export const XP_PER_LEVEL = 20

export interface LevelInfo {
  level: number // starts at 1
  xpIntoLevel: number // XP earned since reaching the current level
  xpPerLevel: number // XP needed to reach the next level
}

// Works out the level for a total amount of XP.
export function levelForXp(xp: number): LevelInfo {
  // Negative or part-number XP shouldn't happen, but we make sure it can't break the maths.
  const wholeXp = Math.max(0, Math.floor(xp))

  return {
    level: Math.floor(wholeXp / XP_PER_LEVEL) + 1,
    xpIntoLevel: wholeXp % XP_PER_LEVEL,
    xpPerLevel: XP_PER_LEVEL,
  }
}
