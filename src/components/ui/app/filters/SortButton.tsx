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

import { useSortBy, useI18n } from "@/lib/zustandStore";

export default function SortButton() {
  const { sortBy, setSortBy } = useSortBy();
  const { i } = useI18n();
  const sortButtonConfigs = [
    {
      id: "name",
      label: i("body.name"),
      sortByKey: "name",
      title: "Sort by Name",
    },
    {
      id: "position",
      label: i("body.position"),
      sortByKey: "position",
      title: "Sort by Political Position",
    },
    {
      id: "seats",
      label: i("body.seats"),
      sortByKey: "seats",
      title: "Sort by Seats",
    },
  ] as {
    id: string;
    label: string;
    sortByKey: "name" | "position" | "seats";
    title: string;
  }[];

  return (
    <>
      <div className="relative order-3 flex w-full overflow-x-auto overflow-y-hidden rounded-full border-2 border-transparent bg-zinc-200 whitespace-nowrap md:order-2 md:w-2/5 dark:bg-zinc-700">
        <div
          className={`absolute top-0 left-0 z-2 h-full w-1/3 rounded-full bg-violet-600 transition-transform duration-300 dark:bg-violet-600 ${
            sortBy === sortButtonConfigs[0].sortByKey
              ? "translate-x-0"
              : sortBy === sortButtonConfigs[1].sortByKey
                ? "translate-x-full"
                : "translate-x-[200%]"
          }`}
        ></div>
        {sortButtonConfigs.map((config) => (
          <button
            key={config.id}
            onClick={() => setSortBy(config.sortByKey)}
            className={`${
              sortBy === config.sortByKey ? "text-white" : ""
            } z-4 flex flex-1 items-center justify-center px-3 py-0.75 text-center text-sm transition-colors duration-300`}
            title={config.title}
          >
            {config.label}
          </button>
        ))}
      </div>
    </>
  );
}
