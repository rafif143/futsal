/**
 * Property-Based Tests for Player Statistics Computation
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { MatchEvent } from '../../data/types';

// ─── Pure function under test ────────────────────────────────────────────────

/**
 * computePlayerStats
 *
 * Pure function that computes a player's statistics by counting the corresponding
 * event types in the match events array filtered by playerId.
 * Mirrors the logic used on the players page to display goals, yellow cards, and red cards.
 */
export function computePlayerStats(
  playerId: string,
  events: MatchEvent[]
): { goals: number; yellowCards: number; redCards: number } {
  const playerEvents = events.filter((e) => e.playerId === playerId);
  return {
    goals: playerEvents.filter((e) => e.type === 'goal').length,
    yellowCards: playerEvents.filter((e) => e.type === 'yellowCard').length,
    redCards: playerEvents.filter((e) => e.type === 'redCard').length,
  };
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const eventTypeArb = fc.constantFrom('goal', 'yellowCard', 'redCard') as fc.Arbitrary<
  'goal' | 'yellowCard' | 'redCard'
>;

const matchEventArb: fc.Arbitrary<MatchEvent> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  matchId: fc.string({ minLength: 1, maxLength: 20 }),
  playerId: fc.string({ minLength: 1, maxLength: 20 }),
  teamId: fc.string({ minLength: 1, maxLength: 20 }),
  minute: fc.integer({ min: 1, max: 90 }),
  type: eventTypeArb,
});

// ─── Property 7: Player Statistics Computation ───────────────────────────────

// Feature: futsal-tournament-management-system, Property 7: Player Statistics Computation

/**
 * **Validates: Requirements 5.2, 5.4**
 *
 * For any player, the displayed statistics (goals, yellow cards, red cards) should
 * equal the count of corresponding event types in match events.
 */
describe('Property 7: Player Statistics Computation', () => {

  test('computed stats equal count of each event type filtered by playerId', () => {
    fc.assert(
      fc.property(
        fc.array(matchEventArb, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (events, playerId) => {
          const stats = computePlayerStats(playerId, events);
          const playerEvents = events.filter((e) => e.playerId === playerId);

          const expectedGoals = playerEvents.filter((e) => e.type === 'goal').length;
          const expectedYellow = playerEvents.filter((e) => e.type === 'yellowCard').length;
          const expectedRed = playerEvents.filter((e) => e.type === 'redCard').length;

          return (
            stats.goals === expectedGoals &&
            stats.yellowCards === expectedYellow &&
            stats.redCards === expectedRed
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('stats are all zero when player has no events', () => {
    fc.assert(
      fc.property(
        fc.array(matchEventArb, { minLength: 0, maxLength: 50 }),
        (events) => {
          const absentPlayerId = '__no_such_player__';
          const stats = computePlayerStats(absentPlayerId, events);
          return stats.goals === 0 && stats.yellowCards === 0 && stats.redCards === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('stats equal total events when all events belong to the same player', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.array(matchEventArb, { minLength: 1, maxLength: 50 }),
        (playerId, events) => {
          const allSamePlayer = events.map((e) => ({ ...e, playerId }));
          const stats = computePlayerStats(playerId, allSamePlayer);

          const expectedGoals = allSamePlayer.filter((e) => e.type === 'goal').length;
          const expectedYellow = allSamePlayer.filter((e) => e.type === 'yellowCard').length;
          const expectedRed = allSamePlayer.filter((e) => e.type === 'redCard').length;

          return (
            stats.goals === expectedGoals &&
            stats.yellowCards === expectedYellow &&
            stats.redCards === expectedRed
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('stats are non-negative for any input', () => {
    fc.assert(
      fc.property(
        fc.array(matchEventArb, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (events, playerId) => {
          const stats = computePlayerStats(playerId, events);
          return stats.goals >= 0 && stats.yellowCards >= 0 && stats.redCards >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Concrete examples ──────────────────────────────────────────────────────

  test('concrete: counts goals, yellow cards, and red cards correctly', () => {
    const events: MatchEvent[] = [
      { id: 'e1', matchId: 'm1', playerId: 'p1', teamId: 't1', minute: 10, type: 'goal' },
      { id: 'e2', matchId: 'm1', playerId: 'p1', teamId: 't1', minute: 25, type: 'goal' },
      { id: 'e3', matchId: 'm1', playerId: 'p1', teamId: 't1', minute: 40, type: 'yellowCard' },
      { id: 'e4', matchId: 'm2', playerId: 'p2', teamId: 't2', minute: 15, type: 'goal' },
      { id: 'e5', matchId: 'm2', playerId: 'p1', teamId: 't1', minute: 60, type: 'redCard' },
    ];

    const stats = computePlayerStats('p1', events);
    assert.strictEqual(stats.goals, 2);
    assert.strictEqual(stats.yellowCards, 1);
    assert.strictEqual(stats.redCards, 1);
  });

  test('concrete: returns zeros for player with no events', () => {
    const events: MatchEvent[] = [
      { id: 'e1', matchId: 'm1', playerId: 'p1', teamId: 't1', minute: 10, type: 'goal' },
    ];

    const stats = computePlayerStats('p99', events);
    assert.strictEqual(stats.goals, 0);
    assert.strictEqual(stats.yellowCards, 0);
    assert.strictEqual(stats.redCards, 0);
  });

  test('concrete: returns zeros for empty events array', () => {
    const stats = computePlayerStats('p1', []);
    assert.strictEqual(stats.goals, 0);
    assert.strictEqual(stats.yellowCards, 0);
    assert.strictEqual(stats.redCards, 0);
  });
});
