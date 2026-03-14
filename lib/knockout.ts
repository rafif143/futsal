import { KnockoutMatch, Team } from '@/data/types';

/**
 * Returns the winner of a knockout match based on scores.
 * Returns undefined if the match has no result yet (scores not set).
 *
 * Requirements: 11.3
 */
export function getMatchWinner(match: KnockoutMatch): Team | undefined {
  if (match.score1 === undefined || match.score2 === undefined) return undefined;
  if (!match.team1 || !match.team2) return undefined;
  if (match.score1 > match.score2) return match.team1;
  if (match.score2 > match.score1) return match.team2;
  // Draw — no winner (shouldn't happen in knockout, but guard anyway)
  return undefined;
}

/**
 * Round progression mapping:
 *   round16 (8 matches, indices 0-7) → quarter (4 matches, indices 0-3)
 *     match i → quarter match Math.floor(i / 2)
 *     even-indexed round16 winner fills team1, odd fills team2
 *
 *   quarter (4 matches, indices 0-3) → semi (2 matches, indices 0-1)
 *     match i → semi match Math.floor(i / 2)
 *
 *   semi (2 matches, indices 0-1) → final (1 match, index 0)
 *     both semi winners fill final team1 / team2
 *
 *   semi losers → third place match
 *
 * Requirements: 11.3, 11.4
 */
export function advanceWinners(matches: KnockoutMatch[]): KnockoutMatch[] {
  // Work on a shallow-cloned array with cloned match objects so we don't mutate input
  const result: KnockoutMatch[] = matches.map((m) => ({ ...m }));

  const byRound = (round: KnockoutMatch['round']) =>
    result.filter((m) => m.round === round);

  const round16 = byRound('round16');
  const quarter = byRound('quarter');
  const semi = byRound('semi');
  const finals = byRound('final');
  const third = byRound('third');

  // Helper: set winner field on a match object in result
  const setWinner = (match: KnockoutMatch) => {
    const winner = getMatchWinner(match);
    if (winner) match.winner = winner;
  };

  // --- round16 → quarter ---
  round16.forEach((match, i) => {
    setWinner(match);
    const winner = match.winner;
    if (!winner) return;
    const targetQuarter = quarter[Math.floor(i / 2)];
    if (!targetQuarter) return;
    if (i % 2 === 0) {
      targetQuarter.team1 = winner;
    } else {
      targetQuarter.team2 = winner;
    }
  });

  // --- quarter → semi ---
  quarter.forEach((match, i) => {
    setWinner(match);
    const winner = match.winner;
    if (!winner) return;
    const targetSemi = semi[Math.floor(i / 2)];
    if (!targetSemi) return;
    if (i % 2 === 0) {
      targetSemi.team1 = winner;
    } else {
      targetSemi.team2 = winner;
    }
  });

  // --- semi → final & third ---
  const finalMatch = finals[0];
  const thirdMatch = third[0];

  semi.forEach((match, i) => {
    setWinner(match);
    const winner = match.winner;
    const loser =
      match.score1 !== undefined && match.score2 !== undefined
        ? match.score1 > match.score2
          ? match.team2
          : match.score2 > match.score1
          ? match.team1
          : undefined
        : undefined;

    if (winner && finalMatch) {
      if (i === 0) finalMatch.team1 = winner;
      else finalMatch.team2 = winner;
    }

    if (loser && thirdMatch) {
      if (i === 0) thirdMatch.team1 = loser;
      else thirdMatch.team2 = loser;
    }
  });

  return result;
}

/**
 * Returns the two semi-final losers as participants for the 3rd place match.
 * Each element corresponds to the loser of semi[0] and semi[1] respectively.
 * Returns undefined for a slot if that semi-final has no result yet.
 *
 * Requirements: 11.4
 */
export function getThirdPlaceParticipants(
  matches: KnockoutMatch[]
): [Team | undefined, Team | undefined] {
  const semis = matches.filter((m) => m.round === 'semi');

  const getLoser = (match: KnockoutMatch): Team | undefined => {
    if (match.score1 === undefined || match.score2 === undefined) return undefined;
    if (!match.team1 || !match.team2) return undefined;
    if (match.score1 > match.score2) return match.team2;
    if (match.score2 > match.score1) return match.team1;
    return undefined; // draw — no loser
  };

  return [getLoser(semis[0]), getLoser(semis[1])];
}
