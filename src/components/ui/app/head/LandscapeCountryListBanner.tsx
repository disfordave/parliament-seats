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

import { countries } from "@/data/countries";
import {
  useI18n,
  useSelectedCountry,
  useParties,
  useSelectedParties,
} from "@/lib/zustandStore";
import { Country } from "@/types";

export default function LandscapeCountryListBanner() {
  const { i } = useI18n();
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  return (
    <>
      <div className="sticky top-4 h-[80vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
        <h2 className="p-2 text-xl font-semibold">{i("header.countries")}</h2>
        <ul>
          <li>
            <span className="px-2 py-1 text-sm opacity-75">
              {i("header.custom")}
            </span>
            <ul>
              <li>
                <button
                  onClick={() => {
                    if (selectedCountry) {
                      setSelectedCountry(null);
                      setParties([]);
                      setSelectedParties([]);
                    }
                  }}
                  className={`w-full p-2 transition-colors duration-300 ${
                    !selectedCountry
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "bg-white hover:bg-gray-100 dark:bg-gray-900 hover:dark:bg-gray-800"
                  }`}
                >
                  <div className="flex gap-1">
                    <span>{i("header.custom")}</span>
                  </div>
                </button>
              </li>
            </ul>
          </li>
          <li>
            <span className="px-2 py-1 text-sm opacity-75">
              {i("header.sampleCountries")}
            </span>
            <ul>
              {countries
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => (
                  <li key={country.name} value={country.name} id={country.name}>
                    <button
                      onClick={() => {
                        function select(country: Country) {
                          setSelectedCountry(country);
                          const findCountry = countries.find(
                            (c) => c.name === country.name,
                          );
                          if (findCountry) {
                            setParties(findCountry.parties);
                            setSelectedParties(findCountry.parties);
                          } else {
                            setSelectedCountry(null);
                            setParties([]);
                            setSelectedParties([]);
                          }
                        }

                        select(country);
                      }}
                      className={`w-full p-2 transition-colors duration-300 ${
                        selectedCountry === country
                          ? "bg-gray-200 dark:bg-gray-700"
                          : "bg-white hover:bg-gray-100 dark:bg-gray-900 hover:dark:bg-gray-800"
                      }`}
                    >
                      <div className="line-clamp-1 flex gap-1">
                        <span>{country.name}</span>
                        <span>{country.emoji}</span>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}
