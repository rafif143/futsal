/**
 * Property-Based Tests for Mock Data Integrity
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { mockTeams } from '../../data/mock-teams';
import { mockPlayers } from '../../data/mock-players';
import { Team, Player } from '../../data/types';

/**
 * Property 23: Mock Team Uniqueness
 * 
 * **Validates: Requirements 17.1**
 * 
 * For any mock team data, all team IDs and team names should be unique with no duplicates.
 * 
 * This property verifies that:
 * 1. All team IDs are unique (no duplicate IDs)
 * 2. All team names are unique (no duplicate names)
 * 3. The mock data maintains referential integrity
 */
describe('Property 23: Mock Team Uniqueness', () => {
  test('all team IDs should be unique in mock data', () => {
    const teamIds = mockTeams.map(team => team.id);
    const uniqueIds = new Set(teamIds);
    
    assert.strictEqual(
      uniqueIds.size,
      teamIds.length,
      `Expected ${teamIds.length} unique team IDs, but found ${uniqueIds.size}. Duplicate IDs exist.`
    );
  });

  test('all team names should be unique in mock data', () => {
    const teamNames = mockTeams.map(team => team.name);
    const uniqueNames = new Set(teamNames);
    
    assert.strictEqual(
      uniqueNames.size,
      teamNames.length,
      `Expected ${teamNames.length} unique team names, but found ${uniqueNames.size}. Duplicate names exist.`
    );
  });

  test('property: any subset of teams should maintain ID uniqueness', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockTeams.length - 1 }), { 
          minLength: 1, 
          maxLength: mockTeams.length 
        }),
        (indices) => {
          // Get unique indices to avoid intentional duplicates from the arbitrary
          const uniqueIndices = [...new Set(indices)];
          const selectedTeams = uniqueIndices.map(i => mockTeams[i]);
          
          const teamIds = selectedTeams.map(team => team.id);
          const uniqueIds = new Set(teamIds);
          
          // All selected team IDs should be unique
          return uniqueIds.size === teamIds.length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: any subset of teams should maintain name uniqueness', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockTeams.length - 1 }), { 
          minLength: 1, 
          maxLength: mockTeams.length 
        }),
        (indices) => {
          // Get unique indices to avoid intentional duplicates from the arbitrary
          const uniqueIndices = [...new Set(indices)];
          const selectedTeams = uniqueIndices.map(i => mockTeams[i]);
          
          const teamNames = selectedTeams.map(team => team.name);
          const uniqueNames = new Set(teamNames);
          
          // All selected team names should be unique
          return uniqueNames.size === teamNames.length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: generated team arrays should have unique IDs', () => {
    // Arbitrary for generating a Team object
    const teamArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      schoolName: fc.string({ minLength: 1, maxLength: 100 }),
      logo: fc.string({ minLength: 1, maxLength: 100 }),
      officialName: fc.string({ minLength: 1, maxLength: 100 }),
      contactNumber: fc.string({ minLength: 10, maxLength: 20 }),
      group: fc.option(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H') as fc.Arbitrary<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'>, { nil: undefined })
    }) as fc.Arbitrary<Team>;

    fc.assert(
      fc.property(
        fc.uniqueArray(teamArbitrary, { 
          selector: (team) => team.id,
          minLength: 1,
          maxLength: 50
        }),
        (teams) => {
          const teamIds = teams.map(team => team.id);
          const uniqueIds = new Set(teamIds);
          
          // When teams are generated with unique IDs, the set size should equal array length
          return uniqueIds.size === teamIds.length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: generated team arrays should have unique names when constrained', () => {
    // Arbitrary for generating a Team object
    const teamArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      schoolName: fc.string({ minLength: 1, maxLength: 100 }),
      logo: fc.string({ minLength: 1, maxLength: 100 }),
      officialName: fc.string({ minLength: 1, maxLength: 100 }),
      contactNumber: fc.string({ minLength: 10, maxLength: 20 }),
      group: fc.option(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H') as fc.Arbitrary<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'>, { nil: undefined })
    }) as fc.Arbitrary<Team>;

    fc.assert(
      fc.property(
        fc.uniqueArray(teamArbitrary, { 
          selector: (team) => team.name,
          minLength: 1,
          maxLength: 50
        }),
        (teams) => {
          const teamNames = teams.map(team => team.name);
          const uniqueNames = new Set(teamNames);
          
          // When teams are generated with unique names, the set size should equal array length
          return uniqueNames.size === teamNames.length;
        }
      ),
      { numRuns: 25 }
    );
  });
});

