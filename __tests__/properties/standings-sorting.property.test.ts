/**
 * Property-Based Tests for Standings Sorting Order
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';

// Feature: futsal-tournament-management-system, Property 17: Standings Sorting Order

/**
 * Simplified TeamStanding type for testing purposes
 */
interface TeamStanding {
  team: { id: string; name: string };
  points: number;
  goalDifference: number;
  goalsFor: number;
  disciplinaryPoints: number; // yellowCards + (redCards * 2)
}

/**
 * Pure function that sorts standings by FIFA standard criteria:
 * 1. Points (descending)
 * 2. Head-to-head (not applicable in this simplified test)
 * 3. Goal difference (descending)
 * 4. Goals for (descending) 
 * 5. Disciplinary points (ascending - fewer cards = better)
 *
 * Validates: Requirements 10.4
 */
function sortStandings(standings: TeamStanding[]): TeamStanding[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.disciplinaryPoints - b.disciplinaryPoints; // Lower disciplinary points = better
  });
}

/**
 * Arbitrary for generating a single TeamStanding
 */
const teamStandingArbitrary = fc.record({
  team: fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 30 }),
  }),
  points: fc.integer({ min: 0, max: 9 }),
  goalDifference: fc.integer({ min: -10, max: 10 }),
  goalsFor: fc.integer({ min: 0, max: 15 }),
  disciplinaryPoints: fc.integer({ min: 0, max: 20 }), // 0-20 disciplinary points
});

/**
 * Arbitrary for generating an array of standings (0 to 8 teams)
 */
const standingsArrayArbitrary = fc.array(teamStandingArbitrary, {
  minLength: 0,
  maxLength: 8,
});

/**
 * Property 17: Standings Sorting Order
 *
 * **Validates: Requirements 10.4**
 *
 * For any group standings, teams should be sorted by FIFA standard criteria:
 * 1. Points (descending)
 * 2. Head-to-head (not tested in this simplified version)
 * 3. Goal difference (descending)
 * 4. Goals for (descending)
 * 5. Disciplinary points (ascending - fewer cards = better)
 */
describe('Property 17: Standings Sorting Order', () => {
  test('sorted standings should be ordered by points descending', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const sorted = sortStandings(standings);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].points < sorted[i + 1].points) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('when points are equal, sorted standings should be ordered by goal difference descending', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const sorted = sortStandings(standings);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].points === sorted[i + 1].points) {
            if (sorted[i].goalDifference < sorted[i + 1].goalDifference) return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('when points and goal difference are equal, sorted standings should be ordered by goals for descending', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const sorted = sortStandings(standings);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (
            sorted[i].points === sorted[i + 1].points &&
            sorted[i].goalDifference === sorted[i + 1].goalDifference
          ) {
            if (sorted[i].goalsFor < sorted[i + 1].goalsFor) return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('when points, goal difference, and goals for are equal, sorted standings should be ordered by disciplinary points ascending', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const sorted = sortStandings(standings);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (
            sorted[i].points === sorted[i + 1].points &&
            sorted[i].goalDifference === sorted[i + 1].goalDifference &&
            sorted[i].goalsFor === sorted[i + 1].goalsFor
          ) {
            if (sorted[i].disciplinaryPoints > sorted[i + 1].disciplinaryPoints) return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('sorting should preserve all standings entries (no entries lost)', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const sorted = sortStandings(standings);
        return sorted.length === standings.length;
      }),
      { numRuns: 100 }
    );
  });

  test('sorting should preserve all team IDs (no entries added or removed)', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const sorted = sortStandings(standings);
        const originalIds = new Set(standings.map((s) => s.team.id));
        const sortedIds = new Set(sorted.map((s) => s.team.id));
        if (originalIds.size !== sortedIds.size) return false;
        return [...originalIds].every((id) => sortedIds.has(id));
      }),
      { numRuns: 100 }
    );
  });

  test('sorting should not mutate the original array', () => {
    fc.assert(
      fc.property(standingsArrayArbitrary, (standings) => {
        const original = standings.map((s) => ({ ...s }));
        sortStandings(standings);
        // Original array order should be unchanged
        for (let i = 0; i < standings.length; i++) {
          if (standings[i].team.id !== original[i].team.id) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
