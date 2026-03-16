import { Match, MatchResult, Player, Team, GroupAssignment } from '@/data/types';

/**
 * Generates empty match slots for group stage.
 * Creates placeholder matches that can be filled with team matchups later.
 */
export function generateEmptyGroupMatches(totalDays: number = 5, matchesPerDay: number = 6): Match[] {
  const matches: Match[] = [];
  
  for (let day = 1; day <= totalDays; day++) {
    for (let matchNum = 1; matchNum <= matchesPerDay; matchNum++) {
      const matchId = `D${day}M${matchNum}`;
      matches.push({
        id: matchId,
        stage: 'group',
        team1Id: '', // Empty - to be filled later
        team2Id: '', // Empty - to be filled later
        status: 'pending',
        events: [],
        // Optional scheduling fields
        date: undefined,
        time: undefined,
        venue: undefined,
      });
    }
  }
  
  return matches;
}

/**
 * Assigns team matchup to an empty match slot.
 * Updates the match with team1Id and team2Id, and optionally group.
 */
export function assignMatchup(
  matchId: string, 
  team1Id: string, 
  team2Id: string, 
  group?: string
): Partial<Match> {
  return {
    team1Id,
    team2Id,
    group,
  };
}

/**
 * Gets available teams for a specific group that can be matched.
 * Returns teams that are in the specified group.
 */
export function getAvailableTeamsForGroup(
  group: string, 
  teams: Team[], 
  groupAssignments: GroupAssignment[]
): Team[] {
  const groupAssignment = groupAssignments.find(g => g.group === group);
  if (groupAssignment) {
    return groupAssignment.teams;
  }
  
  // Fallback: filter teams by group property
  return teams.filter(team => team.group === group);
}

/**
 * Applies a match result to the matches array.
 * Returns a new array with the target match updated (scores, events, status='completed').
 * Pure function - does not mutate inputs.
 */
export function applyMatchResult(result: MatchResult, matches: Match[]): Match[] {
  return matches.map((match) => {
    if (match.id !== result.matchId) return match;
    return {
      ...match,
      team1Score: result.team1Score,
      team2Score: result.team2Score,
      events: result.events,
      status: 'completed' as const,
    };
  });
}

/**
 * Updates player statistics based on match events in the result.
 * Counts goals, yellowCards, and redCards per player from the events array.
 * Returns a new array with updated player stats.
 * Pure function - does not mutate inputs.
 */
export function updatePlayerStats(result: MatchResult, players: Player[]): Player[] {
  // Tally event counts per player from this match result
  const goalCounts: Record<string, number> = {};
  const yellowCardCounts: Record<string, number> = {};
  const redCardCounts: Record<string, number> = {};

  for (const event of result.events) {
    if (event.type === 'goal') {
      goalCounts[event.playerId] = (goalCounts[event.playerId] ?? 0) + 1;
    } else if (event.type === 'yellowCard') {
      yellowCardCounts[event.playerId] = (yellowCardCounts[event.playerId] ?? 0) + 1;
    } else if (event.type === 'redCard') {
      redCardCounts[event.playerId] = (redCardCounts[event.playerId] ?? 0) + 1;
    }
  }

  return players.map((player) => {
    const addedGoals = goalCounts[player.id] ?? 0;
    const addedYellow = yellowCardCounts[player.id] ?? 0;
    const addedRed = redCardCounts[player.id] ?? 0;

    if (addedGoals === 0 && addedYellow === 0 && addedRed === 0) return player;

    return {
      ...player,
      goals: player.goals + addedGoals,
      yellowCards: player.yellowCards + addedYellow,
      redCards: player.redCards + addedRed,
    };
  });
}
