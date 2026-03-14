import { Match, MatchResult, Player } from '@/data/types';

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
