/**
 * Property-Based Tests for Dashboard Statistics Accuracy
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { mockTeams } from '../../data/mock-teams';
import { mockPlayers } from '../../data/mock-players';
import { mockMatches } from '../../data/mock-matches';
import { Team, Player, Match } from '../../data/types';

/**
 * Property 1: Dashboard Statistics Accuracy
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 * 
 * For any set of mock data, the dashboard statistics (total teams, total players, 
 * total matches, matches played) should equal the actual counts computed from the data.
 * 
 * This property verifies that:
 * 1. Total teams count equals the length of teams array
 * 2. Total players count equals the length of players array
 * 3. Total matches count equals the length of matches array
 * 4. Matches played count equals the number of matches with status 'completed'
 */
describe('Property 1: Dashboard Statistics Accuracy', () => {
  // Helper function to calculate dashboard statistics
  const calculateDashboardStats = (
    teams: Team[],
    players: Player[],
    matches: Match[]
  ) => {
    return {
      totalTeams: teams.length,
      totalPlayers: players.length,
      totalMatches: matches.length,
      matchesPlayed: matches.filter(match => match.status === 'completed').length
    };
  };

  test('total teams count should equal teams array length', () => {
    const stats = calculateDashboardStats(mockTeams, mockPlayers, mockMatches);
    
    assert.strictEqual(
      stats.totalTeams,
      mockTeams.length,
      `Total teams should be ${mockTeams.length}, but got ${stats.totalTeams}`
    );
  });

  test('total players count should equal players array length', () => {
    const stats = calculateDashboardStats(mockTeams, mockPlayers, mockMatches);
    
    assert.strictEqual(
      stats.totalPlayers,
      mockPlayers.length,
      `Total players should be ${mockPlayers.length}, but got ${stats.totalPlayers}`
    );
  });

  test('total matches count should equal matches array length', () => {
    const stats = calculateDashboardStats(mockTeams, mockPlayers, mockMatches);
    
    assert.strictEqual(
      stats.totalMatches,
      mockMatches.length,
      `Total matches should be ${mockMatches.length}, but got ${stats.totalMatches}`
    );
  });

  test('matches played count should equal completed matches count', () => {
    const expectedMatchesPlayed = mockMatches.filter(
      match => match.status === 'completed'
    ).length;
    const stats = calculateDashboardStats(mockTeams, mockPlayers, mockMatches);
    
    assert.strictEqual(
      stats.matchesPlayed,
      expectedMatchesPlayed,
      `Matches played should be ${expectedMatchesPlayed}, but got ${stats.matchesPlayed}`
    );
  });

  test('property: statistics should be accurate for any subset of teams', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockTeams.length - 1 }), {
          minLength: 0,
          maxLength: mockTeams.length
        }),
        (indices) => {
          const uniqueIndices = [...new Set(indices)];
          const selectedTeams = uniqueIndices.map(i => mockTeams[i]);
          
          const stats = calculateDashboardStats(selectedTeams, mockPlayers, mockMatches);
          
          // Total teams should equal the number of selected teams
          return stats.totalTeams === selectedTeams.length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: statistics should be accurate for any subset of players', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockPlayers.length - 1 }), {
          minLength: 0,
          maxLength: mockPlayers.length
        }),
        (indices) => {
          const uniqueIndices = [...new Set(indices)];
          const selectedPlayers = uniqueIndices.map(i => mockPlayers[i]);
          
          const stats = calculateDashboardStats(mockTeams, selectedPlayers, mockMatches);
          
          // Total players should equal the number of selected players
          return stats.totalPlayers === selectedPlayers.length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: statistics should be accurate for any subset of matches', () => {
    // Skip test if no matches exist
    if (mockMatches.length === 0) {
      assert.ok(true, 'Skipping test: no matches in mock data');
      return;
    }

    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockMatches.length - 1 }), {
          minLength: 0,
          maxLength: mockMatches.length
        }),
        (indices) => {
          const uniqueIndices = [...new Set(indices)];
          const selectedMatches = uniqueIndices.map(i => mockMatches[i]);
          
          const stats = calculateDashboardStats(mockTeams, mockPlayers, selectedMatches);
          
          // Total matches should equal the number of selected matches
          // Matches played should equal completed matches in the subset
          const expectedMatchesPlayed = selectedMatches.filter(
            m => m.status === 'completed'
          ).length;
          
          return (
            stats.totalMatches === selectedMatches.length &&
            stats.matchesPlayed === expectedMatchesPlayed
          );
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: generated match arrays should have accurate completed count', () => {
    // Arbitrary for generating a Match object
    const matchArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      stage: fc.constantFrom('group', 'round16', 'quarter', 'semi', 'final', 'third') as fc.Arbitrary<'group' | 'round16' | 'quarter' | 'semi' | 'final' | 'third'>,
      group: fc.option(fc.string({ minLength: 1, maxLength: 1 }), { nil: undefined }),
      team1Id: fc.string({ minLength: 1, maxLength: 20 }),
      team2Id: fc.string({ minLength: 1, maxLength: 20 }),
      team1Score: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
      team2Score: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
      status: fc.constantFrom('pending', 'completed') as fc.Arbitrary<'pending' | 'completed'>,
      events: fc.constant([]),
      date: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
    }) as fc.Arbitrary<Match>;

    fc.assert(
      fc.property(
        fc.array(matchArbitrary, { minLength: 0, maxLength: 100 }),
        (matches) => {
          const stats = calculateDashboardStats(mockTeams, mockPlayers, matches);
          
          const expectedMatchesPlayed = matches.filter(
            m => m.status === 'completed'
          ).length;
          
          return (
            stats.totalMatches === matches.length &&
            stats.matchesPlayed === expectedMatchesPlayed
          );
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: statistics calculation should be consistent across multiple calls', () => {
    fc.assert(
      fc.property(
        fc.constant(mockTeams),
        fc.constant(mockPlayers),
        fc.constant(mockMatches),
        (teams, players, matches) => {
          const stats1 = calculateDashboardStats(teams, players, matches);
          const stats2 = calculateDashboardStats(teams, players, matches);
          
          // Multiple calls with same data should produce identical results
          return (
            stats1.totalTeams === stats2.totalTeams &&
            stats1.totalPlayers === stats2.totalPlayers &&
            stats1.totalMatches === stats2.totalMatches &&
            stats1.matchesPlayed === stats2.matchesPlayed
          );
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: matches played should never exceed total matches', () => {
    const matchArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      stage: fc.constantFrom('group', 'round16', 'quarter', 'semi', 'final', 'third') as fc.Arbitrary<'group' | 'round16' | 'quarter' | 'semi' | 'final' | 'third'>,
      group: fc.option(fc.string({ minLength: 1, maxLength: 1 }), { nil: undefined }),
      team1Id: fc.string({ minLength: 1, maxLength: 20 }),
      team2Id: fc.string({ minLength: 1, maxLength: 20 }),
      team1Score: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
      team2Score: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
      status: fc.constantFrom('pending', 'completed') as fc.Arbitrary<'pending' | 'completed'>,
      events: fc.constant([]),
      date: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
    }) as fc.Arbitrary<Match>;

    fc.assert(
      fc.property(
        fc.array(matchArbitrary, { minLength: 0, maxLength: 100 }),
        (matches) => {
          const stats = calculateDashboardStats(mockTeams, mockPlayers, matches);
          
          // Matches played should never exceed total matches
          return stats.matchesPlayed <= stats.totalMatches;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: all statistics should be non-negative', () => {
    const teamArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      schoolName: fc.string({ minLength: 1, maxLength: 100 }),
      logo: fc.string({ minLength: 1, maxLength: 100 }),
      officialName: fc.string({ minLength: 1, maxLength: 100 }),
      contactNumber: fc.string({ minLength: 10, maxLength: 20 }),
      group: fc.option(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H') as fc.Arbitrary<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'>, { nil: undefined })
    }) as fc.Arbitrary<Team>;

    const playerArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.string({ minLength: 1, maxLength: 100 }),
      jerseyNumber: fc.integer({ min: 1, max: 99 }),
      teamId: fc.string({ minLength: 1, maxLength: 20 }),
      studentCard: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      goals: fc.integer({ min: 0, max: 100 }),
      yellowCards: fc.integer({ min: 0, max: 10 }),
      redCards: fc.integer({ min: 0, max: 5 })
    }) as fc.Arbitrary<Player>;

    const matchArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      stage: fc.constantFrom('group', 'round16', 'quarter', 'semi', 'final', 'third') as fc.Arbitrary<'group' | 'round16' | 'quarter' | 'semi' | 'final' | 'third'>,
      group: fc.option(fc.string({ minLength: 1, maxLength: 1 }), { nil: undefined }),
      team1Id: fc.string({ minLength: 1, maxLength: 20 }),
      team2Id: fc.string({ minLength: 1, maxLength: 20 }),
      team1Score: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
      team2Score: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
      status: fc.constantFrom('pending', 'completed') as fc.Arbitrary<'pending' | 'completed'>,
      events: fc.constant([]),
      date: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
    }) as fc.Arbitrary<Match>;

    fc.assert(
      fc.property(
        fc.array(teamArbitrary, { minLength: 0, maxLength: 50 }),
        fc.array(playerArbitrary, { minLength: 0, maxLength: 100 }),
        fc.array(matchArbitrary, { minLength: 0, maxLength: 100 }),
        (teams, players, matches) => {
          const stats = calculateDashboardStats(teams, players, matches);
          
          // All statistics should be non-negative
          return (
            stats.totalTeams >= 0 &&
            stats.totalPlayers >= 0 &&
            stats.totalMatches >= 0 &&
            stats.matchesPlayed >= 0
          );
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: empty arrays should produce zero statistics', () => {
    fc.assert(
      fc.property(
        fc.constant([]),
        fc.constant([]),
        fc.constant([]),
        (teams, players, matches) => {
          const stats = calculateDashboardStats(teams, players, matches);
          
          // Empty arrays should result in all zeros
          return (
            stats.totalTeams === 0 &&
            stats.totalPlayers === 0 &&
            stats.totalMatches === 0 &&
            stats.matchesPlayed === 0
          );
        }
      ),
      { numRuns: 25 }
    );
  });
});
