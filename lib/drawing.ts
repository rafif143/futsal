import { GroupAssignment, Match, Team } from '@/data/types';

const GROUP_LABELS: GroupAssignment['group'][] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

/**
 * Randomly distributes teams into 11 groups of 3 using Fisher-Yates shuffle.
 * Each team appears in exactly one group.
 */
export function randomizeGroups(teams: Team[]): GroupAssignment[] {
  // Fisher-Yates shuffle on a copy of the array
  const shuffled = [...teams];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Distribute 3 teams per group
  return GROUP_LABELS.map((group, index) => ({
    group,
    teams: shuffled.slice(index * 3, index * 3 + 3),
  }));
}

/**
 * Generate round-robin matches for groups of 3 teams.
 * Each team plays every other team once (3 matches per group).
 */
export function generateRoundRobinMatches(groups: GroupAssignment[]): Match[] {
  const matches: Match[] = [];

  for (const { group, teams } of groups) {
    // Skip groups with less than 2 teams
    if (teams.length < 2) continue;
    
    // Generate all possible pairs (round robin)
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: `match-${group}-${i + 1}-${j + 1}`,
          stage: 'group',
          group,
          team1Id: teams[i].id,
          team2Id: teams[j].id,
          status: 'pending',
          events: [],
        });
      }
    }
  }

  return matches;
}
