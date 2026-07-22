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
      <div className="-mb-2 aspect-video h-full w-full md:-mb-4">
        <PieChart
          parties={parties}
          selectedParties={selectedParties}
          isEditMode={isEditMode}
          sortBy={sortBy}
        />
      </div>
      <div className="sticky top-0 z-10 mx-auto w-[calc(100%-2rem)]">
        <SeatsGraph />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <AllowTieBreakerButton />
        <SortButton />
        <SwitchViewModeButton />
      </div>
      <>
        <ul
          className={`grid grid-cols-1 gap-4 transition-all xs:grid-cols-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4`}
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
      <CoalitionBySpectrumButtons />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => {
            setParties([]);
            setSelectedParties([]);
            setSelectedCountry(null);
          }}
          className="w-full flex-1 rounded-2xl border-2 border-zinc-200 bg-white p-2 transition-colors duration-300 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 hover:dark:bg-zinc-700"
        >
          {i("buttons.clear")}
        </button>
        <JsonShareExportButton />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <JsonShareImportButton />
      </div>
    </div>
  );
};

export default Seats;
