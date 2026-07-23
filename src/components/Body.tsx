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

import { useEffect } from "react";
import { countries } from "@/data/countries";
import { sort } from "@/utils/sort";
import {
  useSelectedParties,
  useIsEditMode,
  useParties,
  useSortBy,
  useI18n,
  useSelectedCountry,
} from "@/lib/zustandStore";
import {
  PartyButton,
  AllowTieBreakerButton,
  SwitchViewModeButton,
  SortButton,
  CoalitionBySpectrumButtons,
  AddNewPartyButton,
  SeatsGraph,
  CountryListDropdown,
  JsonShareExportButton,
  JsonShareImportButton,
  PieChart,
} from "@/components/ui/app";

const Seats = () => {
  const { parties, setParties } = useParties();
  const { selectedParties, setSelectedParties } = useSelectedParties();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { i, setLocale } = useI18n();
  const { setSelectedCountry } = useSelectedCountry();

  useEffect(() => {
    const queryParams = new URLSearchParams(document.location.search);
    const countryName = queryParams.get("country");
    const lang = queryParams.get("lang");
    const country = countries.find((country) => country.name === countryName);
    if (country) {
      setSelectedCountry(country);
      setParties(country.parties);
      setSelectedParties(country.parties);
    } else {
      const country = countries.find(
        (country) => country.name === "European Union",
      );
      if (country) {
        setSelectedCountry(country);
        setParties(country.parties);
        setSelectedParties(country.parties);
      }
    }

    if (lang && ["en", "fr", "de", "nl"].includes(lang)) {
      setLocale(lang);
    }
  }, [setLocale, setParties, setSelectedCountry, setSelectedParties]);

  return (
    <div>
      <div className="mt-4 block lg:hidden">
        <CountryListDropdown />
      </div>
      <div className="relative z-12 mt-4 -mb-[calc(env(safe-area-inset-top))] aspect-2/1 h-full w-full">
        <PieChart
          parties={parties}
          selectedParties={[...selectedParties]}
          isEditMode={isEditMode}
          sortBy={sortBy}
        />
        {parties.length > 0 && (
          <div className="absolute top-px left-0 flex h-full w-full items-start justify-center">
            <div className="bg-background-elevated absolute left-[calc(50%-1px)] h-[64.5%] border-l-2 border-dashed border-white"></div>
          </div>
        )}
      </div>
      <div className="sticky top-0 z-10 mx-auto w-full">
        <SeatsGraph />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <AllowTieBreakerButton />
        <SortButton />
        <SwitchViewModeButton />
      </div>
      <>
        <ul
          className={`xs:grid-cols-2 grid grid-cols-1 gap-4 transition-all sm:grid-cols-3 sm:gap-4 md:grid-cols-4`}
        >
          {[...parties]
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party) => (
              <li key={party.id}>
                <PartyButton party={party} />
              </li>
            ))}
          {isEditMode && (
            <li className="flex h-full w-full items-center justify-center">
              <AddNewPartyButton />
            </li>
          )}
        </ul>
      </>
      {parties.length <= 0 && !isEditMode && (
        <p className="text-center">{i("body.noParties")}</p>
      )}

      {/* <p className="flex-1 text-sm opacity-75 ">
          Simulation Controls
        </p> */}

      <CoalitionBySpectrumButtons />

      {/* <p className="flex-1 text-sm opacity-75 mt-2">
          Data Management
        </p> */}
      <span className="mt-4 flex w-full items-center justify-start gap-2 text-sm font-semibold text-nowrap text-zinc-900 opacity-75 dark:text-white">
        {i("buttons.dataManagement")}
      </span>
      <div className="mt-1 flex flex-wrap gap-2 overflow-auto rounded-2xl bg-zinc-200 p-4 dark:bg-zinc-700">
        <div className="flex w-full flex-row flex-wrap gap-2">
          <JsonShareImportButton />
          <JsonShareExportButton />
        </div>
        <button
          onClick={() => {
            const shouldClear = window.confirm(
              "Are you sure you want to clear all data?",
            );

            if (!shouldClear) return;

            setParties([]);
            setSelectedParties([]);
            setSelectedCountry(null);
          }}
          className="w-full flex-1 rounded-full border-2 border-transparent bg-white py-1 text-rose-600 transition-colors duration-300 hover:bg-rose-600 hover:text-white dark:bg-zinc-900 dark:text-rose-500"
        >
          <span className="line-clamp-1 flex items-center justify-center gap-1 text-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clipRule="evenodd"
              />
            </svg>

            {i("buttons.clear")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Seats;
