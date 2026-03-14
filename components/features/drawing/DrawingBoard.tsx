"use client";

import { Shuffle, Calendar, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupCard } from "./GroupCard";
import { GroupAssignment, Team } from "@/data/types";

interface DrawingBoardProps {
  groups: GroupAssignment[];
  teams: Team[];
  onRandomize: () => void;
  onConfirm: () => void;
  isConfirmed?: boolean;
}

export function DrawingBoard({
  groups,
  teams,
  onRandomize,
  onConfirm,
  isConfirmed = false,
}: DrawingBoardProps) {
  const totalTeams = teams.length;
  const placedTeams = groups.reduce((sum, g) => sum + g.teams.length, 0);
  const allGroupsFilled = groups.length === 11 && groups.every((g) => g.teams.length === 3);
  // We consider matches "generated" when groups are filled and confirmed is not yet set
  // The parent controls this via isConfirmed; we derive "matches generated" from isConfirmed
  // For button logic: generate matches enabled when all groups filled; confirm enabled when isConfirmed is false and all groups filled
  const canGenerateMatches = allGroupsFilled && !isConfirmed;
  const canConfirm = allGroupsFilled && !isConfirmed;

  return (
    <div className="flex flex-col gap-6">
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-muted/40 border border-border">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1F7A63" }}
          >
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Status Penempatan Tim</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{placedTeams}</span>
              /{totalTeams} tim telah ditempatkan
            </p>
          </div>
        </div>

        {isConfirmed && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <CheckCircle className="h-4 w-4" />
            Drawing telah dikonfirmasi
          </div>
        )}
      </div>

      {/* Group Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groups.map((assignment) => (
          <GroupCard key={assignment.group} assignment={assignment} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onRandomize}
          disabled={isConfirmed || totalTeams < 33}
        >
          <Shuffle className="h-4 w-4" />
          Acak Grup
        </Button>

        <Button
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: "#1F7A63" }}
          onClick={onConfirm}
          disabled={!canConfirm}
        >
          <CheckCircle className="h-4 w-4" />
          Konfirmasi
        </Button>
      </div>
    </div>
  );
}
