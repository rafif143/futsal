import { Team, Player, Match, TeamStanding } from '@/data/types';

/**
 * Calculates group standings for a given group.
 *
 * Points: (wins × 3) + (draws × 1)
 * Sort: points desc → goal difference desc → goals for desc
 *
 * Validates: Requirements 10.3, 10.4
 */
export function calculateGroupStandings(
  group: string,
  teams: Team[],
  matches: Match[],
  players: Player[]
): TeamStanding[] {
  // Only consider completed matches in this group
  const groupMatches = matches.filter(
    (m) => m.group === group && m.status === 'completed'
  );

  const standings: TeamStanding[] = teams.map((team) => {
    const teamMatches = groupMatches.filter(
      (m) => m.team1Id === team.id || m.team2Id === team.id
    );

    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    for (const match of teamMatches) {
      const isTeam1 = match.team1Id === team.id;
      const scored = isTeam1 ? (match.team1Score ?? 0) : (match.team2Score ?? 0);
      const conceded = isTeam1 ? (match.team2Score ?? 0) : (match.team1Score ?? 0);

      goalsFor += scored;
      goalsAgainst += conceded;

      if (scored > conceded) won++;
      else if (scored === conceded) drawn++;
      else lost++;
    }

    // Cards are derived from match events for players belonging to this team
    const teamPlayerIds = new Set(
      players.filter((p) => p.teamId === team.id).map((p) => p.id)
    );

    let yellowCards = 0;
    let redCards = 0;

    for (const match of groupMatches) {
      for (const event of match.events) {
        if (!teamPlayerIds.has(event.playerId)) continue;
        if (event.type === 'yellowCard') yellowCards++;
        else if (event.type === 'redCard') redCards++;
      }
    }

    return {
      team,
      played: teamMatches.length,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
      yellowCards,
      redCards,
    };
  });

  // Sort: points desc → goal difference desc → goals for desc
  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

/**
 * Gets the top 5 best runner-ups (2nd place teams) across all groups.
 * Used for qualification to Round of 16.
 * 
 * Ranking criteria:
 * 1. Points (descending)
 * 2. Goal difference (descending)
 * 3. Goals scored (descending)
 */
export function getTop5RunnerUps(
  allGroupStandings: TeamStanding[][]
): Team[] {
  // Get all runner-ups (2nd place from each group)
  const runnerUps = allGroupStandings
    .map(standings => standings[1]) // Get 2nd place
    .filter(Boolean); // Filter out undefined if group has < 2 teams

  // Sort runner-ups by same criteria
  const sortedRunnerUps = runnerUps.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  // Return top 5 teams
  return sortedRunnerUps.slice(0, 5).map(standing => standing.team);
}

/**
 * Gets all qualified teams for Round of 16.
 * - All 11 group winners (1st place)
 * - Top 5 runner-ups (2nd place)
 * Total: 16 teams
 */
export function getQualifiedTeamsForRound16(
  allGroupStandings: TeamStanding[][]
): Team[] {
  // Get all group winners (1st place)
  const groupWinners = allGroupStandings
    .map(standings => standings[0]) // Get 1st place
    .filter(Boolean)
    .map(standing => standing.team);

  // Get top 5 runner-ups
  const top5RunnerUps = getTop5RunnerUps(allGroupStandings);

  return [...groupWinners, ...top5RunnerUps];
}