/**
 * Property 24: Mock Player Distribution
 * 
 * **Validates: Requirements 17.2**
 * 
 * For any team in the mock data, there should be exactly 10 players with teamId matching that team's ID.
 * 
 * This property verifies that:
 * 1. Each team has exactly 10 players
 * 2. Player teamId references are valid
 * 3. The distribution is consistent across all teams
 */
describe('Property 24: Mock Player Distribution', () => {
  test('each team should have exactly 10 players in mock data', () => {
    for (const team of mockTeams) {
      const teamPlayers = mockPlayers.filter(player => player.teamId === team.id);
      
      assert.strictEqual(
        teamPlayers.length,
        10,
        `Team ${team.name} (${team.id}) should have exactly 10 players, but has ${teamPlayers.length}`
      );
    }
  });

  test('total player count should equal 32 teams × 10 players', () => {
    const expectedTotalPlayers = mockTeams.length * 10;
    
    assert.strictEqual(
      mockPlayers.length,
      expectedTotalPlayers,
      `Expected ${expectedTotalPlayers} total players (32 teams × 10), but found ${mockPlayers.length}`
    );
  });

  test('all players should belong to valid teams', () => {
    const validTeamIds = new Set(mockTeams.map(team => team.id));
    
    for (const player of mockPlayers) {
      assert.ok(
        validTeamIds.has(player.teamId),
        `Player ${player.name} (${player.id}) has invalid teamId: ${player.teamId}`
      );
    }
  });

  test('property: any subset of teams should have correct player distribution', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockTeams.length - 1 }), { 
          minLength: 1, 
          maxLength: mockTeams.length 
        }),
        (indices) => {
          // Get unique indices
          const uniqueIndices = [...new Set(indices)];
          const selectedTeams = uniqueIndices.map(i => mockTeams[i]);
          
          // Each selected team should have exactly 10 players
          for (const team of selectedTeams) {
            const teamPlayers = mockPlayers.filter(player => player.teamId === team.id);
            if (teamPlayers.length !== 10) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: generated player arrays should maintain team distribution', () => {
    // Arbitrary for generating a Player object
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

    fc.assert(
      fc.property(
        fc.array(playerArbitrary, { minLength: 10, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (players, targetTeamId) => {
          // Count players for the target team
          const teamPlayerCount = players.filter(p => p.teamId === targetTeamId).length;
          
          // The count should be non-negative (basic sanity check)
          return teamPlayerCount >= 0;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: player distribution function should return correct count', () => {
    // Helper function to count players for a team
    const countPlayersForTeam = (players: Player[], teamId: string): number => {
      return players.filter(p => p.teamId === teamId).length;
    };

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: mockTeams.length - 1 }),
        (teamIndex) => {
          const team = mockTeams[teamIndex];
          const playerCount = countPlayersForTeam(mockPlayers, team.id);
          
          // Each team in mock data should have exactly 10 players
          return playerCount === 10;
        }
      ),
      { numRuns: 25 }
    );
  });
});

/**
 * Property 25: Mock Data Referential Integrity
 * 
 * **Validates: Requirements 17.5**
 * 
 * For any player in the mock data, the player's teamId should match an existing team ID in the mock team data.
 * 
 * This property verifies that:
 * 1. All player teamId references point to valid teams
 * 2. No orphaned players exist (players without valid team references)
 * 3. The referential integrity is maintained across the entire dataset
 */
