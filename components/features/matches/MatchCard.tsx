import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import { Match } from "@/data/types";

interface MatchCardProps {
  match: Match;
  team1Name: string;
  team2Name: string;
  onClick?: () => void;
  showScore?: boolean;
}

const STAGE_LABELS: Record<Match["stage"], string> = {
  group: "Grup",
  round16: "Babak 16 Besar",
  quarter: "Perempat Final",
  semi: "Semi Final",
  final: "Final",
  third: "Perebutan Juara 3",
};

export function MatchCard({
  match,
  team1Name,
  team2Name,
  onClick,
  showScore = true,
}: MatchCardProps) {
  const isCompleted = match.status === "completed";
  const matchLabel = match.group
    ? `Grup ${match.group} - ${match.id}`
    : `${STAGE_LABELS[match.stage]} - ${match.id}`;

  return (
    <Card
      className={`overflow-hidden transition-shadow ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Match info */}
          <div className="flex-1 min-w-0">
            {/* Match name / label */}
            <p className="text-xs text-gray-500 truncate mb-1">
              {matchLabel}
            </p>

            {/* Teams and score */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate flex-1 text-right text-gray-900">
                {team1Name}
              </span>

              {showScore && isCompleted ? (
                <span className="font-bold text-base text-[#1F7A63] whitespace-nowrap px-2">
                  {match.team1Score ?? 0} - {match.team2Score ?? 0}
                </span>
              ) : (
                <span className="text-gray-500 text-sm whitespace-nowrap px-2">
                  vs
                </span>
              )}

              <span className="font-semibold text-sm truncate flex-1 text-gray-900">
                {team2Name}
              </span>
            </div>

            {/* Date and status row */}
            <div className="flex items-center gap-2 mt-2">
              {(match.date || match.time || match.venue) ? (
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-1">
                  {match.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(match.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                  {match.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{match.time}</span>
                    </div>
                  )}
                  {match.venue && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[80px]">{match.venue}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-1">
                  <Calendar className="h-3 w-3" />
                  <span className="italic">Belum dijadwalkan</span>
                </div>
              )}
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className={
                  isCompleted
                    ? "bg-[#1F7A63] hover:bg-[#16624F] text-white text-xs"
                    : "text-xs bg-gray-100 text-gray-700"
                }
              >
                {isCompleted ? "Selesai" : "Menunggu"}
              </Badge>
            </div>
          </div>

          {/* Chevron for clickable cards */}
          {onClick && (
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
