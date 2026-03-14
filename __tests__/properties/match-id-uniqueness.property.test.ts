/**
 * Property-Based Tests for Match ID Uniqueness
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';
import { randomizeGroups, generateRoundRobinMatches } from '../../lib/drawing';
import { Team } from '../../data/types';

// Feature: futsal-tournament-management-system, Property 11: Match ID Uniqueness

/**
 * Build a Team object from a UUID string.
 */
const makeTeam = (id: string): Team => ({
  id,
  name: `Team ${id}`,
  schoolName: `School ${id}`,
  logo: `/logos/${id}.png`,
  officialName: `Official ${id}`,
  contactNumber: `+628${id.replace(/-/g, '').slice(0, 9)}`,
});

/**
 * Generate exactly 32 unique teams using UUID arbitraries.
 */
const thirtyTwoTeamsArbitrary = fc
  .uniqueArray(fc.uuid(), { minLength: 32, maxLength: 32 })
  .map(ids => ids.map(id => makeTeam(id)));

/**
 * Property 11: Match ID Uniqueness
 *
 * **Validates: Requirements 7.3**
 *
 * For any set of generated matches, all match IDs should be unique with no duplicates.
 */
describe('Property 11: Match ID Uniqueness', () => {
  test('all generated match IDs should be unique across all groups', () => {
    fc.assert(
      fc.property(thirtyTwoTeamsArbitrary, (teams) => {
        const groups = randomizeGroups(teams);
        const matches = generateRoundRobinMatches(groups);

        const ids = matches.map(m => m.id);
        const uniqueIds = new Set(ids);

        return uniqueIds.size === ids.length;
      }),
      { numRuns: 100 }
    );
  });
});
