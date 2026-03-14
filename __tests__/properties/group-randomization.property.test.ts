/**
 * Property-Based Tests for Group Randomization Distribution
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';
import { randomizeGroups } from '../../lib/drawing';
import { Team } from '../../data/types';

// Feature: futsal-tournament-management-system, Property 9: Group Randomization Distribution

/**
 * Arbitrary for generating a single Team with a unique ID
 */
const teamArbitrary = (id: string): Team => ({
  id,
  name: `Team ${id}`,
  schoolName: `School ${id}`,
  logo: `/logos/${id}.png`,
  officialName: `Official ${id}`,
  contactNumber: `+628${id.padStart(9, '0')}`,
});

/**
 * Generate exactly 32 unique teams
 */
const thirtyTwoTeamsArbitrary = fc.uniqueArray(
  fc.uuid(),
  { minLength: 32, maxLength: 32 }
).map(ids => ids.map(id => teamArbitrary(id)));

/**
 * Property 9: Group Randomization Distribution
 *
 * **Validates: Requirements 6.2, 6.5**
 *
 * For any randomization of 32 teams into 8 groups:
 * 1. Each group contains exactly 4 teams
 * 2. There are exactly 8 groups
 * 3. Each team appears in exactly one group (no duplicates)
 * 4. All 32 teams are placed (no teams missing)
 */
describe('Property 9: Group Randomization Distribution', () => {
  test('each group should contain exactly 4 teams', () => {
    fc.assert(
      fc.property(thirtyTwoTeamsArbitrary, (teams) => {
        const groups = randomizeGroups(teams);
        return groups.every(g => g.teams.length === 4);
      }),
      { numRuns: 100 }
    );
  });

  test('there should be exactly 8 groups', () => {
    fc.assert(
      fc.property(thirtyTwoTeamsArbitrary, (teams) => {
        const groups = randomizeGroups(teams);
        return groups.length === 8;
      }),
      { numRuns: 100 }
    );
  });

  test('each team should appear in exactly one group (no duplicates)', () => {
    fc.assert(
      fc.property(thirtyTwoTeamsArbitrary, (teams) => {
        const groups = randomizeGroups(teams);
        const allTeamIds = groups.flatMap(g => g.teams.map(t => t.id));
        const uniqueIds = new Set(allTeamIds);
        return uniqueIds.size === allTeamIds.length;
      }),
      { numRuns: 100 }
    );
  });

  test('all 32 teams should be placed across the groups', () => {
    fc.assert(
      fc.property(thirtyTwoTeamsArbitrary, (teams) => {
        const groups = randomizeGroups(teams);
        const allTeamIds = new Set(groups.flatMap(g => g.teams.map(t => t.id)));
        const inputIds = new Set(teams.map(t => t.id));
        // Every input team ID must appear in the groups
        return inputIds.size === allTeamIds.size &&
          [...inputIds].every(id => allTeamIds.has(id));
      }),
      { numRuns: 100 }
    );
  });

  test('combined: all distribution invariants hold simultaneously', () => {
    fc.assert(
      fc.property(thirtyTwoTeamsArbitrary, (teams) => {
        const groups = randomizeGroups(teams);

        // 1. Exactly 8 groups
        if (groups.length !== 8) return false;

        // 2. Each group has exactly 4 teams
        if (!groups.every(g => g.teams.length === 4)) return false;

        // 3. No duplicate teams across groups
        const allTeamIds = groups.flatMap(g => g.teams.map(t => t.id));
        if (new Set(allTeamIds).size !== allTeamIds.length) return false;

        // 4. All input teams are present
        const inputIds = new Set(teams.map(t => t.id));
        if (!allTeamIds.every(id => inputIds.has(id))) return false;

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
