/**
 * Property-Based Tests for Round-Robin Match Generation
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';
import { generateRoundRobinMatches } from '../../lib/drawing';
import { GroupAssignment, Team } from '../../data/types';

// Feature: futsal-tournament-management-system, Property 10: Round-Robin Match Generation

/**
 * Arbitrary for generating a single Team given a unique ID
 */
const makeTeam = (id: string): Team => ({
  id,
  name: `Team ${id}`,
  schoolName: `School ${id}`,
  logo: `/logos/${id}.png`,
  officialName: `Official ${id}`,
  contactNumber: `+628${id.slice(0, 9).padStart(9, '0')}`,
});

/**
 * Arbitrary that generates a single GroupAssignment with exactly 4 unique teams.
 */
const groupAssignmentArbitrary: fc.Arbitrary<GroupAssignment> = fc
  .uniqueArray(fc.uuid(), { minLength: 4, maxLength: 4 })
  .map((ids) => ({
    group: 'A' as const,
    teams: ids.map(makeTeam),
  }));

/**
 * Property 10: Round-Robin Match Generation
 *
 * **Validates: Requirements 6.3, 7.1, 7.2**
 *
 * For any group with 4 teams:
 * 1. Exactly 6 matches are generated
 * 2. Each team plays every other team exactly once (all 6 unique pairs covered)
 * 3. No team plays itself
 */
describe('Property 10: Round-Robin Match Generation', () => {
  test('exactly 6 matches are generated for a group of 4 teams', () => {
    fc.assert(
      fc.property(groupAssignmentArbitrary, (group) => {
        const matches = generateRoundRobinMatches([group]);
        return matches.length === 6;
      }),
      { numRuns: 100 }
    );
  });

  test('each team plays every other team exactly once', () => {
    fc.assert(
      fc.property(groupAssignmentArbitrary, (group) => {
        const matches = generateRoundRobinMatches([group]);
        const teamIds = group.teams.map((t) => t.id);

        // Build the set of expected pairs (unordered)
        const expectedPairs = new Set<string>();
        for (let i = 0; i < teamIds.length; i++) {
          for (let j = i + 1; j < teamIds.length; j++) {
            expectedPairs.add([teamIds[i], teamIds[j]].sort().join('|'));
          }
        }

        // Build the set of actual pairs from generated matches
        const actualPairs = new Set<string>();
        for (const match of matches) {
          actualPairs.add([match.team1Id, match.team2Id].sort().join('|'));
        }

        // Every expected pair must appear exactly once
        if (actualPairs.size !== expectedPairs.size) return false;
        for (const pair of expectedPairs) {
          if (!actualPairs.has(pair)) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('no team plays itself in any match', () => {
    fc.assert(
      fc.property(groupAssignmentArbitrary, (group) => {
        const matches = generateRoundRobinMatches([group]);
        return matches.every((m) => m.team1Id !== m.team2Id);
      }),
      { numRuns: 100 }
    );
  });
});
