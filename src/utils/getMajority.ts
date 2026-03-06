export function getMajority(
  totalSeats: number,
  selectedSeats: number,
  allowTieBreaker: boolean = false,
): {
  seatsForMajority: number;
  status: "all" | "majority" | "tie-breaking majority" | "minority" | "none";
  margin: number;
} {
  const majorityThreshold = (
    totalSeats % 2 === 0
      ? totalSeats / 2 + (allowTieBreaker ? 0 : 1)
      : Math.ceil(totalSeats / 2)
  ) as number;

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
  if (allowTieBreaker && majorityThreshold === selectedSeats) {
    return {
      seatsForMajority: majorityThreshold,
      status: "tie-breaking majority",
      margin: 0,
    };
  }

  // Majority achieved
  if (
    (totalSeats % 2 === 0 ? totalSeats / 2 + 1 : Math.ceil(totalSeats / 2)) <=
    selectedSeats
  ) {
    return {
      seatsForMajority: majorityThreshold,
      status: "majority",
      margin: selectedSeats - majorityThreshold + (allowTieBreaker ? 0 : 1),
    };
  }

  // Not yet a majority
  return {
    seatsForMajority: majorityThreshold,
    status: "minority",
    margin: majorityThreshold - selectedSeats,
  };
}
