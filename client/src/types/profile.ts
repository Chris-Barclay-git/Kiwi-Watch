// A user's XP and level, as the server sends it.
export interface Profile {
  xp: number // total XP earned
  level: number // starts at 1
  xpIntoLevel: number // XP earned since reaching the current level
  xpPerLevel: number // XP needed to reach the next level
}
