// Feature: futsal-tournament-management-system, Property 8: Player Filtering by Team

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';

/**
 * Player type matching the design document data model
 */
type Player = {
  id: string;
  name: string;
  jerseyNumber: number;
  teamId: string;
  goals: number;
  yellowCards: number;
  redCards: number;
};

/**
 * Pure function that filters players by teamId.
 * When teamId is "all", all players are returned.
 */
function filterPlayersByTeam(teamId: string, players: Player[]): Player[] {
  if (teamId === 'all') {
    return players;
  }
  return players.filter(p => p.teamId === teamId);
}

// Arbitrary for generating a single Player
const playerArbitrary = fc.record<Player>({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  jerseyNumber: fc.integer({ min: 1, max: 99 }),
  teamId: fc.string({ minLength: 1, maxLength: 20 }),
  goals: fc.nat({ max: 50 }),
  yellowCards: fc.nat({ max: 10 }),
  redCards: fc.nat({ max: 5 }),
});

/**
 * Property 8: Player Filtering by Team
 *
 * **Validates: Requirements 5.3**
 *
 * For any team selection in the player filter, all displayed players should have
 * teamId matching the selected team.
 */
describe('Property 8: Player Filtering by Team', () => {
  test('all returned players have teamId matching the selected team', () => {
    fc.assert(
      fc.property(
        fc.array(playerArbitrary, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (players, teamId) => {
          const result = filterPlayersByTeam(teamId, players);
          return result.every(p => p.teamId === teamId);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('when "all" is selected, all players are returned', () => {
    fc.assert(
      fc.property(
        fc.array(playerArbitrary, { minLength: 0, maxLength: 50 }),
        (players) => {
          const result = filterPlayersByTeam('all', players);
          assert.strictEqual(result.length, players.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('filtered result is a subset of the original player list', () => {
    fc.assert(
      fc.property(
        fc.array(playerArbitrary, { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (players, teamId) => {
          const result = filterPlayersByTeam(teamId, players);
          return result.every(p => players.includes(p));
        }
      ),
      { numRuns: 100 }
    );
  });
});
