import { Match } from './types';

/**
 * Mock knockout stage data structure
 * Initially empty - matches will be populated as tournament progresses
 * 
 * Knockout structure:
 * - Round of 16: 16 teams → 8 matches → 8 winners
 * - Quarter Finals: 8 teams → 4 matches → 4 winners
 * - Semi Finals: 4 teams → 2 matches → 2 winners + 2 losers
 * - Final: 2 teams → 1 match → 1 champion
 * - Third Place: 2 semi-final losers → 1 match → 3rd place
 * 
 * Requirements: 11.1 - Display bracket with Round of 16, Quarter Finals, Semi Finals, and Final
 */

/**
 * Round of 16 matches (8 matches)
 * Teams qualified from group stage (top 2 from each group)
 */
export const mockRound16Matches: Match[] = [
  {
    id: 'match-r16-1',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-2',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-3',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-4',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-5',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-6',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-7',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-r16-8',
    stage: 'round16',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
];

/**
 * Quarter Final matches (4 matches)
 * Winners from Round of 16
 */
export const mockQuarterMatches: Match[] = [
  {
    id: 'match-qf-1',
    stage: 'quarter',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-qf-2',
    stage: 'quarter',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-qf-3',
    stage: 'quarter',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-qf-4',
    stage: 'quarter',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
];

/**
 * Semi Final matches (2 matches)
 * Winners from Quarter Finals
 */
export const mockSemiMatches: Match[] = [
  {
    id: 'match-sf-1',
    stage: 'semi',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
  {
    id: 'match-sf-2',
    stage: 'semi',
    team1Id: '',
    team2Id: '',
    team1Score: undefined,
    team2Score: undefined,
    status: 'pending',
    events: [],
  },
];

/**
 * Final match (1 match)
 * Winners from Semi Finals
 */
export const mockFinalMatch: Match = {
  id: 'match-final',
  stage: 'final',
  team1Id: '',
  team2Id: '',
  team1Score: undefined,
  team2Score: undefined,
  status: 'pending',
  events: [],
};

/**
 * Third Place match (1 match)
 * Losers from Semi Finals
 */
export const mockThirdPlaceMatch: Match = {
  id: 'match-third',
  stage: 'third',
  team1Id: '',
  team2Id: '',
  team1Score: undefined,
  team2Score: undefined,
  status: 'pending',
  events: [],
};

/**
 * All knockout matches combined
 * Total: 16 matches (8 R16 + 4 QF + 2 SF + 1 Final + 1 Third Place)
 */
export const mockKnockoutMatches: Match[] = [
  ...mockRound16Matches,
  ...mockQuarterMatches,
  ...mockSemiMatches,
  mockFinalMatch,
  mockThirdPlaceMatch,
];
