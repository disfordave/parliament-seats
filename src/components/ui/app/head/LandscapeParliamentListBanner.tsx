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

import { parliaments } from "@/data/parliaments";
import {
  useI18n,
  useSelectedParliament,
  useParties,
  useSelectedParties,
  useCustomInfo,
} from "@/lib/zustandStore";
import { Parliament } from "@/types";

export default function LandscapeParliamentListBanner() {
  const { i } = useI18n();
  const { selectedParliament, setSelectedParliament } = useSelectedParliament();
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { customInfo, setCustomInfo } = useCustomInfo();
  return (
    <>
      <div className="sticky top-4 z-100 h-[80vh] w-full overflow-auto rounded-2xl border-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="p-2 text-xl font-semibold">{i("header.parliaments")}</h2>
        <ul>
          <li>
            <span className="px-2 py-1 text-sm opacity-75">
              {i("header.custom")}
            </span>
            <ul>
              <li>
                <button
                  onClick={() => {
                    if (selectedParliament) {
                      setSelectedParliament(null);
                      setParties([]);
                      setSelectedParties([]);
                      setCustomInfo({ name: "", updateDate: "" });
                    }
                  }}
                  className={`flex w-full flex-col items-start p-2 text-start transition-colors duration-300 ${
                    !selectedParliament
                      ? "bg-zinc-200 dark:bg-zinc-700"
                      : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <div className="line-clamp-1 flex gap-1">
                    <span>
                      {(!selectedParliament && customInfo.name) ||
                        i("header.custom")}
                    </span>
                  </div>
                  {!selectedParliament && customInfo.updateDate && (
                    <p className="text-xs opacity-75">
                      {i("body.dataUpdatedAt")}:{" "}
                      {new Date(customInfo.updateDate).toLocaleDateString(
                        i("locale"),
                        { timeZone: "UTC" },
                      )}
                    </p>
                  )}
                </button>
              </li>
            </ul>
          </li>
          <li>
            <span className="px-2 py-1 text-sm opacity-75">
              {i("header.sampleParliaments")}
            </span>
            <ul>
              {[...parliaments]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((parliament) => (
                  <li
                    key={parliament.name}
                    value={parliament.name}
                    id={parliament.name}
                  >
                    <button
                      onClick={() => {
                        function select(parliament: Parliament) {
                          setSelectedParliament(parliament);
                          const findParliament = parliaments.find(
                            (c) => c.name === parliament.name,
                          );
                          if (findParliament) {
                            setParties(findParliament.parties);
                            setSelectedParties(findParliament.parties);
                          } else {
                            setSelectedParliament(null);
                            setParties([]);
                            setSelectedParties([]);
                          }
                        }

                        select(parliament);
                      }}
                      className={`flex w-full flex-col items-start p-2 text-start transition-colors duration-300 ${
                        selectedParliament === parliament
                          ? "bg-zinc-200 dark:bg-zinc-700"
                          : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <div className="line-clamp-1 flex gap-1">
                        <span>{parliament.name}</span>
                        <span>{parliament.emoji}</span>
                      </div>
                      {/* {selectedParliament === parliament && ( */}
                      <p className="text-xs opacity-75">
                        {i("body.sampleDataUpdatedAt")}:{" "}
                        {new Date(parliament.updateDate).toLocaleDateString(
                          i("locale"),
                          { timeZone: "UTC" },
                        )}
                      </p>
                      {/* )} */}
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
