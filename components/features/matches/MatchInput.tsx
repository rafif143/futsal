"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Plus } from "lucide-react";
import { Match, MatchEvent, MatchResult, Team, Player } from "@/data/types";
import { EventTimeline } from "./EventTimeline";

interface MatchInputProps {
  match: Match;
  team1: Team;
  team2: Team;
  team1Players: Player[];
  team2Players: Player[];
  onSave: (result: MatchResult) => void;
}

const EVENT_TYPE_LABELS = {
  goal: "Gol",
  yellowCard: "Kartu Kuning",
  redCard: "Kartu Merah",
} as const;

type EventType = keyof typeof EVENT_TYPE_LABELS;

export function MatchInput({
  match,
  team1,
  team2,
  team1Players,
  team2Players,
  onSave,
}: MatchInputProps) {
  const [team1Score, setTeam1Score] = useState(match.team1Score ?? 0);
  const [team2Score, setTeam2Score] = useState(match.team2Score ?? 0);
  const [events, setEvents] = useState<MatchEvent[]>(match.events ?? []);

  const [eventForm, setEventForm] = useState<{
    playerId: string;
    teamId: string;
    minute: number;
    type: EventType;
  }>({
    playerId: "",
    teamId: team1.id,
    minute: 1,
    type: "goal",
  });

  const allPlayers = [...team1Players, ...team2Players];

  // Filter players by selected team
  const playersForSelectedTeam =
    eventForm.teamId === team1.id ? team1Players : team2Players;

  const playerMap = new Map(allPlayers.map((p) => [p.id, p.name]));
  const teamMap = new Map([
    [team1.id, team1.name],
    [team2.id, team2.name],
  ]);

  function handleTeamChange(teamId: string) {
    setEventForm((prev) => ({ ...prev, teamId, playerId: "" }));
  }

  function handleAddEvent() {
    if (!eventForm.playerId) return;

    const newEvent: MatchEvent = {
      id: `${Date.now()}-${Math.random()}`,
      matchId: match.id,
      playerId: eventForm.playerId,
      teamId: eventForm.teamId,
      minute: eventForm.minute,
      type: eventForm.type,
    };

    if (eventForm.type === "goal") {
      if (eventForm.teamId === team1.id) {
        setTeam1Score((s) => s + 1);
      } else {
        setTeam2Score((s) => s + 1);
      }
    }

    setEvents((prev) => [...prev, newEvent]);
    setEventForm((prev) => ({ ...prev, playerId: "", minute: 1 }));
  }

  function handleSave() {
    onSave({ matchId: match.id, team1Score, team2Score, events });
  }

  return (
    <div className="space-y-6">
      {/* Score section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skor Pertandingan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {/* Team 1 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="font-semibold text-sm text-center">{team1.name}</span>
              <Input
                type="number"
                min={0}
                value={team1Score}
                onChange={(e) => setTeam1Score(Math.max(0, Number(e.target.value)))}
                className="w-20 text-center text-2xl font-bold h-14"
              />
            </div>

            <span className="text-2xl font-bold text-muted-foreground">vs</span>

            {/* Team 2 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="font-semibold text-sm text-center">{team2.name}</span>
              <Input
                type="number"
                min={0}
                value={team2Score}
                onChange={(e) => setTeam2Score(Math.max(0, Number(e.target.value)))}
                className="w-20 text-center text-2xl font-bold h-14"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tambah Kejadian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Team select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Tim</label>
              <Select value={eventForm.teamId} onValueChange={handleTeamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={team1.id}>{team1.name}</SelectItem>
                  <SelectItem value={team2.id}>{team2.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Pemain</label>
              <Select
                value={eventForm.playerId}
                onValueChange={(v) => setEventForm((prev) => ({ ...prev, playerId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pemain" />
                </SelectTrigger>
                <SelectContent>
                  {playersForSelectedTeam.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      #{p.jerseyNumber} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minute input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Menit</label>
              <Input
                type="number"
                min={1}
                max={90}
                value={eventForm.minute}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    minute: Math.min(90, Math.max(1, Number(e.target.value))),
                  }))
                }
              />
            </div>

            {/* Event type select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Jenis Kejadian</label>
              <Select
                value={eventForm.type}
                onValueChange={(v) =>
                  setEventForm((prev) => ({ ...prev, type: v as EventType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {EVENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="mt-4 bg-[#1F7A63] hover:bg-[#16624F] text-white"
            onClick={handleAddEvent}
            disabled={!eventForm.playerId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kejadian
          </Button>
        </CardContent>
      </Card>

      {/* Event timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline Kejadian</CardTitle>
        </CardHeader>
        <CardContent>
          <EventTimeline events={events} playerMap={playerMap} teamMap={teamMap} />
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          className="bg-[#1F7A63] hover:bg-[#16624F] text-white"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Simpan Hasil
        </Button>
      </div>
    </div>
  );
}
