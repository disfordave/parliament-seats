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
  return (
    <>
      <input
        type="file"
        accept=".json"
        className="block w-full cursor-pointer overflow-hidden rounded-2xl border-2 bg-white transition-colors duration-300 file:me-4 file:rounded-s-[14px] file:bg-zinc-200 file:px-4 file:py-2 hover:bg-zinc-200 hover:file:bg-zinc-200 dark:bg-zinc-900 dark:file:bg-zinc-700 dark:hover:bg-zinc-700 dark:hover:file:bg-zinc-700"
        title="Import Parties"
        aria-label="Import Parties"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target?.result;
            if (!data) return;

            try {
              const parsedData = JSON.parse(data as string);

              // Check if parsedData is an array and conforms to Party structure
              if (
                Array.isArray(parsedData) &&
                parsedData.every(
                  (item) =>
                    typeof item.name === "string" &&
                    typeof item.shortName === "string" &&
                    typeof item.seats === "number" &&
                    typeof item.colour === "string" &&
                    typeof item.position === "number" &&
                    (typeof item.isIndependent === "boolean" ||
                      item.isIndependent === undefined),
                )
              ) {
                setParties(parsedData as Party[]);
                setSelectedParties(parsedData as Party[]);
                setSelectedCountry(null);
              } else {
                console.error("Uploaded JSON file has an incorrect format");
                alert(
                  "The uploaded file has an incorrect format. Please upload a valid JSON file.",
                );
              }
            } catch (error) {
              console.error("Error parsing JSON file:", error);
              alert(
                "Failed to parse the JSON file. Please ensure it's in the correct format.",
              );
            }
          };
          reader.readAsText(file);
        }}
      />
    </>
  );
}
