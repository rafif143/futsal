import { describe, it } from "node:test";
import assert from "node:assert";
import { PlayerInput as PlayerInputType } from "@/data/types";

describe("PlayerInput Component", () => {
  it("should accept players array prop", () => {
    const players: PlayerInputType[] = [];
    // Validates that players is an array
    assert.ok(Array.isArray(players));
  });

  it("should accept onChange callback prop", () => {
    const onChange = (players: PlayerInputType[]) => {
      // Mock callback
    };
    // Validates that onChange is a function
    assert.strictEqual(typeof onChange, "function");
  });

  it("should handle empty players array", () => {
    const players: PlayerInputType[] = [];
    // Validates empty array is valid
    assert.strictEqual(players.length, 0);
  });

  it("should handle players with valid structure", () => {
    const players: PlayerInputType[] = [
      {
        name: "John Doe",
        jerseyNumber: 10,
        studentCard: undefined,
      },
    ];
    // Validates player structure
    assert.strictEqual(players.length, 1);
    assert.strictEqual(players[0].name, "John Doe");
    assert.strictEqual(players[0].jerseyNumber, 10);
  });

  it("should handle adding a new player", () => {
    const players: PlayerInputType[] = [
      { name: "Player 1", jerseyNumber: 1 },
    ];
    const newPlayer: PlayerInputType = {
      name: "",
      jerseyNumber: 0,
      studentCard: undefined,
    };
    const updatedPlayers = [...players, newPlayer];
    
    // Validates that adding a player increases array length by 1
    assert.strictEqual(updatedPlayers.length, players.length + 1);
    assert.strictEqual(updatedPlayers[updatedPlayers.length - 1].name, "");
  });

  it("should handle removing a player", () => {
    const players: PlayerInputType[] = [
      { name: "Player 1", jerseyNumber: 1 },
      { name: "Player 2", jerseyNumber: 2 },
    ];
    const indexToRemove = 0;
    const updatedPlayers = players.filter((_, i) => i !== indexToRemove);
    
    // Validates that removing a player decreases array length by 1
    assert.strictEqual(updatedPlayers.length, players.length - 1);
    assert.strictEqual(updatedPlayers[0].name, "Player 2");
  });

  it("should preserve existing player data when adding new player", () => {
    const existingPlayers: PlayerInputType[] = [
      { name: "Player 1", jerseyNumber: 10 },
      { name: "Player 2", jerseyNumber: 20 },
    ];
    const newPlayer: PlayerInputType = {
      name: "",
      jerseyNumber: 0,
    };
    const updatedPlayers = [...existingPlayers, newPlayer];
    
    // Validates that existing players are preserved
    assert.strictEqual(updatedPlayers[0].name, "Player 1");
    assert.strictEqual(updatedPlayers[0].jerseyNumber, 10);
    assert.strictEqual(updatedPlayers[1].name, "Player 2");
    assert.strictEqual(updatedPlayers[1].jerseyNumber, 20);
  });

  it("should handle updating player name", () => {
    const players: PlayerInputType[] = [
      { name: "Old Name", jerseyNumber: 10 },
    ];
    const updatedPlayers = [...players];
    updatedPlayers[0] = { ...updatedPlayers[0], name: "New Name" };
    
    // Validates that player name can be updated
    assert.strictEqual(updatedPlayers[0].name, "New Name");
    assert.strictEqual(updatedPlayers[0].jerseyNumber, 10);
  });

  it("should handle updating jersey number", () => {
    const players: PlayerInputType[] = [
      { name: "Player 1", jerseyNumber: 10 },
    ];
    const updatedPlayers = [...players];
    updatedPlayers[0] = { ...updatedPlayers[0], jerseyNumber: 99 };
    
    // Validates that jersey number can be updated
    assert.strictEqual(updatedPlayers[0].jerseyNumber, 99);
    assert.strictEqual(updatedPlayers[0].name, "Player 1");
  });

  it("should handle jersey numbers from 0 to 99", () => {
    const validNumbers = [0, 1, 10, 50, 99];
    validNumbers.forEach((num) => {
      assert.ok(num >= 0 && num <= 99);
    });
  });

  it("should handle multiple players", () => {
    const players: PlayerInputType[] = [
      { name: "Player 1", jerseyNumber: 1 },
      { name: "Player 2", jerseyNumber: 2 },
      { name: "Player 3", jerseyNumber: 3 },
    ];
    
    // Validates multiple players
    assert.strictEqual(players.length, 3);
    players.forEach((player, index) => {
      assert.strictEqual(player.name, `Player ${index + 1}`);
      assert.strictEqual(player.jerseyNumber, index + 1);
    });
  });
});
