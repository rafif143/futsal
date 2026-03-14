// Local Storage utility functions
import { Team, Registration, GroupAssignment, Match } from '@/data/types';

const STORAGE_KEYS = {
  TEAMS: 'yadika_teams',
  REGISTRATIONS: 'yadika_registrations',
  GROUPS: 'yadika_groups',
  MATCHES: 'yadika_matches',
  DRAWING_CONFIRMED: 'yadika_drawing_confirmed',
} as const;

// Generic storage functions
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Specific data functions
export const teamStorage = {
  getAll: (): Team[] => storage.get(STORAGE_KEYS.TEAMS, []),
  save: (teams: Team[]): void => storage.set(STORAGE_KEYS.TEAMS, teams),
  add: (team: Team): void => {
    const teams = teamStorage.getAll();
    teamStorage.save([...teams, team]);
  },
  update: (teamId: string, updates: Partial<Team>): void => {
    const teams = teamStorage.getAll();
    const updated = teams.map(t => t.id === teamId ? { ...t, ...updates } : t);
    teamStorage.save(updated);
  },
};

export const registrationStorage = {
  getAll: (): Registration[] => storage.get(STORAGE_KEYS.REGISTRATIONS, []),
  save: (registrations: Registration[]): void => storage.set(STORAGE_KEYS.REGISTRATIONS, registrations),
  add: (registration: Registration): void => {
    const registrations = registrationStorage.getAll();
    registrationStorage.save([...registrations, registration]);
  },
  update: (registrationId: string, updates: Partial<Registration>): void => {
    const registrations = registrationStorage.getAll();
    const updated = registrations.map(r => r.id === registrationId ? { ...r, ...updates } : r);
    registrationStorage.save(updated);
  },
  updateStatus: (registrationId: string, status: 'pending' | 'approved' | 'rejected'): void => {
    registrationStorage.update(registrationId, { status });
  },
  markAsViewed: (registrationId: string): void => {
    registrationStorage.update(registrationId, { isNew: false });
  },
};

export const groupStorage = {
  getAll: (): GroupAssignment[] => storage.get(STORAGE_KEYS.GROUPS, []),
  save: (groups: GroupAssignment[]): void => storage.set(STORAGE_KEYS.GROUPS, groups),
  clear: (): void => storage.remove(STORAGE_KEYS.GROUPS),
};

export const matchStorage = {
  getAll: (): Match[] => storage.get(STORAGE_KEYS.MATCHES, []),
  save: (matches: Match[]): void => storage.set(STORAGE_KEYS.MATCHES, matches),
  update: (matchId: string, updates: Partial<Match>): void => {
    const matches = matchStorage.getAll();
    const updated = matches.map(m => m.id === matchId ? { ...m, ...updates } : m);
    matchStorage.save(updated);
  },
  clear: (): void => storage.remove(STORAGE_KEYS.MATCHES),
};

export const drawingStorage = {
  isConfirmed: (): boolean => storage.get(STORAGE_KEYS.DRAWING_CONFIRMED, false),
  setConfirmed: (confirmed: boolean): void => storage.set(STORAGE_KEYS.DRAWING_CONFIRMED, confirmed),
};
