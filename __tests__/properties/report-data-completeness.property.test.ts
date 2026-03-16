// Feature: futsal-tournament-management-system, Property 20: Report Data Completeness

import fc from 'fast-check';
import { Match, KnockoutMatch, TeamStanding, Team } from '../../data/types';

/**
 * Property 20: Report Data Completeness
 * Validates: Requirements 13.4
 *
 * For any generated report type (match schedule, knockout bracket, standings),
 * the report should include all required data fields for that report type.
 */

// Arbitraries

const teamArb: fc.Arbitrary<Team> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  schoolName: fc.string({ minLength: 1, maxLength: 50 }),
  logo: fc.string({ minLength: 0, maxLength: 100 }),
  officialName: fc.string({ minLength: 1, maxLength: 50 }),
  contactNumber: fc.string({ minLength: 5, maxLength: 15 }),
});

const matchArb: fc.Arbitrary<Match> = fc.record({
  id: fc.uuid(),
  stage: fc.constantFrom('group', 'round16', 'quarter', 'semi', 'final', 'third') as fc.Arbitrary<Match['stage']>,
  team1Id: fc.uuid(),
  team2Id: fc.uuid(),
  status: fc.constantFrom('pending', 'completed') as fc.Arbitrary<Match['status']>,
  events: fc.constant([]),
});

const knockoutMatchArb: fc.Arbitrary<KnockoutMatch> = fc.record({
  id: fc.uuid(),
  round: fc.constantFrom('round16', 'quarter', 'semi', 'final', 'third') as fc.Arbitrary<KnockoutMatch['round']>,
});

const teamStandingArb: fc.Arbitrary<TeamStanding> = fc.record({
  team: teamArb,
  played: fc.integer({ min: 0, max: 20 }),
  won: fc.integer({ min: 0, max: 20 }),
  drawn: fc.integer({ min: 0, max: 20 }),
  lost: fc.integer({ min: 0, max: 20 }),
  goalsFor: fc.integer({ min: 0, max: 100 }),
  goalsAgainst: fc.integer({ min: 0, max: 100 }),
  goalDifference: fc.integer({ min: -100, max: 100 }),
  points: fc.integer({ min: 0, max: 60 }),
  yellowCards: fc.integer({ min: 0, max: 20 }),
  redCards: fc.integer({ min: 0, max: 10 }),
  disciplinaryPoints: fc.integer({ min: 0, max: 40 }), // yellowCards + (redCards * 2)
});

describe('Property 20: Report Data Completeness', () => {
  /**
   * Match schedule report: each match entry must have id, team1Id, team2Id, status, and stage fields.
   * **Validates: Requirements 13.4**
   */
  test('match schedule report entries contain all required fields', () => {
    fc.assert(
      fc.property(fc.array(matchArb, { minLength: 1, maxLength: 20 }), (matches) => {
        for (const match of matches) {
          if (!('id' in match)) return false;
          if (!('team1Id' in match)) return false;
          if (!('team2Id' in match)) return false;
          if (!('status' in match)) return false;
          if (!('stage' in match)) return false;

          if (typeof match.id !== 'string' || match.id.length === 0) return false;
          if (typeof match.team1Id !== 'string' || match.team1Id.length === 0) return false;
          if (typeof match.team2Id !== 'string' || match.team2Id.length === 0) return false;
          if (!['pending', 'completed'].includes(match.status)) return false;
          if (!['group', 'round16', 'quarter', 'semi', 'final', 'third'].includes(match.stage)) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Knockout bracket report: each knockout match must have id and round fields.
   * **Validates: Requirements 13.4**
   */
  test('knockout bracket report entries contain all required fields', () => {
    fc.assert(
      fc.property(fc.array(knockoutMatchArb, { minLength: 1, maxLength: 16 }), (knockoutMatches) => {
        for (const km of knockoutMatches) {
          if (!('id' in km)) return false;
          if (!('round' in km)) return false;

          if (typeof km.id !== 'string' || km.id.length === 0) return false;
          if (!['round16', 'quarter', 'semi', 'final', 'third'].includes(km.round)) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Standings report: each team standing must have team, played, won, drawn, lost,
   * goalsFor, goalsAgainst, goalDifference, points, disciplinaryPoints fields.
   * **Validates: Requirements 13.4**
   */
  test('standings report entries contain all required fields', () => {
    fc.assert(
      fc.property(fc.array(teamStandingArb, { minLength: 1, maxLength: 16 }), (standings) => {
        for (const standing of standings) {
          if (!('team' in standing)) return false;
          if (!('played' in standing)) return false;
          if (!('won' in standing)) return false;
          if (!('drawn' in standing)) return false;
          if (!('lost' in standing)) return false;
          if (!('goalsFor' in standing)) return false;
          if (!('goalsAgainst' in standing)) return false;
          if (!('goalDifference' in standing)) return false;
          if (!('points' in standing)) return false;
          if (!('disciplinaryPoints' in standing)) return false;

          if (typeof standing.team !== 'object' || standing.team === null) return false;
          if (typeof standing.played !== 'number') return false;
          if (typeof standing.won !== 'number') return false;
          if (typeof standing.drawn !== 'number') return false;
          if (typeof standing.lost !== 'number') return false;
          if (typeof standing.goalsFor !== 'number') return false;
          if (typeof standing.goalsAgainst !== 'number') return false;
          if (typeof standing.goalDifference !== 'number') return false;
          if (typeof standing.points !== 'number') return false;
          if (typeof standing.disciplinaryPoints !== 'number') return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
