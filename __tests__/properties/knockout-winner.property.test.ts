/**
 * Property-Based Tests for Knockout Winner Advancement
 * Feature: futsal-tournament-management-system
 */

import fc from 'fast-check';
import { getMatchWinner } from '../../lib/knockout';
import { KnockoutMatch, Team } from '../../data/types';

// Feature: futsal-tournament-management-system, Property 18: Knockout Winner Advancement

/**
 * Arbitrary for generating a valid Team
 */
const teamArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  schoolName: fc.string({ minLength: 1, maxLength: 50 }),
  logo: fc.constant('/logos/team.png'),
  officialName: fc.string({ minLength: 1, maxLength: 50 }),
  contactNumber: fc.string({ minLength: 5, maxLength: 15 }),
});

/**
 * Arbitrary for non-final, non-third knockout rounds
 */
const nonFinalRoundArbitrary = fc.constantFrom(
  'round16' as const,
  'quarter' as const,
  'semi' as const
);

/**
 * Property 18: Knockout Winner Advancement
 *
 * **Validates: Requirements 11.3**
 *
 * For any completed knockout match (except final and 3rd place):
 * 1. If team1Score > team2Score, getMatchWinner returns team1
 * 2. If team2Score > team1Score, getMatchWinner returns team2
 * 3. If scores are equal or not set, getMatchWinner returns undefined
 */
describe('Property 18: Knockout Winner Advancement', () => {
  test('team1 wins when team1Score > team2Score', () => {
    fc.assert(
      fc.property(
        teamArbitrary,
        teamArbitrary,
        fc.nat(100),
        fc.nat(100),
        nonFinalRoundArbitrary,
        (team1, team2, score1Base, diff, round) => {
          const score2 = score1Base;
          const score1 = score1Base + diff + 1; // ensure score1 > score2

          const match: KnockoutMatch = {
            id: 'match-1',
            round,
            team1,
            team2,
            score1,
            score2,
          };

          const winner = getMatchWinner(match);
          return winner?.id === team1.id;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('team2 wins when team2Score > team1Score', () => {
    fc.assert(
      fc.property(
        teamArbitrary,
        teamArbitrary,
        fc.nat(100),
        fc.nat(100),
        nonFinalRoundArbitrary,
        (team1, team2, score2Base, diff, round) => {
          const score1 = score2Base;
          const score2 = score2Base + diff + 1; // ensure score2 > score1

          const match: KnockoutMatch = {
            id: 'match-1',
            round,
            team1,
            team2,
            score1,
            score2,
          };

          const winner = getMatchWinner(match);
          return winner?.id === team2.id;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('no winner when scores are equal', () => {
    fc.assert(
      fc.property(
        teamArbitrary,
        teamArbitrary,
        fc.nat(100),
        nonFinalRoundArbitrary,
        (team1, team2, score, round) => {
          const match: KnockoutMatch = {
            id: 'match-1',
            round,
            team1,
            team2,
            score1: score,
            score2: score,
          };

          const winner = getMatchWinner(match);
          return winner === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('no winner when scores are not set', () => {
    fc.assert(
      fc.property(
        teamArbitrary,
        teamArbitrary,
        nonFinalRoundArbitrary,
        (team1, team2, round) => {
          const match: KnockoutMatch = {
            id: 'match-1',
            round,
            team1,
            team2,
            // score1 and score2 intentionally omitted
          };

          const winner = getMatchWinner(match);
          return winner === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});
