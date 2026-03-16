import { Team, Player, Match, TeamStanding } from '@/data/types';

/**
 * Calculates head-to-head record between two teams
 * Returns: positive if team1 is better, negative if team2 is better, 0 if equal
 */
function calculateHeadToHead(team1Id: string, team2Id: string, matches: Match[]): number {
  // Find matches between these two teams
  const h2hMatches = matches.filter(match => 
    (match.team1Id === team1Id && match.team2Id === team2Id) ||
    (match.team1Id === team2Id && match.team2Id === team1Id)
  );

  if (h2hMatches.length === 0) return 0;

  let team1Points = 0;
  let team1Goals = 0;
  let team2Points = 0;
  let team2Goals = 0;

  h2hMatches.forEach(match => {
    const isTeam1Home = match.team1Id === team1Id;
    const team1Score = isTeam1Home ? (match.team1Score ?? 0) : (match.team2Score ?? 0);
    const team2Score = isTeam1Home ? (match.team2Score ?? 0) : (match.team1Score ?? 0);

    team1Goals += team1Score;
    team2Goals += team2Score;

    if (team1Score > team2Score) {
      team1Points += 3;
    } else if (team1Score === team2Score) {
      team1Points += 1;
      team2Points += 1;
    } else {
      team2Points += 3;
    }
  });

  // Compare head-to-head points first
  if (team1Points !== team2Points) {
    return team1Points - team2Points;
  }

  // If h2h points are equal, compare h2h goal difference
  const team1H2HGD = team1Goals - team2Goals;
  const team2H2HGD = team2Goals - team1Goals;
  
  if (team1H2HGD !== team2H2HGD) {
    return team1H2HGD - team2H2HGD;
  }

  // If h2h goal difference is equal, compare h2h goals for
  return team1Goals - team2Goals;
}


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
      disciplinaryPoints: yellowCards + (redCards * 2), // 2 yellow = 1 red
    };
  });

  // Sort: FIFA standard criteria
  return standings.sort((a, b) => {
    // 1. Points (descending)
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Head-to-head record (when teams have same points)
    const h2hResult = calculateHeadToHead(a.team.id, b.team.id, groupMatches);
    if (h2hResult !== 0) return h2hResult;
    
    // 3. Goal difference (descending)
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    
    // 4. Goals for (descending)
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    
    // 5. Fair play - disciplinary points (ascending - fewer cards = better)
    return a.disciplinaryPoints - b.disciplinaryPoints;
  });
}

/**
 * Gets the top 5 best runner-ups (2nd place teams) across all groups.
 * Used for qualification to Round of 16.
 * 
 * Ranking criteria (FIFA standard):
 * 1. Points (descending)
 * 2. Goal difference (descending) 
 * 3. Goals for (descending)
 * 4. Fair play - disciplinary points (ascending - fewer cards = better)
 * 
 * Note: Head-to-head not applicable for inter-group comparison
 */
export function getTop5RunnerUps(
  allGroupStandings: TeamStanding[][]
): Team[] {
  // Get all runner-ups (2nd place from each group)
  const runnerUps = allGroupStandings
    .map(standings => standings[1]) // Get 2nd place
    .filter(Boolean); // Filter out undefined if group has < 2 teams

  // Sort runner-ups by FIFA criteria (no head-to-head for inter-group)
  const sortedRunnerUps = runnerUps.sort((a, b) => {
    // 1. Points (descending)
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Goal difference (descending)
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    
    // 3. Goals for (descending)
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    
    // 4. Fair play - disciplinary points (ascending - fewer cards = better)
    return a.disciplinaryPoints - b.disciplinaryPoints;
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