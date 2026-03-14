# Design Document: Futsal Tournament Management System

## Overview

The Futsal Tournament Management System is a frontend-only prototype built with Next.js (App Router), TailwindCSS, and shadcn/ui. The system provides a comprehensive tournament management interface for administrators and a public view for spectators. It handles the complete tournament lifecycle from team registration through group stage drawing, match management, standings calculation, and knockout stage visualization.

The system is designed as a professional sports tournament dashboard with a focus on clean UI architecture, component reusability, and responsive design. All data is mocked and stored in client-side state using React useState, with no backend or database implementation.

### Key Design Principles

1. **Component-Based Architecture**: Reusable UI components for consistent design and maintainable code
2. **Mock Data Separation**: Clear separation between UI logic and data layer for easy testing and modification
3. **Responsive-First**: Mobile-friendly design with collapsible navigation and adaptive layouts
4. **Type Safety**: TypeScript types for all data structures and component props
5. **Professional Aesthetics**: Card-based layouts, consistent spacing, and sports-themed color palette

## Architecture

### Application Structure

The application follows Next.js App Router conventions with a clear separation of concerns:

```
app/
├── layout.tsx                 # Root layout with global styles
├── dashboard/page.tsx         # Dashboard overview
├── registration/page.tsx      # Public registration form
├── public-view/page.tsx       # Public spectator view
├── admin/
│   ├── registrations/page.tsx # Registration management
│   ├── teams/page.tsx         # Teams management
│   ├── players/page.tsx       # Players management
│   ├── drawing/page.tsx       # Group drawing
│   ├── matches/page.tsx       # Match management
│   ├── standings/page.tsx     # Standings view
│   ├── knockout/page.tsx      # Knockout stage
│   └── reports/page.tsx       # Reports generation

components/
├── ui/                        # shadcn/ui components
├── layout/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Header.tsx            # Top header
│   └── DashboardLayout.tsx   # Main layout wrapper
├── features/
│   ├── dashboard/
│   │   └── StatCard.tsx      # Statistics card
│   ├── registration/
│   │   ├── RegistrationForm.tsx
│   │   ├── PlayerInput.tsx
│   │   └── PaymentModal.tsx
│   ├── teams/
│   │   └── TeamCard.tsx
│   ├── matches/
│   │   ├── MatchCard.tsx
│   │   ├── MatchInput.tsx
│   │   └── EventTimeline.tsx
│   ├── standings/
│   │   └── StandingsTable.tsx
│   ├── knockout/
│   │   └── KnockoutBracket.tsx
│   └── drawing/
│       ├── DrawingBoard.tsx
│       └── GroupCard.tsx

data/
├── mock-teams.ts             # 32 mock teams
├── mock-players.ts           # 320 mock players (10 per team)
├── mock-groups.ts            # Group assignments
├── mock-matches.ts           # Match data
└── types.ts                  # TypeScript type definitions
```

### State Management Strategy

The application uses React useState for local component state. No global state management library is needed for this prototype. State is managed at the page level and passed down to components via props.

Key state patterns:
- **Dashboard**: Aggregated statistics computed from mock data
- **Registration**: Form state with validation
- **Drawing**: Group assignments and match generation
- **Matches**: Match results and events
- **Standings**: Computed from match results

### Routing Strategy

Next.js App Router provides file-based routing:
- `/` - Redirects to `/dashboard`
- `/dashboard` - Admin dashboard
- `/registration` - Public registration form
- `/public-view` - Public spectator view
- `/admin/*` - Protected admin pages (no auth in prototype, just routing)

## Components and Interfaces

### Core Layout Components

#### DashboardLayout
Wrapper component providing sidebar and header layout.

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string[];
}
```

#### Sidebar
Navigation menu with collapsible mobile drawer.

```typescript
interface SidebarProps {
  activeItem: string;
  onNavigate: (path: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}
```

#### Header
Top header with page title and breadcrumb.

```typescript
interface HeaderProps {
  title: string;
  breadcrumb?: string[];
}
```

### Feature Components

#### StatCard
Dashboard statistics display.

```typescript
interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
}
```

#### TeamCard
Reusable team information display.

```typescript
interface TeamCardProps {
  team: Team;
  showPlayers?: boolean;
  actions?: React.ReactNode;
}
```

#### MatchCard
Match information display.

```typescript
interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  showScore?: boolean;
}
```

#### StandingsTable
Group standings with sorting.

```typescript
interface StandingsTableProps {
  group: string;
  teams: TeamStanding[];
  sortBy?: 'points' | 'goalDifference' | 'goalsFor';
}

