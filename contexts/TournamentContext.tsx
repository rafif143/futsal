'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team, Registration, GroupAssignment, Match } from '@/data/types';
import { 
  teamStorage, 
  registrationStorage, 
  groupStorage, 
  matchStorage,
  drawingStorage 
} from '@/lib/storage';
import { mockTeams } from '@/data/mock-teams';
import { mockRegistrations } from '@/data/mock-registrations';
import { mockGroups } from '@/data/mock-groups';

interface TournamentContextType {
  // Teams
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  
  // Registrations
  registrations: Registration[];
  setRegistrations: (registrations: Registration[]) => void;
  addRegistration: (registration: Registration) => void;
  updateRegistration: (registrationId: string, updates: Partial<Registration>) => void;
  approveRegistration: (registrationId: string) => void;
  rejectRegistration: (registrationId: string) => void;
  markRegistrationAsViewed: (registrationId: string) => void;
  
  // Groups
  groups: GroupAssignment[];
  setGroups: (groups: GroupAssignment[]) => void;
  clearGroups: () => void;
  
  // Matches
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  clearMatches: () => void;
  
  // Drawing
  isDrawingConfirmed: boolean;
  setDrawingConfirmed: (confirmed: boolean) => void;
  
  // Utility
  resetAllData: () => void;
  loadMockData: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [teams, setTeamsState] = useState<Team[]>([]);
  const [registrations, setRegistrationsState] = useState<Registration[]>([]);
  const [groups, setGroupsState] = useState<GroupAssignment[]>([]);
  const [matches, setMatchesState] = useState<Match[]>([]);
  const [isDrawingConfirmed, setIsDrawingConfirmedState] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedTeams = teamStorage.getAll();
    const loadedRegistrations = registrationStorage.getAll();
    const loadedGroups = groupStorage.getAll();
    const loadedMatches = matchStorage.getAll();
    const loadedDrawingConfirmed = drawingStorage.isConfirmed();

    // If no data in localStorage, load mock data
    if (loadedTeams.length === 0) {
      setTeamsState(mockTeams);
      teamStorage.save(mockTeams);
    } else {
      setTeamsState(loadedTeams);
    }

    if (loadedRegistrations.length === 0) {
      setRegistrationsState(mockRegistrations);
      registrationStorage.save(mockRegistrations);
    } else {
      setRegistrationsState(loadedRegistrations);
    }

    if (loadedGroups.length === 0) {
      setGroupsState(mockGroups);
      groupStorage.save(mockGroups);
    } else {
      setGroupsState(loadedGroups);
    }

    setMatchesState(loadedMatches);
    setIsDrawingConfirmedState(loadedDrawingConfirmed);
    setIsInitialized(true);
  }, []);

  // Teams functions
  const setTeams = (newTeams: Team[]) => {
    setTeamsState(newTeams);
    teamStorage.save(newTeams);
  };

  const addTeam = (team: Team) => {
    const newTeams = [...teams, team];
    setTeams(newTeams);
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    const newTeams = teams.map(t => t.id === teamId ? { ...t, ...updates } : t);
    setTeams(newTeams);
  };

  // Registrations functions
  const setRegistrations = (newRegistrations: Registration[]) => {
    setRegistrationsState(newRegistrations);
    registrationStorage.save(newRegistrations);
  };

  const addRegistration = (registration: Registration) => {
    const newRegistrations = [...registrations, registration];
    setRegistrations(newRegistrations);
  };

  const updateRegistration = (registrationId: string, updates: Partial<Registration>) => {
    const newRegistrations = registrations.map(r => 
      r.id === registrationId ? { ...r, ...updates } : r
    );
    setRegistrations(newRegistrations);
  };

  const approveRegistration = (registrationId: string) => {
    updateRegistration(registrationId, { status: 'approved' });
  };

  const rejectRegistration = (registrationId: string) => {
    updateRegistration(registrationId, { status: 'rejected' });
  };

  const markRegistrationAsViewed = (registrationId: string) => {
    updateRegistration(registrationId, { isNew: false });
  };

  // Groups functions
  const setGroups = (newGroups: GroupAssignment[]) => {
    setGroupsState(newGroups);
    groupStorage.save(newGroups);
  };

  const clearGroups = () => {
    setGroupsState([]);
    groupStorage.clear();
  };

  // Matches functions
  const setMatches = (newMatches: Match[]) => {
    setMatchesState(newMatches);
    matchStorage.save(newMatches);
  };

  const updateMatch = (matchId: string, updates: Partial<Match>) => {
    const newMatches = matches.map(m => m.id === matchId ? { ...m, ...updates } : m);
    setMatches(newMatches);
  };

  const clearMatches = () => {
    setMatchesState([]);
    matchStorage.clear();
  };

  // Drawing functions
  const setDrawingConfirmed = (confirmed: boolean) => {
    setIsDrawingConfirmedState(confirmed);
    drawingStorage.setConfirmed(confirmed);
  };

  // Utility functions
  const resetAllData = () => {
    setTeamsState([]);
    setRegistrationsState([]);
    setGroupsState([]);
    setMatchesState([]);
    setIsDrawingConfirmedState(false);
    teamStorage.save([]);
    registrationStorage.save([]);
    groupStorage.clear();
    matchStorage.clear();
    drawingStorage.setConfirmed(false);
  };

  const loadMockData = () => {
    setTeams(mockTeams);
    setRegistrations(mockRegistrations);
    setGroups(mockGroups);
    setMatches([]);
    setDrawingConfirmed(false);
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <TournamentContext.Provider
      value={{
        teams,
        setTeams,
        addTeam,
        updateTeam,
        registrations,
        setRegistrations,
        addRegistration,
        updateRegistration,
        approveRegistration,
        rejectRegistration,
        markRegistrationAsViewed,
        groups,
        setGroups,
        clearGroups,
        matches,
        setMatches,
        updateMatch,
        clearMatches,
        isDrawingConfirmed,
        setDrawingConfirmed,
        resetAllData,
        loadMockData,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
