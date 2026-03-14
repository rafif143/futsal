import Image from "next/image";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GroupAssignment, Team } from "@/data/types";

interface GroupCardProps {
  assignment: GroupAssignment;
}

function TeamSlot({ team }: { team?: Team }) {
  if (!team) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40 border border-dashed border-border">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-white italic">Slot kosong</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-background border border-border transition-colors">
      {/* Team Avatar */}
      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border border-border">
        {team.logo && (
          <Image
            src={team.logo}
            alt={`${team.schoolName} logo`}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <span className="text-xs font-bold text-primary select-none">
          {team.schoolName.charAt(0).toUpperCase()}
        </span>
      </div>
      {/* School Name */}
      <span className="text-sm font-medium truncate text-white">{team.schoolName}</span>
    </div>
  );
}

export function GroupCard({ assignment }: GroupCardProps) {
  // Always show 3 slots; fill with teams or empty placeholders
  const slots: (Team | undefined)[] = Array.from({ length: 3 }, (_, i) => assignment.teams[i]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-3">
          {/* Group Letter Badge */}
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
            style={{ backgroundColor: "#1F7A63" }}
          >
            {assignment.group}
          </div>
          <div>
            <p className="font-semibold text-base leading-tight text-gray-900">Grup {assignment.group}</p>
            <p className="text-xs text-gray-600">
              {assignment.teams.length}/3 tim
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col gap-2">
        {slots.map((team, index) => (
          <TeamSlot key={team?.id ?? `empty-${index}`} team={team} />
        ))}
      </CardContent>
    </Card>
  );
}