interface TeamStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  yellowCards: number;
  redCards: number;
}
```

#### KnockoutBracket
Elimination stage visualization.

```typescript
interface KnockoutBracketProps {
  matches: KnockoutMatch[];
  onMatchClick?: (matchId: string) => void;
}

interface KnockoutMatch {
  id: string;
  round: 'round16' | 'quarter' | 'semi' | 'final' | 'third';
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  winner?: Team;
}
```

#### RegistrationForm
Public team registration.

```typescript
interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
}

interface RegistrationData {
  teamName: string;
  schoolName: string;
  teamLogo?: File;
  officialName: string;
  contactNumber: string;
  players: PlayerInput[];
}

interface PlayerInput {
  name: string;
  jerseyNumber: number;
  studentCard?: File;
}
```

#### MatchInput
Match score and event entry.

```typescript
interface MatchInputProps {
  match: Match;
  onSave: (result: MatchResult) => void;
}

interface MatchResult {
  matchId: string;
  team1Score: number;
  team2Score: number;
  events: MatchEvent[];
}

interface MatchEvent {
  id: string;
  playerId: string;
  minute: number;
  type: 'goal' | 'yellowCard' | 'redCard';
  teamId: string;
}
```

#### DrawingBoard
Group randomization interface.

```typescript
interface DrawingBoardProps {
  teams: Team[];
  onRandomize: () => void;
  onGenerateMatches: () => void;
  onConfirm: () => void;
}

interface GroupAssignment {
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  teams: Team[];
}
```

## Data Models

### Core Types

```typescript
interface Team {
  id: string;
  name: string;
  schoolName: string;
  logo: string;
  officialName: string;
  contactNumber: string;
  group?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
}

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  teamId: string;
  studentCard?: string;
  goals: number;
  yellowCards: number;
  redCards: number;
}

interface Match {
  id: string;
  stage: 'group' | 'round16' | 'quarter' | 'semi' | 'final' | 'third';
  group?: string;
  team1Id: string;
  team2Id: string;
  team1Score?: number;
  team2Score?: number;
  status: 'pending' | 'completed';
  events: MatchEvent[];
  date?: string;
}

interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  teamId: string;
  minute: number;
  type: 'goal' | 'yellowCard' | 'redCard';
}

