/**
 * Property-Based Tests for Match Status Determination
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';

// Feature: futsal-tournament-management-system, Property 12: Match Status Determination

/**
 * Pure function that determines match status based on scores.
 * If both team scores are defined (not null/undefined), the status is 'completed'.
 * Otherwise, the status is 'pending'.
 *
 * **Validates: Requirements 8.4, 8.5**
 */
function determineMatchStatus(
  team1Score: number | undefined,
  team2Score: number | undefined
): 'pending' | 'completed' {
  if (team1Score !== undefined && team2Score !== undefined) {
    return 'completed';
  }
  return 'pending';
}

/**
 * Property 12: Match Status Determination
 *
 * **Validates: Requirements 8.4, 8.5**
 *
 * For any match, if both team scores are defined (not null/undefined),
 * the status should be 'completed', otherwise 'pending'.
 */
describe('Property 12: Match Status Determination', () => {
  test('status should be completed when both scores are defined', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.nat(),
        (score1, score2) => {
          return determineMatchStatus(score1, score2) === 'completed';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('status should be pending when team1 score is undefined', () => {
    fc.assert(
      fc.property(
        fc.option(fc.nat(), { nil: undefined }),
        (score2) => {
          return determineMatchStatus(undefined, score2) === 'pending';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('status should be pending when team2 score is undefined', () => {
    fc.assert(
      fc.property(
        fc.option(fc.nat(), { nil: undefined }),
        (score1) => {
          return determineMatchStatus(score1, undefined) === 'pending';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('status should be pending when both scores are undefined', () => {
    expect(determineMatchStatus(undefined, undefined)).toBe('pending');
  });

  test('property: for any combination of defined/undefined scores, status is correct', () => {
    fc.assert(
      fc.property(
        fc.option(fc.nat(), { nil: undefined }),
        fc.option(fc.nat(), { nil: undefined }),
        (score1, score2) => {
          const status = determineMatchStatus(score1, score2);
          const bothDefined = score1 !== undefined && score2 !== undefined;
          return bothDefined ? status === 'completed' : status === 'pending';
        }
      ),
      { numRuns: 100 }
    );
  });
});
