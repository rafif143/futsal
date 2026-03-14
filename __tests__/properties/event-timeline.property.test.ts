/**
 * Property-Based Tests for Event Timeline Chronological Order
 * Feature: futsal-tournament-management-system
 */

// Feature: futsal-tournament-management-system, Property 13: Event Timeline Chronological Order

import fc from 'fast-check';

interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  teamId: string;
  minute: number;
  type: 'goal' | 'yellowCard' | 'redCard';
}

/**
 * Pure function that sorts match events by minute in ascending order.
 */
function sortEventsByMinute(events: MatchEvent[]): MatchEvent[] {
  return [...events].sort((a, b) => a.minute - b.minute);
}

/**
 * Arbitrary for generating a single MatchEvent
 */
const matchEventArbitrary = fc.record({
  id: fc.uuid(),
  matchId: fc.uuid(),
  playerId: fc.uuid(),
  teamId: fc.uuid(),
  minute: fc.integer({ min: 1, max: 90 }),
  type: fc.constantFrom('goal', 'yellowCard', 'redCard') as fc.Arbitrary<'goal' | 'yellowCard' | 'redCard'>,
});

/**
 * Arbitrary for generating an array of MatchEvents (0 to 20 events)
 */
const matchEventsArbitrary = fc.array(matchEventArbitrary, { minLength: 0, maxLength: 20 });

/**
 * Property 13: Event Timeline Chronological Order
 *
 * **Validates: Requirements 9.3**
 *
 * For any list of match events, when sorted by minute:
 * 1. The result is in ascending order by minute
 * 2. All events are preserved (no events lost or added)
 */
describe('Property 13: Event Timeline Chronological Order', () => {
  test('sorted events should be in ascending order by minute', () => {
    fc.assert(
      fc.property(matchEventsArbitrary, (events) => {
        const sorted = sortEventsByMinute(events);
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].minute < sorted[i - 1].minute) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('sorting should preserve all events (no events lost or added)', () => {
    fc.assert(
      fc.property(matchEventsArbitrary, (events) => {
        const sorted = sortEventsByMinute(events);
        if (sorted.length !== events.length) return false;
        const inputIds = new Set(events.map(e => e.id));
        const sortedIds = new Set(sorted.map(e => e.id));
        return inputIds.size === sortedIds.size && [...inputIds].every(id => sortedIds.has(id));
      }),
      { numRuns: 100 }
    );
  });
});
