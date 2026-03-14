/**
 * Property-Based Tests for Third Place Match Participants
 * Feature: futsal-tournament-management-system
 */

// Feature: futsal-tournament-management-system, Property 19: Third Place Match Participants

import fc from 'fast-check';
import { getThirdPlaceParticipants } from '../../lib/knockout';
import { KnockoutMatch, Team } from '../../data/types';

/**
 * Arbitrary for generating a minimal Team object
 */
const teamArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  schoolName: fc.string({ minLength: 1, maxLength: 30 }),
  logo: fc.constant('/logos/team.png'),
  officialName: fc.string({ minLength: 1, maxLength: 30 }),
  contactNumber: fc.string({ minLength: 5, maxLength: 15 }),
});

/**
 * Arbitrary for a completed semi-final match where team1 wins (score1 > score2)
 */
const semiTeam1WinsArbitrary = fc.tuple(teamArbitrary, teamArbitrary).chain(
  ([team1, team2]) =>
    fc.tuple(
      fc.nat({ max: 20 }),       // score1
      fc.nat({ max: 20 }),       // score2 offset
    ).map(([score1, offset]) => {
      const score2 = score1 > 0 ? Math.max(0, score1 - 1 - offset) : 0;
      // Ensure score1 > score2 strictly
      const finalScore1 = score2 + 1 + offset;
      return {
        id: `semi-${team1.id}`,
        round: 'semi' as const,
        team1,
        team2,
        score1: finalScore1,
        score2,
        winner: team1,
      } satisfies KnockoutMatch;
    })
);

/**
 * Arbitrary for a completed semi-final match where team2 wins (score2 > score1)
 */
const semiTeam2WinsArbitrary = fc.tuple(teamArbitrary, teamArbitrary).chain(
  ([team1, team2]) =>
    fc.tuple(
      fc.nat({ max: 20 }),
      fc.nat({ max: 20 }),
    ).map(([score2, offset]) => {
      const finalScore2 = score2 + 1 + offset;
      return {
        id: `semi-${team2.id}`,
        round: 'semi' as const,
        team1,
        team2,
        score1: score2,
        score2: finalScore2,
        winner: team2,
      } satisfies KnockoutMatch;
    })
);

/**
 * Arbitrary for a semi-final match with no result (scores undefined)
 */
const semiNoResultArbitrary = fc.tuple(teamArbitrary, teamArbitrary).map(
  ([team1, team2]) =>
    ({
      id: `semi-no-result-${team1.id}`,
      round: 'semi' as const,
      team1,
      team2,
    } satisfies KnockoutMatch)
);

/**
 * Property 19: Third Place Match Participants
 *
 * **Validates: Requirements 11.4**
 *
 * For any completed semi-final matches, the two losing teams should be
 * identified as participants for the 3rd place match.
 */
describe('Property 19: Third Place Match Participants', () => {
  test('when team1 wins both semis, team2 of each semi are the third-place participants', () => {
    fc.assert(
      fc.property(
        semiTeam1WinsArbitrary,
        semiTeam1WinsArbitrary,
        (semi1, semi2) => {
          const matches: KnockoutMatch[] = [semi1, semi2];
          const [p1, p2] = getThirdPlaceParticipants(matches);

          // Losers are team2 of each semi when team1 wins
          expect(p1).toEqual(semi1.team2);
          expect(p2).toEqual(semi2.team2);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('when team2 wins both semis, team1 of each semi are the third-place participants', () => {
    fc.assert(
      fc.property(
        semiTeam2WinsArbitrary,
        semiTeam2WinsArbitrary,
        (semi1, semi2) => {
          const matches: KnockoutMatch[] = [semi1, semi2];
          const [p1, p2] = getThirdPlaceParticipants(matches);

          // Losers are team1 of each semi when team2 wins
          expect(p1).toEqual(semi1.team1);
          expect(p2).toEqual(semi2.team1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('when semi-finals have no results, both participants are undefined', () => {
    fc.assert(
      fc.property(
        semiNoResultArbitrary,
        semiNoResultArbitrary,
        (semi1, semi2) => {
          const matches: KnockoutMatch[] = [semi1, semi2];
          const [p1, p2] = getThirdPlaceParticipants(matches);

          expect(p1).toBeUndefined();
          expect(p2).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
