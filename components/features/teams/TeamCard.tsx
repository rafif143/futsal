import Image from "next/image";
import { Users, School } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Team } from "@/data/types";

interface TeamCardProps {
  team: Team;
  playerCount?: number;
  showPlayers?: boolean;
  actions?: React.ReactNode;
}

export function TeamCard({ team, playerCount = 0, showPlayers = true, actions }: TeamCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Team Logo */}
          <div className="relative h-14 w-14 flex-shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
            {team.logo ? (
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to initials on image error
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span className="text-lg font-bold text-primary select-none">
              {team.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{team.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <School className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{team.schoolName}</span>
            </div>
            {showPlayers && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <Users className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{playerCount} pemain</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
