import { MajorityThreshold } from "@/types";

export const simpleMajority: MajorityThreshold = {
  numerator: 1,
  denominator: 2,
};

export function isSameThreshold(a: MajorityThreshold, b: MajorityThreshold) {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

// The thresholds offered in the menu, by their keys under "majority" in the
// translations
export const presetThresholds: { id: string; threshold: MajorityThreshold }[] =
  [
    { id: "blockingMinority", threshold: { numerator: 1, denominator: 3 } },
    { id: "simple", threshold: simpleMajority },
    { id: "threeFifths", threshold: { numerator: 3, denominator: 5 } },
    { id: "twoThirds", threshold: { numerator: 2, denominator: 3 } },
    { id: "threeQuarters", threshold: { numerator: 3, denominator: 4 } },
  ];

export function getPercent({ numerator, denominator }: MajorityThreshold) {
  return Number(((numerator / denominator) * 100).toFixed(2));
}

// Presets read as fractions like 2/3, even when typed in as a percentage, and
// other thresholds as percentages
export function formatThreshold(threshold: MajorityThreshold) {
  const preset = presetThresholds.find((preset) =>
    isSameThreshold(preset.threshold, threshold),
  );
  return preset
    ? `${preset.threshold.numerator}/${preset.threshold.denominator}`
    : `${getPercent(threshold)}%`;
}

// "Majority" only fits one half, so other thresholds, like a 1/3 blocking
// minority, are named by their fraction or percentage instead. A tie-breaker
// is mentioned only when it lowers the count, which takes an even total
export function getSeatsNeededText(
  totalSeats: number,
  threshold: MajorityThreshold,
  allowTieBreaker: boolean,
  i: (key: string) => string,
) {
  const seats = getMajority(
    totalSeats,
    0,
    allowTieBreaker,
    threshold,
  ).seatsForMajority;
  const isTieBreak =
    seats < getMajority(totalSeats, 0, false, threshold).seatsForMajority;
  const key = !isSameThreshold(threshold, simpleMajority)
    ? "header.seatsForThreshold"
    : isTieBreak
      ? "header.seatsForTieBreakingMajority"
      : "header.seatsForMajority";

  return i(key)
    .replace("{count}", seats.toString())
    .replace("{threshold}", formatThreshold(threshold));
}

export function getMajority(
  totalSeats: number,
  selectedSeats: number,
  allowTieBreaker: boolean = false,
  threshold: MajorityThreshold = simpleMajority,
): {
  seatsForMajority: number;
  status: "all" | "majority" | "tie-breaking majority" | "minority" | "none";
  margin: number;
} {
  const { numerator, denominator } = threshold;
  const quota = Math.floor((totalSeats * numerator) / denominator);
  const isExactQuota = (totalSeats * numerator) % denominator === 0;

  // Supermajorities (e.g. 2/3) are reached at exactly the quota, while
  // thresholds up to one half must be exceeded: more than half, or more than
  // a third to block a 2/3 vote. Exactly half is a tie unless tie breaking.
  const isTieBreak =
    allowTieBreaker &&
    isSameThreshold(threshold, simpleMajority) &&
    isExactQuota;
  const isQuotaEnough =
    isTieBreak || (2 * numerator > denominator && isExactQuota);

  const majorityThreshold =
    totalSeats === 0 ? 0 : isQuotaEnough ? quota : quota + 1;

  // Selected all parties
  if (selectedSeats === totalSeats) {
    return {
      seatsForMajority: majorityThreshold,
      status: "all",
      margin: 0,
    };
  }

  // Selected no parties
  if (selectedSeats === 0) {
    return {
      seatsForMajority: majorityThreshold,
      status: "none",
      margin: majorityThreshold,
    };
  }

  // Tie-breaking majority
  if (isTieBreak && majorityThreshold === selectedSeats) {
    return {
      seatsForMajority: majorityThreshold,
      status: "tie-breaking majority",
      margin: 0,
    };
  }

  // Majority achieved
  if (majorityThreshold <= selectedSeats) {
    return {
      seatsForMajority: majorityThreshold,
      status: "majority",
      margin: selectedSeats - majorityThreshold + (isTieBreak ? 0 : 1),
    };
  }

  // Not yet a majority
  return {
    seatsForMajority: majorityThreshold,
    status: "minority",
    margin: majorityThreshold - selectedSeats,
  };
}