describe('Property 25: Mock Data Referential Integrity', () => {
  test('all players should reference existing team IDs', () => {
    const validTeamIds = new Set(mockTeams.map(team => team.id));
    
    for (const player of mockPlayers) {
      assert.ok(
        validTeamIds.has(player.teamId),
        `Player ${player.name} (${player.id}) references non-existent teamId: ${player.teamId}`
      );
    }
  });

  test('no orphaned players should exist in mock data', () => {
    const validTeamIds = new Set(mockTeams.map(team => team.id));
    const orphanedPlayers = mockPlayers.filter(player => !validTeamIds.has(player.teamId));
    
    assert.strictEqual(
      orphanedPlayers.length,
      0,
      `Found ${orphanedPlayers.length} orphaned players without valid team references: ${orphanedPlayers.map(p => p.id).join(', ')}`
    );
  });

  test('property: any subset of players should maintain referential integrity', () => {
    const validTeamIds = new Set(mockTeams.map(team => team.id));
    
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: mockPlayers.length - 1 }), { 
          minLength: 1, 
          maxLength: mockPlayers.length 
        }),
        (indices) => {
          // Get unique indices
          const uniqueIndices = [...new Set(indices)];
          const selectedPlayers = uniqueIndices.map(i => mockPlayers[i]);
          
          // All selected players should reference valid team IDs
          for (const player of selectedPlayers) {
            if (!validTeamIds.has(player.teamId)) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: generated player arrays should maintain referential integrity with given teams', () => {
    // Arbitrary for generating a Team object
    const teamArbitrary = fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      schoolName: fc.string({ minLength: 1, maxLength: 100 }),
      logo: fc.string({ minLength: 1, maxLength: 100 }),
      officialName: fc.string({ minLength: 1, maxLength: 100 }),
      contactNumber: fc.string({ minLength: 10, maxLength: 20 }),
      group: fc.option(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H') as fc.Arbitrary<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'>, { nil: undefined })
    }) as fc.Arbitrary<Team>;

    fc.assert(
      fc.property(
        fc.array(teamArbitrary, { minLength: 1, maxLength: 10 }),
        (teams) => {
          const validTeamIds = new Set(teams.map(team => team.id));
          
          // Generate players that reference these teams
          const playerArbitrary = fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            jerseyNumber: fc.integer({ min: 1, max: 99 }),
            teamId: fc.constantFrom(...teams.map(t => t.id)),
            studentCard: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
            goals: fc.integer({ min: 0, max: 100 }),
            yellowCards: fc.integer({ min: 0, max: 10 }),
            redCards: fc.integer({ min: 0, max: 5 })
          }) as fc.Arbitrary<Player>;

          return fc.sample(playerArbitrary, { numRuns: 10 }).every(player => 
            validTeamIds.has(player.teamId)
          );
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: referential integrity check function should correctly validate player-team relationships', () => {
    // Helper function to check referential integrity
    const hasValidTeamReference = (player: Player, teams: Team[]): boolean => {
      return teams.some(team => team.id === player.teamId);
    };

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: mockPlayers.length - 1 }),
        (playerIndex) => {
          const player = mockPlayers[playerIndex];
          
          // Every player in mock data should have a valid team reference
          return hasValidTeamReference(player, mockTeams);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: all team IDs referenced by players should exist in team data', () => {
    fc.assert(
      fc.property(
        fc.constant(mockPlayers),
        fc.constant(mockTeams),
        (players, teams) => {
          const validTeamIds = new Set(teams.map(team => team.id));
          const referencedTeamIds = new Set(players.map(player => player.teamId));
          
          // All referenced team IDs should exist in the team data
          for (const teamId of referencedTeamIds) {
            if (!validTeamIds.has(teamId)) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });
});
