import { Target, Square } from "lucide-react";
import { MatchEvent } from "@/data/types";

interface EventTimelineProps {
  events: MatchEvent[];
  playerMap: Map<string, string>; // playerId -> playerName
  teamMap: Map<string, string>;   // teamId -> teamName
}

const EVENT_CONFIG = {
  goal: {
    label: "Gol",
    icon: Target,
    iconClass: "text-[#1F7A63]",
    badgeClass: "bg-[#1F7A63]/10 text-[#1F7A63]",
  },
  yellowCard: {
    label: "Kartu Kuning",
    icon: Square,
    iconClass: "text-yellow-500 fill-yellow-400",
    badgeClass: "bg-yellow-50 text-yellow-700",
  },
  redCard: {
    label: "Kartu Merah",
    icon: Square,
    iconClass: "text-red-500 fill-red-500",
    badgeClass: "bg-red-50 text-red-700",
  },
} as const;

export function EventTimeline({ events, playerMap, teamMap }: EventTimelineProps) {
  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Belum ada kejadian tercatat.
      </div>
    );
  }

  return (
    <ol className="relative border-l border-gray-200 ml-3 space-y-4">
      {sorted.map((event) => {
        const config = EVENT_CONFIG[event.type];
        const Icon = config.icon;
        const playerName = playerMap.get(event.playerId) ?? "Pemain tidak dikenal";
        const teamName = teamMap.get(event.teamId) ?? "Tim tidak dikenal";

        return (
          <li key={event.id} className="ml-6">
            {/* Timeline dot */}
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
              <Icon className={`h-3.5 w-3.5 ${config.iconClass}`} />
            </span>

            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-sm">
              {/* Minute badge */}
              <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 tabular-nums">
                {event.minute}&apos;
              </span>

              {/* Event type badge */}
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${config.badgeClass}`}>
                {config.label}
              </span>

              {/* Player & team */}
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900">
                  {playerName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {teamName}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
