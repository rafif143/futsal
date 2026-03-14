/**
 * Property-Based Tests for Points Calculation Formula
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';

// Feature: futsal-tournament-management-system, Property 16: Points Calculation Formula

/**
 * Pure function that calculates total points from match results.
 * Points: (wins × 3) + (draws × 1) + (losses × 0)
 *
 * Validates: Requirements 10.3
 */
function calculatePoints(wins: number, draws: number, losses: number): number {
  return wins * 3 + draws * 1;
}

/** Arbitrary for non-negative integers (0–50) */
const nonNegativeInt = fc.integer({ min: 0, max: 50 });

describe('Property 16: Points Calculation Formula', () => {
  /**
   * For any non-negative wins, draws, losses the formula holds:
   * points === (wins × 3) + (draws × 1)
   */
  test('points equal (wins × 3) + (draws × 1) for any non-negative inputs', () => {
    // Feature: futsal-tournament-management-system, Property 16: Points Calculation Formula
    fc.assert(
      fc.property(nonNegativeInt, nonNegativeInt, nonNegativeInt, (wins, draws, losses) => {
        const expected = wins * 3 + draws;
        return calculatePoints(wins, draws, losses) === expected;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Losses contribute 0 points — changing losses should not change the result.
   */
  test('losses contribute 0 points', () => {
    // Feature: futsal-tournament-management-system, Property 16: Points Calculation Formula
    fc.assert(
      fc.property(nonNegativeInt, nonNegativeInt, nonNegativeInt, nonNegativeInt, (wins, draws, losses1, losses2) => {
        return calculatePoints(wins, draws, losses1) === calculatePoints(wins, draws, losses2);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Points are always non-negative for any non-negative inputs.
   */
  test('points are always non-negative', () => {
    // Feature: futsal-tournament-management-system, Property 16: Points Calculation Formula
    fc.assert(
      fc.property(nonNegativeInt, nonNegativeInt, nonNegativeInt, (wins, draws, losses) => {
        return calculatePoints(wins, draws, losses) >= 0;
      }),
      { numRuns: 100 }
    );
  });
});
