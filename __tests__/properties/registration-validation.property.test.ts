/**
 * Property-Based Tests for Registration Form Validation
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { RegistrationData, PlayerInput } from '@/data/types';

/**
 * Validation function that mirrors the RegistrationForm component logic
 */
interface ValidationErrors {
  teamName?: string;
  schoolName?: string;
  officialName?: string;
  contactNumber?: string;
  players?: string;
}

function validateRegistrationForm(data: Partial<RegistrationData>): {
  isValid: boolean;
  errors: ValidationErrors;
  missingFields: string[];
} {
  const errors: ValidationErrors = {};
  const missingFields: string[] = [];

  // Validate team name
  if (!data.teamName || !data.teamName.trim()) {
    errors.teamName = 'Team name is required';
    missingFields.push('teamName');
  }

  // Validate school name
  if (!data.schoolName || !data.schoolName.trim()) {
    errors.schoolName = 'School name is required';
    missingFields.push('schoolName');
  }

  // Validate official name
  if (!data.officialName || !data.officialName.trim()) {
    errors.officialName = 'Official name is required';
    missingFields.push('officialName');
  }

  // Validate contact number
  if (!data.contactNumber || !data.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required';
    missingFields.push('contactNumber');
  } else if (!/^\+?[0-9]{10,15}$/.test(data.contactNumber.replace(/\s/g, ''))) {
    errors.contactNumber = 'Please enter a valid phone number (e.g., +62812345678)';
    missingFields.push('contactNumber');
  }

  // Validate players
  if (!data.players || data.players.length === 0) {
    errors.players = 'At least one player is required';
    missingFields.push('players');
  } else {
    // Validate each player has required fields
    const hasInvalidPlayer = data.players.some(
      (player) => !player.name.trim() || !player.jerseyNumber || !player.studentCard
    );
    if (hasInvalidPlayer) {
      errors.players = 'All player fields are required';
      missingFields.push('players');
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    missingFields,
  };
}

/**
 * Arbitraries for generating test data
 */

// Generate valid player data
const validPlayerArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'Player'),
  jerseyNumber: fc.integer({ min: 1, max: 99 }),
  studentCard: fc.constant(new File([''], 'student-card.jpg', { type: 'image/jpeg' })),
});

// Generate invalid player data (missing required fields)
const invalidPlayerArbitrary = fc.oneof(
  // Missing name
  fc.record({
    name: fc.constant(''),
    jerseyNumber: fc.integer({ min: 1, max: 99 }),
    studentCard: fc.constant(new File([''], 'student-card.jpg', { type: 'image/jpeg' })),
  }),
  // Missing jersey number
  fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    jerseyNumber: fc.constant(0),
    studentCard: fc.constant(new File([''], 'student-card.jpg', { type: 'image/jpeg' })),
  }),
  // Missing student card
  fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    jerseyNumber: fc.integer({ min: 1, max: 99 }),
    studentCard: fc.constant(undefined as any),
  })
);

// Generate valid phone numbers (directly constructed to avoid filter loops)
const validPhoneArbitrary = fc.oneof(
  fc.integer({ min: 1000000000, max: 9999999999 }).map(n => `+62${n}`),
  fc.integer({ min: 1000000000, max: 9999999999 }).map(n => `62${n}`),
  fc.integer({ min: 10000000000, max: 99999999999 }).map(n => `${n}`)
);

// Generate invalid phone numbers
const invalidPhoneArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('123'), // Too short
  fc.constant('abc123def'), // Contains letters
  fc.constant('+62'), // Too short
  fc.string({ minLength: 1, maxLength: 9 }).map(s => s.replace(/\D/g, '')), // Too short
  fc.string({ minLength: 16, maxLength: 20 }).map(s => s.replace(/\D/g, '')), // Too long
);

/**
 * Property 4: Registration Form Validation
 * 
 * **Validates: Requirements 2.5**
 * 
 * For any registration form submission with missing required fields,
 * the validation should reject the submission and identify all missing fields.
 * 
 * This property verifies that:
 * 1. Validation rejects submissions with missing required fields
 * 2. All missing fields are correctly identified
 * 3. Validation accepts submissions with all required fields present
 * 4. Phone number format validation works correctly
 * 5. Player validation works correctly
 */
