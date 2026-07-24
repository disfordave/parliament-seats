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

import { useParties, useI18n } from "@/lib/zustandStore";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";

export default function JsonShareButton() {
  const { parties } = useParties();
  const { i } = useI18n();
  return (
    <>
      <button
        onClick={() => {
          const shouldExport = window.confirm(
            "Are you sure you want to export the party data?",
          );

          if (!shouldExport) return;

          const data = JSON.stringify(parties, null, 2);
          const blob = new Blob([data], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = "parties.json";
          a.click();

          URL.revokeObjectURL(url);
        }}
        className={`w-full flex-1 rounded-full border-2 border-transparent bg-white px-3 py-1 text-nowrap transition-colors hover:bg-slate-700 hover:text-white dark:bg-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-950`}
        type="button"
        title="Export Parties"
        aria-label="Export Parties"
      >
        <span className="line-clamp-1 flex items-center justify-center gap-1 text-nowrap">
          <ArrowUpTrayIcon className="size-5 shrink-0" />
          {i("buttons.exportParties")}
        </span>
      </button>
    </>
  );
}
