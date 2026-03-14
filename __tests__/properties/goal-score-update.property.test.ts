/**
 * Property-Based Tests for Goal Event Score Update
 * Feature: futsal-tournament-management-system
 */

// Feature: futsal-tournament-management-system, Property 14: Goal Event Score Update

import fc from 'fast-check';

/**
 * Pure function that applies a goal event to the current scores.
 * When a goal is scored for a team, that team's score increments by exactly 1.
 */
function applyGoalEvent(
  team1Score: number,
  team2Score: number,
  scoringTeam: 'team1' | 'team2'
): { team1Score: number; team2Score: number } {
  if (scoringTeam === 'team1') {
    return { team1Score: team1Score + 1, team2Score };
  } else {
    return { team1Score, team2Score: team2Score + 1 };
  }
}

/**
 * Pure function that applies a non-goal event (yellowCard, redCard).
 * These events should NOT change scores.
 */
function applyNonGoalEvent(
  team1Score: number,
  team2Score: number,
  _eventType: 'yellowCard' | 'redCard'
): { team1Score: number; team2Score: number } {
  return { team1Score, team2Score };
}

/**
 * Arbitrary for generating a valid score (non-negative integer)
 */
const scoreArbitrary = fc.integer({ min: 0, max: 20 });

/**
 * Property 14: Goal Event Score Update
 *
 * **Validates: Requirements 9.4**
 *
 * For any match, when a goal event is added for a team:
 * 1. That team's score increments by exactly 1
 * 2. The other team's score stays the same
 * 3. Non-goal events (yellowCard, redCard) do NOT change scores
 */
describe('Property 14: Goal Event Score Update', () => {
  test('team1 goal increments team1Score by exactly 1', () => {
    fc.assert(
      fc.property(scoreArbitrary, scoreArbitrary, (team1Score, team2Score) => {
        const result = applyGoalEvent(team1Score, team2Score, 'team1');
        return result.team1Score === team1Score + 1;
      }),
      { numRuns: 100 }
    );
  });

  test('team1 goal does not change team2Score', () => {
    fc.assert(
      fc.property(scoreArbitrary, scoreArbitrary, (team1Score, team2Score) => {
        const result = applyGoalEvent(team1Score, team2Score, 'team1');
        return result.team2Score === team2Score;
      }),
      { numRuns: 100 }
    );
  });

  test('team2 goal increments team2Score by exactly 1', () => {
    fc.assert(
      fc.property(scoreArbitrary, scoreArbitrary, (team1Score, team2Score) => {
        const result = applyGoalEvent(team1Score, team2Score, 'team2');
        return result.team2Score === team2Score + 1;
      }),
      { numRuns: 100 }
    );
  });

  test('team2 goal does not change team1Score', () => {
    fc.assert(
      fc.property(scoreArbitrary, scoreArbitrary, (team1Score, team2Score) => {
        const result = applyGoalEvent(team1Score, team2Score, 'team2');
        return result.team1Score === team1Score;
      }),
      { numRuns: 100 }
    );
  });

  test('non-goal events (yellowCard, redCard) do not change any score', () => {
    fc.assert(
      fc.property(
        scoreArbitrary,
        scoreArbitrary,
        fc.constantFrom('yellowCard', 'redCard') as fc.Arbitrary<'yellowCard' | 'redCard'>,
        (team1Score, team2Score, eventType) => {
          const result = applyNonGoalEvent(team1Score, team2Score, eventType);
          return result.team1Score === team1Score && result.team2Score === team2Score;
        }
      ),
      { numRuns: 100 }
    );
  });
});
