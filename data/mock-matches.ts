import { Match } from './types';

/**
 * Mock matches data structure
 * Initially empty - matches will be generated after group drawing is confirmed
 * Group stage: 6 matches per group (round-robin format) = 48 total matches
 * Each team plays every other team in their group exactly once
 * 
 * Requirements: 7.1 - Generate 6 matches per group in round-robin format
 */
export const mockMatches: Match[] = [];

/**
 * Helper function to generate round-robin matches for a group
 * Given 4 teams [T1, T2, T3, T4], generates 6 matches:
 * 1. T1 vs T2
 * 2. T3 vs T4
 * 3. T1 vs T3
 * 4. T2 vs T4
 * 5. T1 vs T4
 * 6. T2 vs T3
 * 
 * @param groupLetter - The group letter (A-H)
 * @param teamIds - Array of 4 team IDs in the group
 * @returns Array of 6 Match objects
 */
export function generateGroupMatches(
  groupLetter: string,
  teamIds: [string, string, string, string]
): Match[] {
  const [t1, t2, t3, t4] = teamIds;
  const matchPairs: [string, string][] = [
    [t1, t2],
    [t3, t4],
    [t1, t3],
    [t2, t4],
    [t1, t4],
    [t2, t3],
  ];

  return matchPairs.map(([team1Id, team2Id], index) => ({
    id: `match-group-${groupLetter}-${index + 1}`,
    stage: 'group' as const,
    group: groupLetter,
    team1Id,
    team2Id,
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending' as const,
    events: [],
    date: undefined,
  }));
}
