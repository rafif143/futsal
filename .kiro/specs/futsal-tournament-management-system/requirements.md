# Requirements Document

## Introduction

This document specifies the requirements for a Futsal Tournament Management System frontend prototype. The system is a professional sports tournament dashboard built with Next.js, TailwindCSS, and shadcn/ui. It provides functionality for tournament organization including team registration, group drawing, match management, standings tracking, and knockout stage visualization. The system uses mock data only and does not include backend implementation.

## Glossary

- **System**: The Futsal Tournament Management System frontend application
- **Admin**: Tournament administrator who manages registrations, drawings, and matches
- **Public_User**: Spectator or team representative viewing tournament information
- **Team**: A futsal team participating in the tournament
- **Player**: An individual player belonging to a team
- **Group_Stage**: Initial tournament phase with 8 groups of 4 teams each
- **Knockout_Stage**: Elimination phase including Round of 16, Quarter Finals, Semi Finals, and Final
- **Match**: A game between two teams
- **Drawing**: Process of randomly assigning teams to groups
- **Registration**: Team application to participate in the tournament
- **Standings**: Table showing team rankings based on match results
- **Event**: In-match occurrence such as goal, yellow card, or red card

## Requirements

### Requirement 1: Dashboard Overview

**User Story:** As an admin, I want to view tournament statistics at a glance, so that I can monitor the overall tournament status.

#### Acceptance Criteria

1. WHEN the admin accesses the dashboard, THE System SHALL display total teams count
2. WHEN the admin accesses the dashboard, THE System SHALL display total players count
3. WHEN the admin accesses the dashboard, THE System SHALL display total matches count
4. WHEN the admin accesses the dashboard, THE System SHALL display matches played count
5. THE System SHALL display statistics in a responsive grid layout with card components

### Requirement 2: Public Team Registration

**User Story:** As a team representative, I want to register my team for the tournament, so that we can participate in the competition.

#### Acceptance Criteria

1. WHEN a user accesses the registration page, THE System SHALL display a registration form with team name, school name, team logo upload, official name, and contact number fields
2. WHEN a user adds player information, THE System SHALL allow dynamic addition of player rows with player name, jersey number, and student card upload fields
3. WHEN a user clicks the payment instructions button, THE System SHALL display a modal with bank account information and payment steps
4. WHEN a user clicks the WhatsApp contact button, THE System SHALL open WhatsApp with a pre-filled message template
5. WHEN a user submits the registration form, THE System SHALL validate all required fields before submission

### Requirement 3: Registration Management

**User Story:** As an admin, I want to manage team registrations, so that I can approve or reject teams for tournament participation.

#### Acceptance Criteria

1. WHEN the admin accesses registration management, THE System SHALL display a table with team logo, team name, school, official name, contact, payment status, and actions columns
2. WHEN the admin clicks view action, THE System SHALL display detailed registration information
3. WHEN the admin clicks approve action, THE System SHALL mark the registration as approved
4. WHEN the admin clicks reject action, THE System SHALL mark the registration as rejected
5. THE System SHALL update the registration status immediately after admin action

### Requirement 4: Teams Management

**User Story:** As an admin, I want to view and manage all registered teams, so that I can maintain accurate team information.

#### Acceptance Criteria

1. WHEN the admin accesses the teams page, THE System SHALL display a table with logo, team name, school, player count, and actions columns
2. WHEN the admin clicks on a team, THE System SHALL display detailed team information
3. THE System SHALL calculate and display the correct player count for each team
4. THE System SHALL display team logos in the table

### Requirement 5: Players Management

**User Story:** As an admin, I want to view all players across teams, so that I can track player statistics and information.

#### Acceptance Criteria

1. WHEN the admin accesses the players page, THE System SHALL display a table with player name, jersey number, team, goals, yellow cards, and red cards columns
2. THE System SHALL display accurate statistics for each player
3. THE System SHALL allow filtering or searching players by team
4. THE System SHALL update player statistics when match events are recorded

### Requirement 6: Group Drawing

**User Story:** As an admin, I want to randomly assign teams to groups, so that the group stage can begin fairly.

#### Acceptance Criteria

1. WHEN the admin accesses the drawing table page, THE System SHALL display 8 group cards labeled A through H
2. WHEN the admin clicks randomize groups, THE System SHALL randomly distribute 32 teams into 8 groups with 4 teams each
3. WHEN the admin clicks generate matches, THE System SHALL create all group stage matches following round-robin format
4. WHEN the admin clicks confirm drawing, THE System SHALL finalize the group assignments
5. THE System SHALL ensure each team appears in exactly one group after randomization

### Requirement 7: Match Generation

**User Story:** As an admin, I want the system to automatically generate group matches, so that I don't have to manually create each match.

#### Acceptance Criteria

1. WHEN group drawing is confirmed, THE System SHALL generate 6 matches per group in round-robin format
2. FOR each group, THE System SHALL create matches where each team plays every other team exactly once
3. THE System SHALL assign unique identifiers to each generated match
4. THE System SHALL display the generated match list organized by group
5. THE System SHALL allow PDF preview of the match schedule

### Requirement 8: Match Management

**User Story:** As an admin, I want to view and manage all tournament matches, so that I can track match progress and results.

#### Acceptance Criteria

1. WHEN the admin accesses the matches page, THE System SHALL display tabs for group matches and knockout matches
2. WHEN viewing matches, THE System SHALL display match name, stage, teams, score, status, and actions columns
3. WHEN the admin clicks on a match, THE System SHALL navigate to the match input page
4. THE System SHALL distinguish between completed and pending matches
5. THE System SHALL update match status when scores are entered

### Requirement 9: Match Input and Events

