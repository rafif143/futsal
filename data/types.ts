// Core Types for Futsal Tournament Management System

export interface Team {
  id: string;
  name: string;
  schoolName: string;
  logo: string;
  officialName: string;
  contactNumber: string;
  group?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
}

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  teamId: string;
  studentCard?: string;
  goals: number;
  yellowCards: number;
  redCards: number;
}

export interface Match {
  id: string;
  stage: 'group' | 'round16' | 'quarter' | 'semi' | 'final' | 'third';
  group?: string;
  team1Id: string;
  team2Id: string;
  team1Score?: number;
  team2Score?: number;
  status: 'pending' | 'completed';
  events: MatchEvent[];
  date?: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  venue?: string; // Lokasi pertandingan
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  teamId: string;
  minute: number;
  type: 'goal' | 'yellowCard' | 'redCard';
}

export interface Registration {
  id: string;
  teamName: string;
  schoolName: string;
  teamLogo?: string;
  officialName: string;
  coachName: string;
  contactNumber: string;
  players: PlayerInput[];
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  isNew?: boolean;
}

export interface PlayerInput {
  name: string;
  jerseyNumber: number;
  studentCard?: File;
}

export interface GroupAssignment {
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';
  teams: Team[];
}

export interface TeamStanding {
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
  disciplinaryPoints: number; // yellowCards + (redCards * 2)
}

export interface KnockoutMatch {
  id: string;
  round: 'round16' | 'quarter' | 'semi' | 'final' | 'third';
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  winner?: Team;
}

export interface MatchResult {
  matchId: string;
  team1Score: number;
  team2Score: number;
  events: MatchEvent[];
}

export interface RegistrationData {
  teamName: string;
  schoolName: string;
  teamLogo?: File;
  officialName: string;
  coachName: string;
  contactNumber: string;
  players: PlayerInput[];
}
