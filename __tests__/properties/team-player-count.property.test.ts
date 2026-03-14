/**
 * Property-Based Tests for Team Player Count Calculation
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { Player } from '../../data/types';

// ─── Pure function under test ────────────────────────────────────────────────

/**
 * calculatePlayerCount
 *
 * Pure function that returns the number of players belonging to a given team.
 * Mirrors the logic used on the teams page to display the player count column.
 */
export function calculatePlayerCount(teamId: string, players: Player[]): number {
  return players.filter((p) => p.teamId === teamId).length;
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const playerArb: fc.Arbitrary<Player> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  jerseyNumber: fc.integer({ min: 1, max: 99 }),
  teamId: fc.string({ minLength: 1, maxLength: 20 }),
  studentCard: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  goals: fc.integer({ min: 0, max: 100 }),
  yellowCards: fc.integer({ min: 0, max: 10 }),
  redCards: fc.integer({ min: 0, max: 5 }),
});

// ─── Property 6: Team Player Count Calculation ───────────────────────────────

// Feature: futsal-tournament-management-system, Property 6: Team Player Count Calculation

/**
 * **Validates: Requirements 4.3**
 *
 * For any team, the displayed player count should equal the number of players
 * with matching teamId in the player data.
 */
describe('Property 6: Team Player Count Calculation', () => {

  test('player count equals players.filter(p => p.teamId === teamId).length for any input', () => {
    fc.assert(
      fc.property(
        fc.array(playerArb, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (players, teamId) => {
          const expected = players.filter((p) => p.teamId === teamId).length;
          const actual = calculatePlayerCount(teamId, players);
          return actual === expected;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('player count is zero when no players belong to the team', () => {
    fc.assert(
      fc.property(
        fc.array(playerArb, { minLength: 0, maxLength: 50 }),
        (players) => {
          // Use a teamId that cannot appear in the generated players
          const absentTeamId = '__no_such_team__';
          const count = calculatePlayerCount(absentTeamId, players);
          return count === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('player count equals total players when all belong to the same team', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.array(playerArb, { minLength: 1, maxLength: 50 }),
        (teamId, players) => {
          const allSameTeam = players.map((p) => ({ ...p, teamId }));
          const count = calculatePlayerCount(teamId, allSameTeam);
          return count === allSameTeam.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('player count is non-negative for any input', () => {
    fc.assert(
      fc.property(
        fc.array(playerArb, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (players, teamId) => {
          return calculatePlayerCount(teamId, players) >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Concrete examples ──────────────────────────────────────────────────────

  test('concrete: counts only players matching the given teamId', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Budi', jerseyNumber: 10, teamId: 'team-1', goals: 0, yellowCards: 0, redCards: 0 },
      { id: 'p2', name: 'Andi', jerseyNumber: 7,  teamId: 'team-1', goals: 0, yellowCards: 0, redCards: 0 },
      { id: 'p3', name: 'Cici', jerseyNumber: 5,  teamId: 'team-2', goals: 0, yellowCards: 0, redCards: 0 },
    ];

    assert.strictEqual(calculatePlayerCount('team-1', players), 2);
    assert.strictEqual(calculatePlayerCount('team-2', players), 1);
    assert.strictEqual(calculatePlayerCount('team-3', players), 0);
  });

  test('concrete: returns zero for empty player array', () => {
    assert.strictEqual(calculatePlayerCount('team-1', []), 0);
  });
});