**User Story:** As an admin, I want to input match scores and events, so that match results are recorded accurately.

#### Acceptance Criteria

1. WHEN the admin accesses match input page, THE System SHALL display two team cards with score input fields
2. WHEN the admin adds an event, THE System SHALL allow selection of player, minute, and event type (goal, yellow card, red card)
3. WHEN an event is added, THE System SHALL display it in a chronological timeline
4. WHEN a goal event is added, THE System SHALL increment the team score automatically
5. WHEN the admin saves match results, THE System SHALL update player statistics and team standings

### Requirement 10: Standings Calculation

**User Story:** As a user, I want to view group standings, so that I can see team rankings and qualification status.

#### Acceptance Criteria

1. WHEN a user accesses the standings page, THE System SHALL display tables for all 8 groups
2. FOR each team, THE System SHALL display played, win, draw, loss, goals for, goals against, goal difference, points, yellow cards, and red cards
3. THE System SHALL calculate points as: 3 for win, 1 for draw, 0 for loss
4. THE System SHALL sort teams by points, then goal difference, then goals for
5. THE System SHALL update standings immediately when match results are entered

### Requirement 11: Knockout Stage Management

**User Story:** As an admin, I want to manage the knockout stage, so that I can progress the tournament to completion.

#### Acceptance Criteria

1. WHEN the admin accesses knockout stage page, THE System SHALL display a bracket with Round of 16, Quarter Finals, Semi Finals, and Final
2. WHEN the admin selects teams for Round of 16, THE System SHALL populate the bracket structure
3. WHEN a knockout match is completed, THE System SHALL advance the winner to the next round automatically
4. WHEN semi-final matches are completed, THE System SHALL identify losers for 3rd place designation
5. THE System SHALL display the complete bracket structure with all match results

### Requirement 12: Public View

**User Story:** As a public user, I want to view tournament information, so that I can follow the competition as a spectator.

#### Acceptance Criteria

1. WHEN a public user accesses the public view page, THE System SHALL display tabs for group standings, knockout bracket, and match results
2. THE System SHALL display all information in read-only mode without edit capabilities
3. THE System SHALL present information in a clean, spectator-friendly layout
4. THE System SHALL update displayed information when match results change
5. THE System SHALL be accessible without admin authentication

### Requirement 13: Reports Generation

**User Story:** As an admin, I want to generate tournament reports, so that I can share official documentation.

#### Acceptance Criteria

1. WHEN the admin accesses the reports page, THE System SHALL display buttons for match schedule PDF, knockout bracket PDF, and standings PDF
2. WHEN the admin clicks a report button, THE System SHALL display a printable preview layout
3. THE System SHALL format reports in a professional, print-ready style
4. THE System SHALL include all relevant tournament information in each report type
5. THE System SHALL organize report content clearly with proper headings and sections

### Requirement 14: Navigation and Layout

**User Story:** As a user, I want intuitive navigation, so that I can access different sections of the system easily.

#### Acceptance Criteria

1. THE System SHALL display a left sidebar with navigation menu items
2. THE System SHALL display a top header with page title, breadcrumb, and admin avatar
3. WHEN on mobile devices, THE System SHALL collapse the sidebar into a drawer
4. WHEN a user clicks a menu item, THE System SHALL navigate to the corresponding page
5. THE System SHALL highlight the active menu item in the sidebar

### Requirement 15: Responsive Design

**User Story:** As a user on mobile devices, I want the system to work properly, so that I can use it on any device.

#### Acceptance Criteria

1. WHEN accessed on mobile devices, THE System SHALL display the match input page in a mobile-friendly layout
2. WHEN accessed on mobile devices, THE System SHALL display the registration form in a mobile-friendly layout
3. WHEN accessed on mobile devices, THE System SHALL display standings tables with horizontal scrolling
4. WHEN accessed on mobile devices, THE System SHALL convert the sidebar to a collapsible drawer
5. THE System SHALL maintain functionality and readability across all screen sizes

### Requirement 16: Visual Design and Theming

**User Story:** As a user, I want a professional and consistent visual design, so that the system feels polished and trustworthy.

#### Acceptance Criteria

1. THE System SHALL use Deep Soft Green (#1F7A63) as the primary color throughout the interface
2. THE System SHALL use Poppins font globally with weights 400, 500, 600, and 700
3. THE System SHALL use card-based layouts with consistent padding, spacing, and rounded corners
4. THE System SHALL use lucide-react icons consistently throughout the interface
5. THE System SHALL maintain a minimalist, modern, clean, and professional aesthetic without visual clutter

### Requirement 17: Mock Data Management

**User Story:** As a developer, I want well-structured mock data, so that the prototype demonstrates realistic functionality.

#### Acceptance Criteria

1. THE System SHALL include mock data for 32 teams with unique names and logos
2. THE System SHALL include mock data for 10 players per team with names and jersey numbers
3. THE System SHALL organize mock data into separate files for teams, players, groups, matches, and knockout stages
4. THE System SHALL use TypeScript types for all mock data structures
5. THE System SHALL ensure mock data relationships are consistent (e.g., player team IDs match team IDs)

### Requirement 18: Component Reusability

**User Story:** As a developer, I want reusable components, so that the codebase is maintainable and consistent.

#### Acceptance Criteria

1. THE System SHALL implement reusable TeamCard component for displaying team information
2. THE System SHALL implement reusable MatchCard component for displaying match information
3. THE System SHALL implement reusable StandingsTable component for displaying group standings
4. THE System SHALL implement reusable KnockoutBracket component for displaying elimination rounds
5. THE System SHALL implement reusable Sidebar, Header, and ModalInfo components for layout consistency
