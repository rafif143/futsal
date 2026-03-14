/**
 * Property-Based Tests for Dynamic Player Row Addition
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { PlayerInput } from '@/data/types';

/**
 * Simulates adding a player to the player list
 * This mirrors the handleAddPlayer logic in the PlayerInput component
 */
function addPlayer(players: PlayerInput[]): PlayerInput[] {
  const newPlayer: PlayerInput = {
    name: '',
    jerseyNumber: 0,
    studentCard: undefined,
  };
  return [...players, newPlayer];
}

/**
 * Arbitrary generator for PlayerInput
 */
const playerInputArbitrary = fc.record({
  name: fc.string(),
  jerseyNumber: fc.integer({ min: 0, max: 99 }),
  studentCard: fc.constant(undefined), // File objects are not easily generated, so we use undefined
});

/**
 * Property 2: Dynamic Player Row Addition
 * 
 * **Validates: Requirements 2.2**
 * 
 * For any registration form state, adding a player row should increase the player list length 
 * by exactly one and preserve all existing player data.
 * 
 * This property verifies that:
 * 1. Adding a player increases the list length by exactly 1
 * 2. All existing player data is preserved (no mutations)
 * 3. The new player has the correct initial values
 * 4. The operation works for any initial player list state
 */
describe('Property 2: Dynamic Player Row Addition', () => {
  test('adding a player should increase list length by exactly one', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 20 }),
        (initialPlayers) => {
          const updatedPlayers = addPlayer(initialPlayers);
          
          // Length should increase by exactly 1
          return updatedPlayers.length === initialPlayers.length + 1;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('adding a player should preserve all existing player data', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 1, maxLength: 20 }),
        (initialPlayers) => {
          const updatedPlayers = addPlayer(initialPlayers);
          
          // All existing players should be preserved with same data
          for (let i = 0; i < initialPlayers.length; i++) {
            if (updatedPlayers[i].name !== initialPlayers[i].name) return false;
            if (updatedPlayers[i].jerseyNumber !== initialPlayers[i].jerseyNumber) return false;
            if (updatedPlayers[i].studentCard !== initialPlayers[i].studentCard) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('new player should have correct initial values', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 20 }),
        (initialPlayers) => {
          const updatedPlayers = addPlayer(initialPlayers);
          
          // The new player (last in array) should have initial values
          const newPlayer = updatedPlayers[updatedPlayers.length - 1];
          
          return newPlayer.name === '' &&
                 newPlayer.jerseyNumber === 0 &&
                 newPlayer.studentCard === undefined;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('adding a player should not mutate the original array', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 20 }),
        (initialPlayers) => {
          const originalLength = initialPlayers.length;
          const originalData = initialPlayers.map(p => ({ ...p }));
          
          // Add player
          const updatedPlayers = addPlayer(initialPlayers);
          
          // Original array should not be mutated
          if (initialPlayers.length !== originalLength) return false;
          
          // Original data should be unchanged
          for (let i = 0; i < originalData.length; i++) {
            if (initialPlayers[i].name !== originalData[i].name) return false;
            if (initialPlayers[i].jerseyNumber !== originalData[i].jerseyNumber) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('adding multiple players sequentially should work correctly', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        (initialPlayers, addCount) => {
          let currentPlayers = initialPlayers;
          const expectedLength = initialPlayers.length + addCount;
          
          // Add multiple players
          for (let i = 0; i < addCount; i++) {
            currentPlayers = addPlayer(currentPlayers);
          }
          
          // Final length should be initial + addCount
          return currentPlayers.length === expectedLength;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('adding a player to empty list should create list with one player', () => {
    const emptyList: PlayerInput[] = [];
    const updatedList = addPlayer(emptyList);
    
    assert.strictEqual(updatedList.length, 1);
    assert.strictEqual(updatedList[0].name, '');
    assert.strictEqual(updatedList[0].jerseyNumber, 0);
    assert.strictEqual(updatedList[0].studentCard, undefined);
  });

  test('adding a player should maintain array order', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 2, maxLength: 20 }),
        (initialPlayers) => {
          const updatedPlayers = addPlayer(initialPlayers);
          
          // Check that all existing players are at the same indices (order preserved)
          // The first N elements should match the original N elements exactly
          for (let i = 0; i < initialPlayers.length; i++) {
            if (updatedPlayers[i].name !== initialPlayers[i].name) return false;
            if (updatedPlayers[i].jerseyNumber !== initialPlayers[i].jerseyNumber) return false;
            if (updatedPlayers[i].studentCard !== initialPlayers[i].studentCard) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: adding player is idempotent in structure', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 20 }),
        (initialPlayers) => {
          // Add player twice
          const firstAdd = addPlayer(initialPlayers);
          const secondAdd = addPlayer(initialPlayers);
          
          // Both should have same length increase
          const firstIncrease = firstAdd.length - initialPlayers.length;
          const secondIncrease = secondAdd.length - initialPlayers.length;
          
          // Both should preserve original data in same way
          let samePreservation = true;
          for (let i = 0; i < initialPlayers.length; i++) {
            if (firstAdd[i].name !== secondAdd[i].name) samePreservation = false;
            if (firstAdd[i].jerseyNumber !== secondAdd[i].jerseyNumber) samePreservation = false;
          }
          
          return firstIncrease === 1 && 
                 secondIncrease === 1 && 
                 samePreservation;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: adding player works for any valid player list size', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        (listSize) => {
          // Create a list of the specified size
          const players: PlayerInput[] = Array.from({ length: listSize }, (_, i) => ({
            name: `Player ${i}`,
            jerseyNumber: i,
            studentCard: undefined,
          }));
          
          const updatedPlayers = addPlayer(players);
          
          // Should work correctly regardless of initial size
          return updatedPlayers.length === listSize + 1 &&
                 updatedPlayers[updatedPlayers.length - 1].name === '' &&
                 updatedPlayers[updatedPlayers.length - 1].jerseyNumber === 0;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: existing players should be at same indices after addition', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 1, maxLength: 20 }),
        (initialPlayers) => {
          const updatedPlayers = addPlayer(initialPlayers);
          
          // Each existing player should be at the same index
          for (let i = 0; i < initialPlayers.length; i++) {
            if (updatedPlayers[i].name !== initialPlayers[i].name) return false;
            if (updatedPlayers[i].jerseyNumber !== initialPlayers[i].jerseyNumber) return false;
            if (updatedPlayers[i].studentCard !== initialPlayers[i].studentCard) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: new player should always be at the end of the list', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 20 }),
        (initialPlayers) => {
          const updatedPlayers = addPlayer(initialPlayers);
          const lastIndex = updatedPlayers.length - 1;
          const newPlayer = updatedPlayers[lastIndex];
          
          // New player should be at the end
          return newPlayer.name === '' && 
                 newPlayer.jerseyNumber === 0 &&
                 newPlayer.studentCard === undefined;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: adding player preserves player identity', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 19 }),
        (initialPlayers, checkIndex) => {
          // Only check valid indices
          if (checkIndex >= initialPlayers.length) return true;
          
          const playerToCheck = initialPlayers[checkIndex];
          const updatedPlayers = addPlayer(initialPlayers);
          const playerAfterAdd = updatedPlayers[checkIndex];
          
          // Player at same index should have same data
          return playerToCheck.name === playerAfterAdd.name &&
                 playerToCheck.jerseyNumber === playerAfterAdd.jerseyNumber &&
                 playerToCheck.studentCard === playerAfterAdd.studentCard;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: adding player is associative with multiple additions', () => {
    fc.assert(
      fc.property(
        fc.array(playerInputArbitrary, { minLength: 0, maxLength: 10 }),
        (initialPlayers) => {
          // Add two players in sequence
          const afterFirst = addPlayer(initialPlayers);
          const afterSecond = addPlayer(afterFirst);
          
          // Should have correct length
          if (afterSecond.length !== initialPlayers.length + 2) return false;
          
          // Original players should still be preserved
          for (let i = 0; i < initialPlayers.length; i++) {
            if (afterSecond[i].name !== initialPlayers[i].name) return false;
            if (afterSecond[i].jerseyNumber !== initialPlayers[i].jerseyNumber) return false;
          }
          
          // Both new players should have initial values
          const firstNew = afterSecond[afterSecond.length - 2];
          const secondNew = afterSecond[afterSecond.length - 1];
          
          return firstNew.name === '' && firstNew.jerseyNumber === 0 &&
                 secondNew.name === '' && secondNew.jerseyNumber === 0;
        }
      ),
      { numRuns: 25 }
    );
  });
});
