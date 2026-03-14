'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { PlayerInput as PlayerInputType } from '@/data/types';

interface PlayerInputProps {
  players: PlayerInputType[];
  onChange: (players: PlayerInputType[]) => void;
}

export function PlayerInput({ players, onChange }: PlayerInputProps) {
  const handleAddPlayer = () => {
    const newPlayer: PlayerInputType = {
      name: '',
      jerseyNumber: 0,
      studentCard: undefined,
    };
    onChange([...players, newPlayer]);
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    onChange(updatedPlayers);
  };

  const handlePlayerChange = (
    index: number,
    field: keyof PlayerInputType,
    value: string | number | File | undefined
  ) => {
    const updatedPlayers = [...players];
    if (field === 'name') {
      updatedPlayers[index] = { ...updatedPlayers[index], name: value as string };
    } else if (field === 'jerseyNumber') {
      updatedPlayers[index] = { ...updatedPlayers[index], jerseyNumber: value as number };
    } else if (field === 'studentCard') {
      updatedPlayers[index] = { ...updatedPlayers[index], studentCard: value as File | undefined };
    }
    onChange(updatedPlayers);
  };

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handlePlayerChange(index, 'studentCard', file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Player Information</h3>
        <Button
          type="button"
          onClick={handleAddPlayer}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Player
        </Button>
      </div>

      {players.length === 0 && (
        <Card className="p-6 text-center text-gray-600">
          No players added yet. Click "Add Player" to start.
        </Card>
      )}

      {players.map((player, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Player {index + 1}</h4>
              <Button
                type="button"
                onClick={() => handleRemovePlayer(index)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={`player-name-${index}`} className="text-sm font-medium text-gray-900">
                  Player Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id={`player-name-${index}`}
                  type="text"
                  placeholder="Enter player name"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`jersey-number-${index}`} className="text-sm font-medium text-gray-900">
                  Jersey Number <span className="text-destructive">*</span>
                </label>
                <Input
                  id={`jersey-number-${index}`}
                  type="number"
                  placeholder="Enter jersey number"
                  value={player.jerseyNumber || ''}
                  onChange={(e) => handlePlayerChange(index, 'jerseyNumber', parseInt(e.target.value) || 0)}
                  min="0"
                  max="99"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor={`student-card-${index}`} className="text-sm font-medium text-gray-900">
                  Student Card Upload <span className="text-destructive">*</span>
                </label>
                <Input
                  id={`student-card-${index}`}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(index, e)}
                  required
                />
                {player.studentCard && (
                  <p className="text-sm text-gray-600">
                    Selected: {player.studentCard.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
