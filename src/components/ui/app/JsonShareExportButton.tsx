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
        className={`hover:bg-brand-primary dark:hover:bg-brand-primary w-full flex-1 rounded-full border-2 border-transparent bg-white px-3 py-1 text-nowrap transition-colors hover:text-white dark:bg-zinc-900`}
        type="button"
        title="Export Parties"
        aria-label="Export Parties"
      >
        <span className="line-clamp-1 flex items-center justify-center gap-1 text-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 shrink-0"
          >
            <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>

          {i("buttons.exportParties")}
        </span>
      </button>
    </>
  );
}
