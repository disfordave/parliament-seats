/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import {
  useAllowTieBreaker,
  useParties,
  useSelectedParties,
  useI18n,
  useSortBy,
  useIsEditMode,
} from "@/lib/zustandStore";
import { CaretDownIcon } from "@/components/icons/Icons";
import { sort } from "@/utils/sort";

export default function SeatsGraph() {
  const { parties } = useParties();
  const { selectedParties } = useSelectedParties();
  const { allowTieBreaker } = useAllowTieBreaker();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { i } = useI18n();

  const total = parties.reduce((acc, party) => acc + party.seats, 0);
  const selectedTotal = selectedParties.reduce(
    (acc, party) => acc + party.seats,
    0,
  );

  const majorityThreshold = (
    total % 2 === 0
      ? total / 2 + (allowTieBreaker ? 0 : 1)
      : Math.ceil(total / 2)
  ) as number;

  return (
    <>
      <div className="sticky top-0 z-50 -mx-4 mb-2 rounded-lg border border-gray-200 bg-white/50 p-2 backdrop-blur-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <p className="flex-1">
            {selectedTotal === total || selectedTotal === 0 ? (
              ""
            ) : allowTieBreaker && majorityThreshold === selectedTotal ? (
              <span className="line-clamp-1 text-emerald-600 dark:text-emerald-400">
                {i("header.tieBreakingMajority")}
              </span>
            ) : (total % 2 === 0 ? total / 2 + 1 : Math.ceil(total / 2)) <=
              selectedTotal ? (
              <span className="line-clamp-1 text-violet-600 dark:text-violet-400">
                {selectedTotal - majorityThreshold + (allowTieBreaker ? 0 : 1)}{" "}
                {selectedTotal -
                  majorityThreshold +
                  (allowTieBreaker ? 0 : 1) ===
                1
                  ? i("header.seat")
                  : i("header.seats")}{" "}
                {i("header.majority")}
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">{`${
                majorityThreshold - selectedTotal
              } ${
                majorityThreshold - selectedTotal === 1
                  ? i("header.seat")
                  : i("header.seats")
              } ${i("header.left")}
                        `}</span>
            )}
          </p>
          <div
            className="relative flex items-center justify-center"
            title={`${
              total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)
            } ${i("header.seatsForMajority")}`}
          >
            <CaretDownIcon />
            <p className="absolute left-5 rtl:right-5">
              {total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)}{" "}
            </p>
          </div>
          <div className="flex flex-1 justify-end text-end">
            <p className="tabular-nums">
              <span className="font-semibold">{selectedTotal}</span> / {total}
            </p>
          </div>
        </div>
        <div
          className="relative flex h-4 overflow-hidden rounded-lg bg-gray-200 transition-all dark:bg-gray-700"
          dir={sortBy === "position" ? "ltr" : ""}
        >
          {parties
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party, index) => (
              <div
                key={index}
                title={`${
                  party.isIndependent
                    ? party.shortName.length > 0
                      ? party.shortName + " (I)"
                      : "Independent"
                    : party.shortName
                } (${party.seats})`}
                style={{
                  backgroundColor: party.colour,
                  minWidth: "0%",
                  width: selectedParties.includes(party)
                    ? `${(party.seats / total) * 100}%`
                    : "0%",
                }}
                className={`r-0 h-full overflow-hidden text-ellipsis text-nowrap transition-[width] duration-300`}
              ></div>
            ))}
          <div className="bg-background-elevated absolute left-[calc(50%-1px)] h-full border-l-2 border-dashed border-violet-500"></div>
        </div>
      </div>
    </>
  );
}
