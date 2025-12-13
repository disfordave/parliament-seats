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
    { label: i("body.name"), sortByKey: "name", title: "Sort by Name" },
    {
      label: i("body.position"),
      sortByKey: "position",
      title: "Sort by Political Position",
    },
    { label: i("body.seats"), sortByKey: "seats", title: "Sort by Seats" },
  ] as {
    label: string;
    sortByKey: "name" | "position" | "seats";
    title: string;
  }[];

  return (
    <>
      <div className="order-3 flex w-full overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-lg sm:order-2 sm:w-auto">
        {sortButtonConfigs.map((config, index) => (
          <button
            key={index}
            onClick={() => setSortBy(config.sortByKey)}
            className={`${
              sortBy === config.sortByKey
                ? "bg-violet-600 text-white dark:bg-violet-400 dark:text-gray-950"
                : "bg-gray-200 dark:bg-gray-700"
            } flex-1 px-2 py-1 transition-colors`}
            title={config.title}
          >
            {config.label}
          </button>
        ))}
      </div>
    </>
  );
}
