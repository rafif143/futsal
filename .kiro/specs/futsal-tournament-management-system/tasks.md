# Implementation Plan: Futsal Tournament Management System

## Overview

This implementation plan breaks down the Futsal Tournament Management System into incremental, testable steps. The system will be built using Next.js (App Router), TailwindCSS, and shadcn/ui. Each task builds on previous work, starting with foundational components and data structures, then progressing through features, and ending with integration and testing.

## Tasks

- [x] 1. Project setup and configuration
  - Install and configure shadcn/ui components (Button, Card, Table, Dialog, Tabs, Badge, Input, Select)
  - Configure Poppins font in global CSS and Tailwind config
  - Set up color theme variables in Tailwind config (#1F7A63 primary, #16624F primary-hover, etc.)
  - Install lucide-react for icons
  - Install fast-check for property-based testing
  - Create base TypeScript types file (data/types.ts)
  - _Requirements: 16.1, 16.2, 16.4_

- [ ] 2. Create mock data layer
  - [x] 2.1 Create mock teams data (32 teams with Indonesian school names)
    - Generate 32 unique teams with id, name, schoolName, logo, officialName, contactNumber
    - Ensure all team IDs and names are unique
    - _Requirements: 17.1_
  
  - [x] 2.2 Write property test for mock team uniqueness
    - **Property 23: Mock Team Uniqueness**
    - **Validates: Requirements 17.1**
  
  - [x] 2.3 Create mock players data (320 players, 10 per team)
    - Generate 10 players for each team with id, name, jerseyNumber, teamId
    - Initialize goals, yellowCards, redCards to 0
    - Ensure jersey numbers are unique within each team
    - _Requirements: 17.2_
  
  - [x] 2.4 Write property test for mock player distribution
    - **Property 24: Mock Player Distribution**
    - **Validates: Requirements 17.2**
  
  - [x] 2.5 Write property test for mock data referential integrity
    - **Property 25: Mock Data Referential Integrity**
    - **Validates: Requirements 17.5**
  
  - [x] 2.6 Create initial mock groups structure (8 empty groups A-H)
    - _Requirements: 6.1_
  
  - [x] 2.7 Create mock matches and knockout data structures
    - _Requirements: 7.1, 11.1_

- [ ] 3. Build core layout components
  - [x] 3.1 Create Sidebar component with navigation menu
    - Implement menu items: Dashboard, Registration Management, Teams, Players, Drawing Table, Matches, Standings, Knockout Stage, Public View, Reports
    - Use lucide-react icons for each menu item
    - Implement active state highlighting
    - Make collapsible for mobile (drawer)
    - _Requirements: 14.1, 14.5_
  
  - [x] 3.2 Write property test for active menu highlighting
    - **Property 22: Active Menu Highlighting**
    - **Validates: Requirements 14.5**
  
  - [x] 3.3 Create Header component
    - Display page title, breadcrumb, and admin avatar placeholder
    - _Requirements: 14.2_
  
  - [x] 3.4 Create DashboardLayout wrapper component
    - Combine Sidebar and Header with main content area
    - Implement responsive layout
    - _Requirements: 14.1, 14.2_
  
  - [x] 3.5 Write property test for navigation routing
    - **Property 21: Navigation Routing**
    - **Validates: Requirements 14.4**

- [ ] 4. Implement dashboard page
  - [x] 4.1 Create StatCard component
    - Display title, value, icon, and color
    - Use card-based layout with consistent styling
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 4.2 Create dashboard page with statistics
    - Calculate and display: total teams, total players, total matches, matches played
    - Use responsive grid layout (2x2 on desktop, 1 column on mobile)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 4.3 Write property test for dashboard statistics accuracy
    - **Property 1: Dashboard Statistics Accuracy**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Build registration system
  - [x] 6.1 Create PlayerInput component for dynamic player rows
    - Fields: player name, jersey number, student card upload
    - Add/remove row functionality
    - _Requirements: 2.2_
  
  - [x] 6.2 Write property test for dynamic player row addition
    - **Property 2: Dynamic Player Row Addition**
    - **Validates: Requirements 2.2**
  
  - [x] 6.3 Create PaymentModal component
    - Display bank account info and payment instructions
    - _Requirements: 2.3_
  
  - [x] 6.4 Create RegistrationForm component
    - Fields: team name, school name, team logo upload, official name, contact number
    - Integrate PlayerInput for dynamic player list
    - Implement form validation for required fields
    - Add WhatsApp contact button with pre-filled message
    - Add payment instructions button
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 6.5 Write property test for WhatsApp URL generation
    - **Property 3: WhatsApp URL Generation**
    - **Validates: Requirements 2.4**
  
  - [x] 6.6 Write property test for registration form validation
    - **Property 4: Registration Form Validation**
    - **Validates: Requirements 2.5**
  
  - [x] 6.7 Create registration page (public)
    - Integrate RegistrationForm component
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 7. Build registration management (admin)
  - [x] 7.1 Create registration management page
    - Display table with columns: team logo, team name, school, official name, contact, payment status, actions
    - Implement view, approve, reject actions
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 7.2 Write property test for registration status updates
    - **Property 5: Registration Status Updates**
    - **Validates: Requirements 3.3, 3.4**

- [ ] 8. Implement teams and players management
  - [x] 8.1 Create TeamCard component
    - Display team logo, name, school, player count
    - Reusable for multiple contexts
    - _Requirements: 4.1, 4.2, 18.1_
  
  - [x] 8.2 Create teams page
    - Display table with teams data
    - Calculate player count for each team
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 8.3 Write property test for team player count calculation
    - **Property 6: Team Player Count Calculation**
    - **Validates: Requirements 4.3**
  
  - [x] 8.4 Create players page
    - Display table with columns: player name, jersey number, team, goals, yellow cards, red cards
    - Implement team filtering
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 8.5 Write property test for player statistics computation
    - **Property 7: Player Statistics Computation**
    - **Validates: Requirements 5.2, 5.4**
  
  - [x] 8.6 Write property test for player filtering by team
    - **Property 8: Player Filtering by Team**
    - **Validates: Requirements 5.3**

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Build group drawing system
  - [x] 10.1 Create GroupCard component
    - Display group letter (A-H) and 4 team slots
    - Show team logo and name when assigned
    - _Requirements: 6.1_
  
  - [x] 10.2 Create DrawingBoard component
    - Display 8 GroupCard components in grid layout
    - Implement randomize groups button
    - Implement generate matches button
    - Implement confirm drawing button
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 10.3 Implement group randomization algorithm
    - Randomly distribute 32 teams into 8 groups (4 teams each)
    - Ensure each team appears in exactly one group
    - _Requirements: 6.2, 6.5_
  
  - [x] 10.4 Write property test for group randomization distribution
    - **Property 9: Group Randomization Distribution**
    - **Validates: Requirements 6.2, 6.5**
  
  - [x] 10.5 Implement round-robin match generation
    - Generate 6 matches per group (each team plays every other team once)
    - Assign unique IDs to each match
    - _Requirements: 6.3, 7.1, 7.2, 7.3_
  
  - [x] 10.6 Write property test for round-robin match generation
    - **Property 10: Round-Robin Match Generation**
    - **Validates: Requirements 6.3, 7.1, 7.2**
  
  - [x] 10.7 Write property test for match ID uniqueness
    - **Property 11: Match ID Uniqueness**
    - **Validates: Requirements 7.3**
  
  - [x] 10.8 Create drawing table page
    - Integrate DrawingBoard component
    - Display generated match list after drawing
    - Add PDF preview button (UI only)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.4, 7.5_

- [ ] 11. Implement match management
  - [x] 11.1 Create MatchCard component
    - Display match name, teams, score, status
    - Reusable for different contexts
    - _Requirements: 8.2, 18.2_
  
  - [x] 11.2 Create matches page with tabs
    - Tabs: Group Matches, Knockout Matches
    - Display table with columns: match name, stage, teams, score, status, actions
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 11.3 Write property test for match status determination
    - **Property 12: Match Status Determination**
    - **Validates: Requirements 8.4, 8.5**
  
  - [x] 11.4 Create EventTimeline component
    - Display match events in chronological order
    - Show player name, minute, and event type with icons
    - _Requirements: 9.3_
  
  - [x] 11.5 Write property test for event timeline chronological order
    - **Property 13: Event Timeline Chronological Order**
    - **Validates: Requirements 9.3**
  
  - [x] 11.6 Create MatchInput component
    - Display two team cards with score inputs
    - Add event form: player select, minute input, event type select
    - Integrate EventTimeline component
    - Auto-increment score when goal event added
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 11.7 Write property test for goal event score update
    - **Property 14: Goal Event Score Update**
    - **Validates: Requirements 9.4**
  
  - [x] 11.8 Implement match result saving logic
    - Update player statistics (goals, cards) from events
    - Trigger standings recalculation
    - _Requirements: 9.5_
  
  - [x] 11.9 Write property test for match result propagation
    - **Property 15: Match Result Propagation**
    - **Validates: Requirements 9.5**
  
  - [x] 11.10 Create match input page
    - Integrate MatchInput component
    - Make responsive for mobile
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 15.1_

- [x] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Build standings system
  - [x] 13.1 Create StandingsTable component
    - Columns: team, played, win, draw, loss, goals for, goals against, goal difference, points, yellow cards, red cards
    - Implement sorting by points, goal difference, goals for
    - Reusable for different groups
    - _Requirements: 10.2, 10.3, 10.4, 18.3_
  
  - [x] 13.2 Implement standings calculation logic
    - Calculate: played, won, drawn, lost, goals for/against, goal difference
    - Calculate points: (wins × 3) + (draws × 1)
    - Sort by points desc, goal difference desc, goals for desc
    - _Requirements: 10.3, 10.4_
  
  - [x] 13.3 Write property test for points calculation formula
    - **Property 16: Points Calculation Formula**
    - **Validates: Requirements 10.3**
  
  - [x] 13.4 Write property test for standings sorting order
    - **Property 17: Standings Sorting Order**
    - **Validates: Requirements 10.4**
  
  - [x] 13.5 Create standings page
    - Display StandingsTable for all 8 groups
    - Make responsive with horizontal scrolling on mobile
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 15.3_

- [ ] 14. Implement knockout stage
  - [x] 14.1 Create KnockoutBracket component
    - Display bracket structure: Round of 16, Quarter Finals, Semi Finals, Final, 3rd Place
    - Show match results and winners
    - Reusable and responsive
    - _Requirements: 11.1, 18.4_
  
  - [x] 14.2 Implement knockout match progression logic
    - Advance winner to next round when match completed
    - Identify semi-final losers for 3rd place match
    - _Requirements: 11.3, 11.4_
  
  - [x] 14.3 Write property test for knockout winner advancement
    - **Property 18: Knockout Winner Advancement**
    - **Validates: Requirements 11.3**
  
  - [x] 14.4 Write property test for third place match participants
    - **Property 19: Third Place Match Participants**
    - **Validates: Requirements 11.4**
  
  - [x] 14.5 Create knockout stage page
    - Integrate KnockoutBracket component
    - Allow admin to select teams for Round of 16
    - Display complete bracket with results
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 15. Build public view
  - [x] 15.1 Create public view page
    - Tabs: Group Standings, Knockout Bracket, Match Results
    - Display all information in read-only mode
    - Use clean, spectator-friendly layout
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 16. Implement reports generation
  - [x] 16.1 Create reports page
    - Buttons: Generate Match Schedule PDF, Generate Knockout Bracket PDF, Generate Standings PDF
    - _Requirements: 13.1_
  
  - [x] 16.2 Create printable preview layouts for each report type
    - Match schedule: organized by group with all matches
    - Knockout bracket: visual bracket with results
    - Standings: all 8 group tables
    - _Requirements: 13.2, 13.4_
  
  - [x] 16.3 Write property test for report data completeness
    - **Property 20: Report Data Completeness**
    - **Validates: Requirements 13.4**

- [ ] 17. Final integration and polish
  - [x] 17.1 Implement root page redirect to dashboard
    - _Requirements: 14.1_
  
  - [x] 17.2 Add loading states and error handling
    - Empty states for no data scenarios
    - Loading spinners for calculations
    - User-friendly error messages
    - _Requirements: Error Handling section_
  
  - [x] 17.3 Verify responsive design across all pages
    - Test mobile layouts for key pages
    - Ensure sidebar drawer works on mobile
    - Verify table scrolling on mobile
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 17.4 Apply consistent styling and theming
    - Verify color theme usage throughout
    - Check font consistency
    - Ensure card layouts have consistent padding/spacing
    - _Requirements: 16.1, 16.2, 16.3, 16.5_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The system is frontend-only with no backend implementation
- All data is mocked and managed in client-side state
