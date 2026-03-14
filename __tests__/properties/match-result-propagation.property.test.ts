/**
 * Property-Based Tests for Match Result Propagation
 * Feature: futsal-tournament-management-system
 */

// Feature: futsal-tournament-management-system, Property 15: Match Result Propagation

import fc from 'fast-check';
import { applyMatchResult, updatePlayerStats } from '../../lib/match-utils';
import { Match, MatchEvent, MatchResult, Player } from '../../data/types';

/**
 * Arbitrary for generating a MatchEvent
 */
const eventTypeArbitrary = fc.constantFrom('goal', 'yellowCard', 'redCard') as fc.Arbitrary<'goal' | 'yellowCard' | 'redCard'>;

const matchEventArbitrary = (matchId: string, playerIds: string[], teamIds: string[]) =>
  fc.record({
    id: fc.uuid(),
    matchId: fc.constant(matchId),
    playerId: fc.constantFrom(...playerIds),
    teamId: fc.constantFrom(...teamIds),
    minute: fc.integer({ min: 1, max: 90 }),
    type: eventTypeArbitrary,
  });

/**
 * Arbitrary for generating a pending Match
 */
const pendingMatchArbitrary = fc.record({
  id: fc.uuid(),
  stage: fc.constant('group' as const),
  group: fc.constant('A'),
  team1Id: fc.constant('team-1'),
  team2Id: fc.constant('team-2'),
  status: fc.constant('pending' as const),
  events: fc.constant([]),
});

/**
 * Arbitrary for generating a Player with initial stats
 */
const playerArbitrary = (id: string, teamId: string) =>
  fc.record({
    id: fc.constant(id),
    name: fc.string({ minLength: 1, maxLength: 20 }),
    jerseyNumber: fc.integer({ min: 1, max: 99 }),
    teamId: fc.constant(teamId),
    goals: fc.integer({ min: 0, max: 10 }),
    yellowCards: fc.integer({ min: 0, max: 5 }),
    redCards: fc.integer({ min: 0, max: 2 }),
  });

/**
 * Property 15: Match Result Propagation
 *
 * **Validates: Requirements 9.5**
 *
 * For any completed match, saving the results should:
 * 1. Update the target match to status='completed' with correct scores
 * 2. Increment player goal/card counts by the correct amounts from events
 * 3. Leave players not involved in events unchanged
 */
describe('Property 15: Match Result Propagation', () => {
  const PLAYER_IDS = ['player-1', 'player-2', 'player-3', 'player-4'];
  const TEAM_IDS = ['team-1', 'team-2'];

  /**
   * Test 1: After applyMatchResult, the target match has status='completed' and correct scores
   */
  test('applyMatchResult sets status to completed with correct scores', () => {
    fc.assert(
      fc.property(
        pendingMatchArbitrary,
        fc.integer({ min: 0, max: 10 }),
        fc.integer({ min: 0, max: 10 }),
        fc.array(
          matchEventArbitrary('placeholder', PLAYER_IDS, TEAM_IDS),
          { minLength: 0, maxLength: 5 }
        ),
        (match, score1, score2, events) => {
          // Fix event matchIds to match the generated match
          const fixedEvents: MatchEvent[] = events.map(e => ({ ...e, matchId: match.id }));

          const result: MatchResult = {
            matchId: match.id,
            team1Score: score1,
            team2Score: score2,
            events: fixedEvents,
          };

          const otherMatch: Match = {
            id: 'other-match',
            stage: 'group',
            team1Id: 'team-3',
            team2Id: 'team-4',
            status: 'pending',
            events: [],
          };

          const updatedMatches = applyMatchResult(result, [match, otherMatch]);
          const updatedMatch = updatedMatches.find(m => m.id === match.id)!;
          const untouchedMatch = updatedMatches.find(m => m.id === 'other-match')!;

          // Target match should be completed with correct scores
          if (updatedMatch.status !== 'completed') return false;
          if (updatedMatch.team1Score !== score1) return false;
          if (updatedMatch.team2Score !== score2) return false;

          // Other matches should be unchanged
          if (untouchedMatch.status !== 'pending') return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Test 2: After updatePlayerStats, player goal/card counts are incremented correctly
   */
  test('updatePlayerStats increments player stats by correct amounts from events', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          playerArbitrary('player-1', 'team-1'),
          playerArbitrary('player-2', 'team-1'),
          playerArbitrary('player-3', 'team-2'),
          playerArbitrary('player-4', 'team-2'),
        ),
        fc.array(
          matchEventArbitrary('match-1', PLAYER_IDS, TEAM_IDS),
          { minLength: 0, maxLength: 8 }
        ),
        ([p1, p2, p3, p4], events) => {
          const players: Player[] = [p1, p2, p3, p4];

          const result: MatchResult = {
            matchId: 'match-1',
            team1Score: 0,
            team2Score: 0,
            events,
          };

          const updatedPlayers = updatePlayerStats(result, players);

          // For each player, verify the increments match the event counts
          for (const player of players) {
            const expectedGoals = events.filter(e => e.playerId === player.id && e.type === 'goal').length;
            const expectedYellow = events.filter(e => e.playerId === player.id && e.type === 'yellowCard').length;
            const expectedRed = events.filter(e => e.playerId === player.id && e.type === 'redCard').length;

            const updated = updatedPlayers.find(p => p.id === player.id)!;

            if (updated.goals !== player.goals + expectedGoals) return false;
            if (updated.yellowCards !== player.yellowCards + expectedYellow) return false;
            if (updated.redCards !== player.redCards + expectedRed) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Test 3: Players not involved in any events are unchanged
   */
  test('players not involved in events are unchanged after updatePlayerStats', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          playerArbitrary('player-1', 'team-1'),
          playerArbitrary('player-2', 'team-1'),
        ),
        // Only generate events for player-1, never player-2
        fc.array(
          fc.record({
            id: fc.uuid(),
            matchId: fc.constant('match-1'),
            playerId: fc.constant('player-1'),
            teamId: fc.constant('team-1'),
            minute: fc.integer({ min: 1, max: 90 }),
            type: eventTypeArbitrary,
          }),
          { minLength: 0, maxLength: 5 }
        ),
        ([p1, p2], events) => {
          const players: Player[] = [p1, p2];

          const result: MatchResult = {
            matchId: 'match-1',
            team1Score: 0,
            team2Score: 0,
            events,
          };

          const updatedPlayers = updatePlayerStats(result, players);
          const updatedP2 = updatedPlayers.find(p => p.id === 'player-2')!;

          // player-2 had no events, so stats must be identical
          return (
            updatedP2.goals === p2.goals &&
            updatedP2.yellowCards === p2.yellowCards &&
            updatedP2.redCards === p2.redCards
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