describe('Property 4: Registration Form Validation', () => {
  test('validation should reject empty form data', () => {
    const emptyData: Partial<RegistrationData> = {};
    const result = validateRegistrationForm(emptyData);
    
    assert.strictEqual(result.isValid, false, 'Empty form should be invalid');
    assert.ok(result.missingFields.length > 0, 'Should identify missing fields');
    assert.ok(result.missingFields.includes('teamName'), 'Should identify missing teamName');
    assert.ok(result.missingFields.includes('schoolName'), 'Should identify missing schoolName');
    assert.ok(result.missingFields.includes('officialName'), 'Should identify missing officialName');
    assert.ok(result.missingFields.includes('contactNumber'), 'Should identify missing contactNumber');
    assert.ok(result.missingFields.includes('players'), 'Should identify missing players');
  });

  test('validation should reject form with only whitespace in required fields', () => {
    const whitespaceData: Partial<RegistrationData> = {
      teamName: '   ',
      schoolName: '   ',
      officialName: '   ',
      contactNumber: '   ',
      players: [],
    };
    
    const result = validateRegistrationForm(whitespaceData);
    
    assert.strictEqual(result.isValid, false, 'Form with whitespace should be invalid');
    assert.ok(result.missingFields.length >= 5, 'Should identify all missing fields');
  });

  test('validation should accept form with all required fields', () => {
    const validData: RegistrationData = {
      teamName: 'Test Team',
      schoolName: 'Test School',
      officialName: 'John Doe',
      contactNumber: '+6281234567890',
      players: [
        {
          name: 'Player 1',
          jerseyNumber: 10,
          studentCard: new File([''], 'card1.jpg', { type: 'image/jpeg' }),
        },
      ],
    };
    
    const result = validateRegistrationForm(validData);
    
    assert.strictEqual(result.isValid, true, 'Valid form should be accepted');
    assert.strictEqual(result.missingFields.length, 0, 'Should have no missing fields');
    assert.strictEqual(Object.keys(result.errors).length, 0, 'Should have no errors');
  });

  test('property: validation should reject any form missing teamName', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 5 }),
        (schoolName, officialName, contactNumber, players) => {
          const data: Partial<RegistrationData> = {
            teamName: '', // Missing
            schoolName,
            officialName,
            contactNumber,
            players,
          };
          
          const result = validateRegistrationForm(data);
          
          return !result.isValid && result.missingFields.includes('teamName');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should reject any form missing schoolName', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 5 }),
        (teamName, officialName, contactNumber, players) => {
          const data: Partial<RegistrationData> = {
            teamName,
            schoolName: '', // Missing
            officialName,
            contactNumber,
            players,
          };
          
          const result = validateRegistrationForm(data);
          
          return !result.isValid && result.missingFields.includes('schoolName');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should reject any form missing officialName', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 5 }),
        (teamName, schoolName, contactNumber, players) => {
          const data: Partial<RegistrationData> = {
            teamName,
            schoolName,
            officialName: '', // Missing
            contactNumber,
            players,
          };
          
          const result = validateRegistrationForm(data);
          
          return !result.isValid && result.missingFields.includes('officialName');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should reject any form with invalid contactNumber', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        invalidPhoneArbitrary,
        fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 5 }),
        (teamName, schoolName, officialName, contactNumber, players) => {
          const data: Partial<RegistrationData> = {
            teamName,
            schoolName,
            officialName,
            contactNumber,
            players,
          };
          
          const result = validateRegistrationForm(data);
          
          return !result.isValid && result.missingFields.includes('contactNumber');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should reject any form with no players', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        (teamName, schoolName, officialName, contactNumber) => {
          const data: Partial<RegistrationData> = {
            teamName,
            schoolName,
            officialName,
            contactNumber,
            players: [], // No players
          };
          
          const result = validateRegistrationForm(data);
          
          return !result.isValid && result.missingFields.includes('players');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should reject any form with invalid players', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        fc.array(invalidPlayerArbitrary, { minLength: 1, maxLength: 5 }),
        (teamName, schoolName, officialName, contactNumber, players) => {
          const data: Partial<RegistrationData> = {
            teamName,
            schoolName,
            officialName,
            contactNumber,
            players,
          };
          
          const result = validateRegistrationForm(data);
          
          return !result.isValid && result.missingFields.includes('players');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should accept any form with all valid required fields', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 11 }),
        (teamName, schoolName, officialName, contactNumber, players) => {
          const data: RegistrationData = {
            teamName,
            schoolName,
            officialName,
            contactNumber,
            players,
          };
          
          const result = validateRegistrationForm(data);
          
          return result.isValid && result.missingFields.length === 0;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: number of missing fields should equal number of error keys', () => {
    fc.assert(
      fc.property(
        fc.record({
          teamName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: '' }),
          schoolName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: '' }),
          officialName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: '' }),
          contactNumber: fc.option(fc.string({ minLength: 10, maxLength: 15 }), { nil: '' }),
          players: fc.option(fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 5 }), { nil: [] }),
        }),
        (data) => {
          const result = validateRegistrationForm(data as Partial<RegistrationData>);
          
          // Number of missing fields should match number of error keys
          return result.missingFields.length === Object.keys(result.errors).length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should be deterministic for the same input', () => {
    fc.assert(
      fc.property(
        fc.record({
          teamName: fc.string({ minLength: 0, maxLength: 50 }),
          schoolName: fc.string({ minLength: 0, maxLength: 50 }),
          officialName: fc.string({ minLength: 0, maxLength: 50 }),
          contactNumber: fc.string({ minLength: 0, maxLength: 20 }),
          players: fc.array(validPlayerArbitrary, { minLength: 0, maxLength: 5 }),
        }),
        (data) => {
          const result1 = validateRegistrationForm(data as Partial<RegistrationData>);
          const result2 = validateRegistrationForm(data as Partial<RegistrationData>);
          
          // Results should be identical
          return result1.isValid === result2.isValid &&
                 result1.missingFields.length === result2.missingFields.length &&
                 Object.keys(result1.errors).length === Object.keys(result2.errors).length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should identify all missing fields when multiple are missing', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('teamName', 'schoolName', 'officialName', 'contactNumber', 'players'), {
          minLength: 1,
          maxLength: 5,
        }),
        (fieldsToOmit) => {
          const data: Partial<RegistrationData> = {
            teamName: fieldsToOmit.includes('teamName') ? '' : 'Valid Team',
            schoolName: fieldsToOmit.includes('schoolName') ? '' : 'Valid School',
            officialName: fieldsToOmit.includes('officialName') ? '' : 'Valid Official',
            contactNumber: fieldsToOmit.includes('contactNumber') ? '' : '+6281234567890',
            players: fieldsToOmit.includes('players') ? [] : [
              {
                name: 'Player 1',
                jerseyNumber: 10,
                studentCard: new File([''], 'card.jpg', { type: 'image/jpeg' }),
              },
            ],
          };
          
          const result = validateRegistrationForm(data);
          
          // Deduplicate fieldsToOmit since the generator may produce duplicates
          const uniqueFieldsToOmit = [...new Set(fieldsToOmit)];
          
          // Should be invalid if any fields are omitted
          if (uniqueFieldsToOmit.length > 0) {
            return !result.isValid && result.missingFields.length >= uniqueFieldsToOmit.length;
          }
          
          return result.isValid;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: valid phone numbers should pass validation', () => {
    fc.assert(
      fc.property(
        validPhoneArbitrary,
        (phone) => {
          const data: Partial<RegistrationData> = {
            teamName: 'Valid Team',
            schoolName: 'Valid School',
            officialName: 'Valid Official',
            contactNumber: phone,
            players: [
              {
                name: 'Player 1',
                jerseyNumber: 10,
                studentCard: new File([''], 'card.jpg', { type: 'image/jpeg' }),
              },
            ],
          };
          
          const result = validateRegistrationForm(data);
          
          return result.isValid && !result.missingFields.includes('contactNumber');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: teamLogo is optional and should not affect validation', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        validPhoneArbitrary,
        fc.array(validPlayerArbitrary, { minLength: 1, maxLength: 5 }),
        fc.boolean(),
        (teamName, schoolName, officialName, contactNumber, players, includeLogo) => {
          const data: RegistrationData = {
            teamName,
            schoolName,
            officialName,
            contactNumber,
            players,
            teamLogo: includeLogo ? new File([''], 'logo.jpg', { type: 'image/jpeg' }) : undefined,
          };
          
          const result = validateRegistrationForm(data);
          
          // Should be valid regardless of whether logo is present
          return result.isValid;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: validation should handle edge case phone numbers correctly', () => {
    const edgeCasePhones = [
      '+62812345678', // Minimum valid length with +
      '1234567890', // Minimum valid length without +
      '+621234567890123', // Maximum valid length with +
      '123456789012345', // Maximum valid length without +
    ];
    
    for (const phone of edgeCasePhones) {
      const data: RegistrationData = {
        teamName: 'Test Team',
        schoolName: 'Test School',
        officialName: 'Test Official',
        contactNumber: phone,
        players: [
          {
            name: 'Player 1',
            jerseyNumber: 10,
            studentCard: new File([''], 'card.jpg', { type: 'image/jpeg' }),
          },
        ],
      };
      
      const result = validateRegistrationForm(data);
      
      assert.strictEqual(
        result.isValid,
        true,
        `Phone number "${phone}" should be valid`
      );
    }
  });

  test('property: validation should reject edge case invalid phone numbers', () => {
    const invalidPhones = [
      '123456789', // Too short (9 digits)
      '1234567890123456', // Too long (16 digits)
      'abcdefghij', // Letters
      '+62abc123', // Mixed letters and numbers
      '', // Empty
      '   ', // Whitespace only
    ];
    
    for (const phone of invalidPhones) {
      const data: Partial<RegistrationData> = {
        teamName: 'Test Team',
        schoolName: 'Test School',
        officialName: 'Test Official',
        contactNumber: phone,
        players: [
          {
            name: 'Player 1',
            jerseyNumber: 10,
            studentCard: new File([''], 'card.jpg', { type: 'image/jpeg' }),
          },
        ],
      };
      
      const result = validateRegistrationForm(data);
      
      assert.strictEqual(
        result.isValid,
        false,
        `Phone number "${phone}" should be invalid`
      );
      assert.ok(
        result.missingFields.includes('contactNumber'),
        `Phone number "${phone}" should be identified as missing/invalid`
      );
    }
  });
});
