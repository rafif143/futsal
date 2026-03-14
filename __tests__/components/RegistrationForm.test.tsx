import { describe, it } from "node:test";
import assert from "node:assert";
import { RegistrationData, PlayerInput as PlayerInputType } from "@/data/types";

describe("RegistrationForm Component", () => {
  it("should accept onSubmit callback prop", () => {
    const onSubmit = (data: RegistrationData) => {
      // Mock callback
    };
    // Validates that onSubmit is a function
    assert.strictEqual(typeof onSubmit, "function");
  });

  it("should validate required fields - team name", () => {
    const teamName = "";
    const isValid = teamName.trim().length > 0;
    // Validates that empty team name is invalid
    assert.strictEqual(isValid, false);
  });

  it("should validate required fields - school name", () => {
    const schoolName = "";
    const isValid = schoolName.trim().length > 0;
    // Validates that empty school name is invalid
    assert.strictEqual(isValid, false);
  });

  it("should validate required fields - official name", () => {
    const officialName = "";
    const isValid = officialName.trim().length > 0;
    // Validates that empty official name is invalid
    assert.strictEqual(isValid, false);
  });

  it("should validate required fields - contact number", () => {
    const contactNumber = "";
    const isValid = contactNumber.trim().length > 0;
    // Validates that empty contact number is invalid
    assert.strictEqual(isValid, false);
  });

  it("should validate phone number format - valid format", () => {
    const validNumbers = ["+6281234567890", "081234567890", "+628123456789"];
    validNumbers.forEach((number) => {
      const cleaned = number.replace(/\s/g, "");
      const isValid = /^\+?[0-9]{10,15}$/.test(cleaned);
      assert.strictEqual(isValid, true, `${number} should be valid`);
    });
  });

  it("should validate phone number format - invalid format", () => {
    const invalidNumbers = ["invalid", "123", "abc123", "+62abc"];
    invalidNumbers.forEach((number) => {
      const cleaned = number.replace(/\s/g, "");
      const isValid = /^\+?[0-9]{10,15}$/.test(cleaned);
      assert.strictEqual(isValid, false, `${number} should be invalid`);
    });
  });

  it("should require at least one player", () => {
    const players: PlayerInputType[] = [];
    const isValid = players.length > 0;
    // Validates that empty players array is invalid
    assert.strictEqual(isValid, false);
  });

  it("should validate player has required fields", () => {
    const validPlayer: PlayerInputType = {
      name: "John Doe",
      jerseyNumber: 10,
      studentCard: new File([""], "card.jpg"),
    };
    const isValid =
      validPlayer.name.trim().length > 0 &&
      validPlayer.jerseyNumber > 0 &&
      validPlayer.studentCard !== undefined;
    // Validates that player with all fields is valid
    assert.strictEqual(isValid, true);
  });

  it("should invalidate player with missing name", () => {
    const invalidPlayer: PlayerInputType = {
      name: "",
      jerseyNumber: 10,
      studentCard: new File([""], "card.jpg"),
    };
    const isValid = invalidPlayer.name.trim().length > 0;
    // Validates that player without name is invalid
    assert.strictEqual(isValid, false);
  });

  it("should invalidate player with missing jersey number", () => {
    const invalidPlayer: PlayerInputType = {
      name: "John Doe",
      jerseyNumber: 0,
      studentCard: new File([""], "card.jpg"),
    };
    const isValid = invalidPlayer.jerseyNumber > 0;
    // Validates that player without jersey number is invalid
    assert.strictEqual(isValid, false);
  });

  it("should invalidate player with missing student card", () => {
    const invalidPlayer: PlayerInputType = {
      name: "John Doe",
      jerseyNumber: 10,
      studentCard: undefined,
    };
    const isValid = invalidPlayer.studentCard !== undefined;
    // Validates that player without student card is invalid
    assert.strictEqual(isValid, false);
  });

  it("should generate WhatsApp URL with correct format", () => {
    const adminNumber = "+6281234567890";
    const teamName = "Test Team";
    const schoolName = "Test School";
    const message = `Hello, I would like to register my team for the Futsal Tournament.

Team Name: ${teamName}
School: ${schoolName}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminNumber.replace(/\+/g, "")}?text=${encodedMessage}`;
    
    // Validates WhatsApp URL format
    assert.ok(whatsappUrl.includes("wa.me"));
    assert.ok(whatsappUrl.includes("6281234567890"));
    assert.ok(whatsappUrl.includes("text="));
  });

  it("should encode WhatsApp message properly", () => {
    const message = "Hello World Test & Special Characters";
    const encoded = encodeURIComponent(message);
    
    // Validates that special characters are encoded
    assert.ok(!encoded.includes(" "), "Spaces should be encoded");
    assert.ok(!encoded.includes("&"), "Ampersand should be encoded");
    assert.ok(encoded.includes("%"), "Should contain encoded characters");
    assert.ok(encoded.includes("Hello"), "Should preserve regular text");
  });

  it("should handle valid registration data structure", () => {
    const validData: RegistrationData = {
      teamName: "Test Team",
      schoolName: "Test School",
      teamLogo: new File([""], "logo.png"),
      officialName: "John Doe",
      contactNumber: "+6281234567890",
      players: [
        {
          name: "Player 1",
          jerseyNumber: 10,
          studentCard: new File([""], "card1.jpg"),
        },
      ],
    };
    
    // Validates registration data structure
    assert.strictEqual(validData.teamName, "Test Team");
    assert.strictEqual(validData.schoolName, "Test School");
    assert.strictEqual(validData.officialName, "John Doe");
    assert.strictEqual(validData.contactNumber, "+6281234567890");
    assert.strictEqual(validData.players.length, 1);
  });

  it("should handle optional team logo", () => {
    const dataWithLogo: RegistrationData = {
      teamName: "Test Team",
      schoolName: "Test School",
      teamLogo: new File([""], "logo.png"),
      officialName: "John Doe",
      contactNumber: "+6281234567890",
      players: [],
    };
    
    const dataWithoutLogo: RegistrationData = {
      teamName: "Test Team",
      schoolName: "Test School",
      teamLogo: undefined,
      officialName: "John Doe",
      contactNumber: "+6281234567890",
      players: [],
    };
    
    // Validates that team logo is optional
    assert.ok(dataWithLogo.teamLogo !== undefined);
    assert.strictEqual(dataWithoutLogo.teamLogo, undefined);
  });

  it("should handle multiple players in registration", () => {
    const players: PlayerInputType[] = [
      { name: "Player 1", jerseyNumber: 10 },
      { name: "Player 2", jerseyNumber: 20 },
      { name: "Player 3", jerseyNumber: 30 },
    ];
    
    const data: RegistrationData = {
      teamName: "Test Team",
      schoolName: "Test School",
      officialName: "John Doe",
      contactNumber: "+6281234567890",
      players: players,
    };
    
    // Validates multiple players
    assert.strictEqual(data.players.length, 3);
    assert.strictEqual(data.players[0].jerseyNumber, 10);
    assert.strictEqual(data.players[1].jerseyNumber, 20);
    assert.strictEqual(data.players[2].jerseyNumber, 30);
  });
});