interface Registration {
  id: string;
  teamName: string;
  schoolName: string;
  teamLogo?: string;
  officialName: string;
  contactNumber: string;
  players: PlayerInput[];
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
```

### Mock Data Structure

Mock data files provide realistic tournament data:

**mock-teams.ts**: 32 teams with Indonesian school names
```typescript
export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'SMPN 1 Surabaya',
    schoolName: 'SMP Negeri 1 Surabaya',
    logo: '/logos/team1.png',
    officialName: 'Ahmad Rizki',
    contactNumber: '+62812345678'
  },
  // ... 31 more teams
];
```

**mock-players.ts**: 320 players (10 per team)
```typescript
export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'Budi Santoso',
    jerseyNumber: 10,
    teamId: 'team-1',
    goals: 0,
    yellowCards: 0,
    redCards: 0
  },
  // ... 319 more players
];
```

**mock-groups.ts**: Initial group assignments (empty until drawing)
```typescript
export const mockGroups: GroupAssignment[] = [
  { group: 'A', teams: [] },
  { group: 'B', teams: [] },
  // ... groups C-H
];
```

### Data Relationships

- Each Player belongs to exactly one Team (via teamId)
- Each Team can be assigned to one Group (via group field)
- Each Match involves two Teams (via team1Id and team2Id)
- Each MatchEvent belongs to one Match and one Player
- Player statistics (goals, cards) are computed from MatchEvents

### Computed Data

Several data points are computed rather than stored:

**Team Statistics**:
- Player count: Count of players with matching teamId
- Total goals: Sum of goals from all team players
- Total cards: Sum of cards from all team players

**Standings**:
- Played: Count of completed matches for team
- Won/Drawn/Lost: Computed from match results
- Goals For/Against: Sum from match scores
- Goal Difference: Goals For - Goals Against
- Points: (Won × 3) + (Drawn × 1)

**Player Statistics**:
- Goals: Count of 'goal' events for player
- Yellow Cards: Count of 'yellowCard' events for player
- Red Cards: Count of 'redCard' events for player

### Match Generation Algorithm

Group stage matches follow round-robin format:

For each group with teams [T1, T2, T3, T4]:
1. T1 vs T2
2. T3 vs T4
3. T1 vs T3
4. T2 vs T4
5. T1 vs T4
6. T2 vs T3

This ensures each team plays every other team exactly once (6 matches per group, 48 total group matches).

Knockout stage matches are manually created by admin selecting qualified teams.


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Dashboard Statistics Accuracy

*For any* set of mock data, the dashboard statistics (total teams, total players, total matches, matches played) should equal the actual counts computed from the data.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Dynamic Player Row Addition

*For any* registration form state, adding a player row should increase the player list length by exactly one and preserve all existing player data.

**Validates: Requirements 2.2**

### Property 3: WhatsApp URL Generation

*For any* admin contact number and team name, the generated WhatsApp URL should contain the correct phone number and properly encoded message template.

**Validates: Requirements 2.4**

### Property 4: Registration Form Validation

*For any* registration form submission with missing required fields, the validation should reject the submission and identify all missing fields.

**Validates: Requirements 2.5**

### Property 5: Registration Status Updates

*For any* registration, approving or rejecting it should update the status to the corresponding value ('approved' or 'rejected').

**Validates: Requirements 3.3, 3.4**

### Property 6: Team Player Count Calculation

*For any* team, the displayed player count should equal the number of players with matching teamId in the player data.

**Validates: Requirements 4.3**

### Property 7: Player Statistics Computation

*For any* player, the displayed statistics (goals, yellow cards, red cards) should equal the count of corresponding event types in match events.

**Validates: Requirements 5.2, 5.4**

### Property 8: Player Filtering by Team

*For any* team selection in the player filter, all displayed players should have teamId matching the selected team.

**Validates: Requirements 5.3**

### Property 9: Group Randomization Distribution

*For any* randomization of 32 teams into 8 groups, each group should contain exactly 4 teams and each team should appear in exactly one group.

**Validates: Requirements 6.2, 6.5**

### Property 10: Round-Robin Match Generation

*For any* group with 4 teams, the generated matches should total exactly 6 matches, and each team should play every other team exactly once.

**Validates: Requirements 6.3, 7.1, 7.2**

### Property 11: Match ID Uniqueness

*For any* set of generated matches, all match IDs should be unique with no duplicates.

**Validates: Requirements 7.3**

### Property 12: Match Status Determination

*For any* match, if both team scores are defined (not null/undefined), the status should be 'completed', otherwise 'pending'.

**Validates: Requirements 8.4, 8.5**

### Property 13: Event Timeline Chronological Order

*For any* list of match events, when displayed in the timeline, they should be sorted in ascending order by minute.

**Validates: Requirements 9.3**

### Property 14: Goal Event Score Update

*For any* match, when a goal event is added for a team, that team's score should increment by exactly one.

**Validates: Requirements 9.4**

### Property 15: Match Result Propagation

*For any* completed match, saving the results should update all related player statistics (goals, cards) and recalculate team standings.

**Validates: Requirements 9.5**

### Property 16: Points Calculation Formula

*For any* team's match results, the total points should equal (wins × 3) + (draws × 1) + (losses × 0).

**Validates: Requirements 10.3**

### Property 17: Standings Sorting Order

*For any* group standings, teams should be sorted first by points (descending), then by goal difference (descending), then by goals for (descending).

**Validates: Requirements 10.4**

### Property 18: Knockout Winner Advancement

*For any* completed knockout match (except final and 3rd place), the team with the higher score should be advanced to the corresponding match in the next round.

**Validates: Requirements 11.3**

### Property 19: Third Place Match Participants

*For any* completed semi-final matches, the two losing teams should be identified as participants for the 3rd place match.

**Validates: Requirements 11.4**

### Property 20: Report Data Completeness

*For any* generated report type (match schedule, knockout bracket, standings), the report should include all required data fields for that report type.

**Validates: Requirements 13.4**

### Property 21: Navigation Routing

*For any* menu item click, the system should navigate to the path associated with that menu item.

**Validates: Requirements 14.4**

### Property 22: Active Menu Highlighting

*For any* current page route, the sidebar menu item with matching path should be highlighted as active.

**Validates: Requirements 14.5**

### Property 23: Mock Team Uniqueness

*For any* mock team data, all team IDs and team names should be unique with no duplicates.

**Validates: Requirements 17.1**

### Property 24: Mock Player Distribution

*For any* team in the mock data, there should be exactly 10 players with teamId matching that team's ID.

**Validates: Requirements 17.2**

### Property 25: Mock Data Referential Integrity

*For any* player in the mock data, the player's teamId should match an existing team ID in the mock team data.

**Validates: Requirements 17.5**

## Error Handling

### Form Validation Errors

**Registration Form**:
- Empty required fields: Display inline error messages below each field
- Invalid phone number format: Show format hint (e.g., "+62812345678")
- Duplicate jersey numbers: Highlight conflicting player rows
- Missing player data: Prevent submission and highlight incomplete rows

**Match Input Form**:
- Invalid score values: Only accept non-negative integers
- Event minute out of range: Validate minute is between 1-90
- Missing event data: Require all fields (player, minute, type) before adding

### Data Consistency Errors

**Group Drawing**:
- Insufficient teams: Disable randomize button if fewer than 32 teams
- Already drawn: Show confirmation dialog before re-randomizing
- Incomplete drawing: Prevent match generation until all groups filled

**Match Management**:
- Invalid match state: Prevent editing completed matches without confirmation
- Missing teams: Show error if match references non-existent teams
- Duplicate events: Warn when adding event with same player/minute/type

### UI Error States

**Empty States**:
- No teams registered: Show empty state with "Register Team" call-to-action
- No matches generated: Show instructions for group drawing
- No events recorded: Show placeholder in event timeline

**Loading States**:
- Data computation: Show loading spinner for standings calculation
- Form submission: Disable submit button and show loading state

**Error Messages**:
- User-friendly language: Avoid technical jargon
- Actionable guidance: Tell users how to fix the error
- Consistent styling: Use alert components from shadcn/ui

## Testing Strategy

### Dual Testing Approach

The system requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Specific form validation scenarios
- UI component rendering with known props
- Navigation and routing behavior
- Mock data structure validation

**Property Tests**: Verify universal properties across all inputs
- Statistical calculations with random data
- Sorting and filtering algorithms
- Match generation logic
- Data integrity constraints

Together, unit tests catch concrete bugs while property tests verify general correctness across the input space.

### Property-Based Testing Configuration

**Library Selection**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Test Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: futsal-tournament-management-system, Property {number}: {property_text}`

