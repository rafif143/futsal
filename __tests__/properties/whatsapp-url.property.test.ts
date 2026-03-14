/**
 * Property-Based Tests for WhatsApp URL Generation
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';

/**
 * Generate WhatsApp URL with pre-filled message template
 * This mirrors the implementation in RegistrationForm component
 */
function generateWhatsAppUrl(
  adminNumber: string,
  teamName: string,
  schoolName: string,
  officialName: string,
  contactNumber: string,
  playerCount: number
): string {
  const message = `Hello, I would like to register my team for the Futsal Tournament.

Team Name: ${teamName || '[Not filled]'}
School: ${schoolName || '[Not filled]'}
Official Name: ${officialName || '[Not filled]'}
Contact: ${contactNumber || '[Not filled]'}
Number of Players: ${playerCount}

Please let me know the next steps for registration.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${adminNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
  
  return whatsappUrl;
}

/**
 * Extract phone number from WhatsApp URL
 */
function extractPhoneFromUrl(url: string): string | null {
  const match = url.match(/wa\.me\/([0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Check if URL contains properly encoded message
 */
function hasEncodedMessage(url: string): boolean {
  return url.includes('?text=') && url.includes('%');
}

/**
 * Decode message from WhatsApp URL
 */
function decodeMessageFromUrl(url: string): string | null {
  const match = url.match(/\?text=(.+)$/);
  if (!match) return null;
  
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * Arbitrary for generating valid phone numbers
 * Supports formats: +62812345678, 62812345678, 812345678
 */
const phoneNumberArbitrary = fc.oneof(
  // With + prefix
  fc.tuple(
    fc.constantFrom('+62', '+1', '+44', '+86', '+91'),
    fc.integer({ min: 100000000, max: 999999999 })
  ).map(([prefix, num]) => `${prefix}${num}`),
  
  // Without + prefix
  fc.tuple(
    fc.constantFrom('62', '1', '44', '86', '91'),
    fc.integer({ min: 100000000, max: 999999999 })
  ).map(([prefix, num]) => `${prefix}${num}`),
  
  // Local format (without country code)
  fc.integer({ min: 100000000, max: 999999999 }).map(num => `${num}`)
);

/**
 * Arbitrary for generating team names with various characters
 */
const teamNameArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }),
  fc.constantFrom(
    'Team Alpha',
    'SMPN 1 Surabaya',
    'Team & Dragons',
    'Team "Winners"',
    'Team 123',
    'Team-A',
    'Team_B',
    'Team (Elite)',
    'Team [Pro]',
    'Team\'s Best'
  )
);

/**
 * Arbitrary for generating school names
 */
const schoolNameArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 100 }),
  fc.constantFrom(
    'SMP Negeri 1 Jakarta',
    'School & Academy',
    'International School',
    'School 123'
  )
);

/**
 * Arbitrary for generating official names
 */
const officialNameArbitrary = fc.string({ minLength: 1, maxLength: 50 });

/**
 * Arbitrary for generating contact numbers
 */
const contactNumberArbitrary = phoneNumberArbitrary;

/**
 * Arbitrary for generating player counts
 */
const playerCountArbitrary = fc.integer({ min: 0, max: 50 });

/**
 * Property 3: WhatsApp URL Generation
 * 
 * **Validates: Requirements 2.4**
 * 
 * For any admin contact number and team name, the generated WhatsApp URL should contain 
 * the correct phone number and properly encoded message template.
 * 
 * This property verifies that:
 * 1. The URL contains the correct WhatsApp base URL (wa.me)
 * 2. The phone number is correctly extracted and formatted (without + symbol)
 * 3. The message is properly URL-encoded
 * 4. The message can be decoded back to the original content
 * 5. Special characters in team names and other fields are properly handled
 */
describe('Property 3: WhatsApp URL Generation', () => {
  test('property: URL should always contain wa.me domain', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          return url.includes('wa.me/');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: URL should contain phone number without + symbol', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const extractedPhone = extractPhoneFromUrl(url);
          
          // Phone should be extracted successfully
          if (!extractedPhone) return false;
          
          // Extracted phone should not contain + symbol
          if (extractedPhone.includes('+')) return false;
          
          // Extracted phone should match the admin number (without +)
          const normalizedAdminNumber = adminNumber.replace(/\+/g, '');
          return extractedPhone === normalizedAdminNumber;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: URL should contain properly encoded message', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          // URL should have ?text= parameter
          if (!url.includes('?text=')) return false;
          
          // URL should contain encoded characters (%)
          return hasEncodedMessage(url);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: decoded message should contain team name', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary.filter(name => name.trim().length > 0),
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Message should contain the team name or [Not filled] if empty
          const expectedContent = teamName || '[Not filled]';
          return decodedMessage.includes(expectedContent);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: decoded message should contain school name', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary.filter(name => name.trim().length > 0),
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Message should contain the school name or [Not filled] if empty
          const expectedContent = schoolName || '[Not filled]';
          return decodedMessage.includes(expectedContent);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: decoded message should contain player count', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Message should contain the player count
          return decodedMessage.includes(`Number of Players: ${playerCount}`);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: URL should be valid format with https protocol', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          // URL should start with https://
          if (!url.startsWith('https://')) return false;
          
          // URL should have the correct structure
          const urlPattern = /^https:\/\/wa\.me\/[0-9]+\?text=.+$/;
          return urlPattern.test(url);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: special characters in team name should be properly encoded', () => {
    const specialCharTeamNames = fc.constantFrom(
      'Team & Dragons',
      'Team "Winners"',
      'Team (Elite)',
      'Team [Pro]',
      'Team\'s Best',
      'Team + Plus',
      'Team = Equals',
      'Team ? Question',
      'Team # Hash',
      'Team @ At'
    );

    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        specialCharTeamNames,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Decoded message should contain the original team name with special characters
          return decodedMessage.includes(teamName);
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: URL generation should be deterministic', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          // Generate URL twice with same inputs
          const url1 = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const url2 = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          // Both URLs should be identical
          return url1 === url2;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: empty fields should be replaced with [Not filled]', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, playerCount) => {
          // Generate URL with empty fields
          const url = generateWhatsAppUrl(
            adminNumber,
            '', // empty team name
            '', // empty school name
            '', // empty official name
            '', // empty contact number
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Message should contain [Not filled] for empty fields
          const notFilledCount = (decodedMessage.match(/\[Not filled\]/g) || []).length;
          
          // Should have 4 [Not filled] placeholders (team name, school, official name, contact)
          return notFilledCount === 4;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: URL should not contain unencoded spaces', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          // Extract the message part
          const messageMatch = url.match(/\?text=(.+)$/);
          if (!messageMatch) return false;
          
          const encodedMessage = messageMatch[1];
          
          // Encoded message should not contain literal spaces
          return !encodedMessage.includes(' ');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: decoded message should contain greeting and registration intent', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Message should contain greeting and registration intent
          return decodedMessage.includes('Hello') &&
                 decodedMessage.includes('register') &&
                 decodedMessage.includes('Futsal Tournament');
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: phone number with different formats should be normalized', () => {
    const phoneFormats = fc.tuple(
      fc.constantFrom('+62', '62', ''),
      fc.integer({ min: 812345678, max: 899999999 })
    ).map(([prefix, num]) => `${prefix}${num}`);

    fc.assert(
      fc.property(
        phoneFormats,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const extractedPhone = extractPhoneFromUrl(url);
          
          if (!extractedPhone) return false;
          
          // Extracted phone should not have + symbol
          if (extractedPhone.includes('+')) return false;
          
          // Extracted phone should match normalized admin number
          const normalizedAdminNumber = adminNumber.replace(/\+/g, '');
          return extractedPhone === normalizedAdminNumber;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('property: message structure should be consistent', () => {
    fc.assert(
      fc.property(
        phoneNumberArbitrary,
        teamNameArbitrary,
        schoolNameArbitrary,
        officialNameArbitrary,
        contactNumberArbitrary,
        playerCountArbitrary,
        (adminNumber, teamName, schoolName, officialName, contactNumber, playerCount) => {
          const url = generateWhatsAppUrl(
            adminNumber,
            teamName,
            schoolName,
            officialName,
            contactNumber,
            playerCount
          );
          
          const decodedMessage = decodeMessageFromUrl(url);
          
          if (!decodedMessage) return false;
          
          // Message should have consistent structure with all required fields
          const hasTeamNameField = decodedMessage.includes('Team Name:');
          const hasSchoolField = decodedMessage.includes('School:');
          const hasOfficialNameField = decodedMessage.includes('Official Name:');
          const hasContactField = decodedMessage.includes('Contact:');
          const hasPlayerCountField = decodedMessage.includes('Number of Players:');
          const hasClosing = decodedMessage.includes('Please let me know the next steps');
          
          return hasTeamNameField &&
                 hasSchoolField &&
                 hasOfficialNameField &&
                 hasContactField &&
                 hasPlayerCountField &&
                 hasClosing;
        }
      ),
      { numRuns: 25 }
    );
  });
});
