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
  useI18n,
} from "@/lib/zustandStore";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

export default function JsonShareButton() {
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { setSelectedCountry } = useSelectedCountry();
  const { i } = useI18n();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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
          alert(i("dialogs.invalidImportFormat"));
          return;
        }

        setParties(parsedData);
        setSelectedParties(parsedData);
        setSelectedCountry(null);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert(i("dialogs.invalidImportParse"));
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleImportClick}
        className={`w-full flex-1 rounded-full border-2 border-transparent bg-white px-3 py-1 text-nowrap transition-colors hover:bg-zinc-700 hover:text-white dark:bg-zinc-900 dark:hover:bg-zinc-200 dark:hover:text-zinc-950`}
      >
        <span className="line-clamp-1 flex items-center justify-center gap-1 text-nowrap">
          <ArrowDownTrayIcon className="size-5 shrink-0" />
          {i("buttons.importParties")}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        onChange={handleFileChange}
      />
    </>
  );
}
