import { Player } from './types';

/**
 * Mock data for 320 futsal players (10 players per team)
 * Each player has unique ID, name, jersey number (unique within team), and team reference
 * All statistics (goals, yellowCards, redCards) initialized to 0
 * Requirements: 17.2 - 10 players per team with unique jersey numbers within each team
 */

// Common Indonesian first names
const firstNames = [
  'Adi', 'Agus', 'Ahmad', 'Andi', 'Arif', 'Bambang', 'Budi', 'Dedi', 'Eko', 'Fajar',
  'Hendra', 'Indra', 'Joko', 'Kurniawan', 'Lukman', 'Muhammad', 'Nugroho', 'Putra',
  'Rizal', 'Sandi', 'Taufik', 'Usman', 'Wahyu', 'Yanto', 'Zainuddin', 'Rudi', 'Doni',
  'Feri', 'Gilang', 'Hadi', 'Irfan', 'Jaya', 'Krisna', 'Lutfi', 'Maulana', 'Nanda',
];

// Common Indonesian last names
const lastNames = [
  'Pratama', 'Santoso', 'Wijaya', 'Kurniawan', 'Prasetyo', 'Ramadhan', 'Hidayat',
  'Setiawan', 'Gunawan', 'Hakim', 'Iqbal', 'Mahendra', 'Effendi', 'Nugroho', 'Basuki',
  'Ahmad', 'Sutrisno', 'Saputra', 'Utina', 'Firmansyah', 'Hermawan', 'Kusuma', 'Putra',
  'Wibowo', 'Yusuf', 'Zulkarnain', 'Anwar', 'Budiman', 'Cahyono', 'Darmawan',
];

// Generate a unique player name using index to ensure variety
const generatePlayerName = (index: number): string => {
  const firstNameIndex = index % firstNames.length;
  const lastNameIndex = Math.floor(index / firstNames.length) % lastNames.length;
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
};

// Generate players for all 32 teams
const generatePlayers = (): Player[] => {
  const players: Player[] = [];
  const jerseyNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Unique jersey numbers per team
  
  for (let teamIndex = 1; teamIndex <= 32; teamIndex++) {
    const teamId = `team-${String(teamIndex).padStart(3, '0')}`;
    
    for (let playerIndex = 0; playerIndex < 10; playerIndex++) {
      const globalPlayerIndex = (teamIndex - 1) * 10 + playerIndex;
      const playerId = `player-${String(globalPlayerIndex + 1).padStart(3, '0')}`;
      
      players.push({
        id: playerId,
        name: generatePlayerName(globalPlayerIndex),
        jerseyNumber: jerseyNumbers[playerIndex],
        teamId: teamId,
        goals: 0,
        yellowCards: 0,
        redCards: 0,
      });
    }
  }
  
  return players;
};

export const mockPlayers: Player[] = generatePlayers();