**Example Property Test Structure**:
```typescript
import fc from 'fast-check';

// Feature: futsal-tournament-management-system, Property 6: Team Player Count Calculation
test('team player count equals number of players with matching teamId', () => {
  fc.assert(
    fc.property(
      fc.array(playerArbitrary, { minLength: 0, maxLength: 50 }),
      fc.string(),
      (players, teamId) => {
        const expectedCount = players.filter(p => p.teamId === teamId).length;
        const actualCount = calculatePlayerCount(teamId, players);
        expect(actualCount).toBe(expectedCount);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Component Testing**:
- Use React Testing Library for component tests
- Test component rendering with various props
- Test user interactions (clicks, form inputs)
- Test conditional rendering logic

**Utility Function Testing**:
- Test calculation functions (points, goal difference)
- Test sorting and filtering functions
- Test data transformation functions
- Test validation functions

**Integration Testing**:
- Test page-level interactions
- Test data flow between components
- Test form submission workflows
- Test navigation flows

### Test Organization

```
__tests__/
├── components/
│   ├── StatCard.test.tsx
│   ├── TeamCard.test.tsx
│   ├── MatchCard.test.tsx
│   ├── StandingsTable.test.tsx
│   └── KnockoutBracket.test.tsx
├── utils/
│   ├── calculations.test.ts
│   ├── sorting.test.ts
│   └── validation.test.ts
├── properties/
│   ├── statistics.property.test.ts
│   ├── match-generation.property.test.ts
│   ├── standings.property.test.ts
│   └── data-integrity.property.test.ts
└── integration/
    ├── registration-flow.test.tsx
    ├── match-input-flow.test.tsx
    └── drawing-flow.test.tsx
```

### Coverage Goals

- **Unit Tests**: Focus on specific examples and edge cases
  - Form validation with various invalid inputs
  - Component rendering with edge case props
  - Error handling scenarios
  
- **Property Tests**: Focus on universal correctness
  - Statistical calculations with random data
  - Sorting algorithms with random orderings
  - Match generation with random team assignments
  - Data integrity across random operations

### Testing Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Clarity**: Test names should clearly describe what is being tested
3. **Completeness**: Cover both happy paths and error cases
4. **Maintainability**: Use test helpers and factories for common setup
5. **Performance**: Property tests should complete in reasonable time (<5s per test)

### Mock Data for Testing

Create test-specific mock data generators:
- `generateMockTeam()`: Create random team with valid structure
- `generateMockPlayer()`: Create random player with valid structure
- `generateMockMatch()`: Create random match with valid structure
- `generateMockEvent()`: Create random match event with valid structure

These generators ensure tests work with realistic data while maintaining randomness for property tests.
