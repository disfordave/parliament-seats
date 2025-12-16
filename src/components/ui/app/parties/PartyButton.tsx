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
  useSelectedParties,
  useIsEditMode,
  useParties,
  useI18n,
} from "@/lib/zustandStore";

import { Party } from "@/types";
import { TrashIcon } from "@/components/icons/Icons";
import { getPosition } from "@/utils/getPosition";

export default function PartyButton({ party }: { party: Party }) {
  const { isEditMode } = useIsEditMode();
  const { parties, setParties } = useParties();
  const { selectedParties, setSelectedParties } = useSelectedParties();

  const selected = selectedParties.includes(party);
  //   const colour = party.isIndependent ? "#6B7280" : party.colour;
  const colour = party.colour;
  const partyName = party.isIndependent
    ? party.shortName.length > 0
      ? party.shortName + " (I)"
      : "Independent"
    : party.shortName;

  const shortDesc = `${partyName} (${party.seats})`;
  const { i } = useI18n();
  return (
    <button
      onClick={() => {
        if (isEditMode) return;
        if (selected) {
          setSelectedParties(selectedParties.filter((p) => p !== party));
        } else {
          setSelectedParties([...selectedParties, party]);
        }
      }}
      className={`${
        isEditMode ? "" : "cursor-pointer"
      } party-button flex w-full items-center gap-2 overflow-hidden rounded-lg border-2 bg-white p-2 shadow-md transition-all duration-300 dark:bg-gray-900`}
      style={{
        borderColor: selected ? colour : "var(--border-colour)", // dark mode #374151
        flexDirection: isEditMode ? "column" : "row",
      }}
      title={
        isEditMode
          ? ""
          : selected
            ? `Deselect ${shortDesc}`
            : `Select ${shortDesc}`
      }
      // disabled={isEditMode}
    >
      <div
        className={`relative ${
          isEditMode ? "flex w-full items-center justify-center" : ""
        }`}
      >
        {isEditMode && (
          <input
            name="partyColour"
            type="color"
            title="Party Colour"
            aria-label="Party Colour"
            className="absolute w-full cursor-pointer opacity-0"
            value={colour}
            onChange={(e) => {
              const newParty = { ...party, colour: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p)),
                );
              }
            }}
          />
        )}
        <div
          className={`transition-all ${
            isEditMode
              ? "h-6 w-full rounded-full border border-gray-200 dark:border-gray-700"
              : "aspect-square size-4 rounded-full"
          }`}
          style={{ backgroundColor: colour }}
        ></div>
      </div>
      <span className={isEditMode ? "w-full" : "truncate"}>
        {isEditMode ? (
          <input
            name="partyName"
            type="text"
            placeholder="Party Name"
            className="w-full border-b border-gray-200 bg-transparent outline-none dark:border-gray-700"
            value={party.name}
            onChange={(e) => {
              const newParty = { ...party, name: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p)),
                );
              }
            }}
          />
        ) : (
          partyName
        )}
      </span>

      {isEditMode && (
        <span className={isEditMode ? "w-full" : "truncate"}>
          <input
            name="partyShortName"
            type="text"
            placeholder="Party Short Name"
            className="w-full border-b border-gray-200 bg-transparent outline-none dark:border-gray-700"
            value={party.shortName}
            onChange={(e) => {
              const newParty = { ...party, shortName: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p)),
                );
              }
            }}
          />
        </span>
      )}

      <span
        className={`font-semibold ${isEditMode ? "w-full" : "text-nowrap"}`}
      >
        {isEditMode ? (
          <input
            name="seats"
            type="number"
            placeholder="Seats"
            className="w-full border-b border-gray-200 bg-transparent outline-none dark:border-gray-700"
            min={0}
            max={99999}
            value={party.seats.toFixed(0)}
            onChange={(e) => {
              const newParty = { ...party, seats: parseInt(e.target.value) };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p)),
                );
              }

              if (e.target.value.length <= 0) {
                const newParty = { ...party, seats: 0 };
                setParties(parties.map((p) => (p === party ? newParty : p)));
                if (selected) {
                  setSelectedParties(
                    selectedParties.map((p) => (p === party ? newParty : p)),
                  );
                }
              }
            }}
          />
        ) : (
          party.seats
        )}
      </span>
      {isEditMode ? (
        <>
          <div className="flex w-full">
            <label className="flex w-full flex-col items-center gap-2">
              <input
                name="position"
                dir="ltr"
                id="position-range"
                step={25}
                className="w-full appearance-none rounded-full bg-gray-200 dark:bg-gray-700"
                type="range"
                min="-100"
                max="100"
                value={party.position}
                onChange={(e) => {
                  const newParty = {
                    ...party,
                    position: parseInt(e.target.value),
                  };
                  setParties(parties.map((p) => (p === party ? newParty : p)));
                  if (selected) {
                    setSelectedParties(
                      selectedParties.map((p) => (p === party ? newParty : p)),
                    );
                  }
                }}
              />
              <span className="text-center">
                {getPosition(party.position, i).full}
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="isIndependent"
                value={party.isIndependent ? "1" : "0"}
                checked={party.isIndependent}
                onChange={(e) => {
                  const newParty = {
                    ...party,
                    isIndependent: e.target.checked,
                  };
                  setParties(parties.map((p) => (p === party ? newParty : p)));
                  if (selected) {
                    setSelectedParties(
                      selectedParties.map((p) => (p === party ? newParty : p)),
                    );
                  }
                }}
              />
              <span className="select-none">{i("spectrum.independent")}</span>
            </label>
          </div>
          <div className="flex w-full items-center justify-evenly gap-2">
            <button
              onClick={() => {
                if (selected) {
                  setSelectedParties(
                    selectedParties.filter((p) => p !== party),
                  );
                } else {
                  setSelectedParties([...selectedParties, party]);
                }
              }}
              className={`transition-opacity hover:opacity-75`}
              type="button"
              title={selected ? "Deselect party" : "Select party"}
              aria-label={selected ? "Deselect party" : "Select party"}
            >
              {selected ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                setParties(parties.filter((p) => p !== party));
                if (selected) {
                  setSelectedParties(
                    selectedParties.filter((p) => p !== party),
                  );
                }
              }}
              type="button"
              className={`transition-opacity hover:opacity-75`}
              title="Remove party"
              aria-label="Remove party"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      ) : (
        // <span className="text-nowrap font-mono">
        //   {`[${getPosition(party.position).short}]`}
        // </span>
        <></>
      )}
    </button>
  );
}
