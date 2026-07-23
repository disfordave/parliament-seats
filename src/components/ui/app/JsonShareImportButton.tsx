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

import { Party } from "@/types";
import {
  useSelectedParties,
  useParties,
  useSelectedCountry,
} from "@/lib/zustandStore";

export default function JsonShareButton() {
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { setSelectedCountry } = useSelectedCountry();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const data = readerEvent.target?.result;
      if (typeof data !== "string") return;

      try {
        const parsedData: unknown = JSON.parse(data);

        const isValid =
          Array.isArray(parsedData) &&
          parsedData.every(
            (item): item is Party =>
              typeof item === "object" &&
              item !== null &&
              typeof item.name === "string" &&
              typeof item.shortName === "string" &&
              typeof item.seats === "number" &&
              typeof item.colour === "string" &&
              typeof item.position === "number" &&
              (typeof item.isIndependent === "boolean" ||
                item.isIndependent === undefined),
          );

        if (!isValid) {
          alert(
            "The uploaded file has an incorrect format. Please upload a valid JSON file.",
          );
          return;
        }

        setParties(parsedData);
        setSelectedParties(parsedData);
        setSelectedCountry(null);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert(
          "Failed to parse the JSON file. Please ensure it's in the correct format.",
        );
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      <label
        htmlFor="import-data"
        className="line-clamp-1 inline-flex w-full flex-1 items-center justify-center gap-1 overflow-hidden rounded-full border-2 border-transparent bg-white py-1 text-nowrap transition-colors duration-300 hover:bg-violet-600 hover:text-white dark:bg-zinc-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5 shrink-0"
        >
          <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
          <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
        </svg>
        Import Data
      </label>
      <input
        id="import-data"
        type="file"
        accept=".json,application/json"
        className="sr-only"
        onChange={handleFileChange}
      />
    </>
  );
}
