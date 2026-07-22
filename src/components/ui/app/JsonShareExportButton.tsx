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
          const data = JSON.stringify(parties);
          const blob = new Blob([data], { type: "text/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "parties.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="line-clamp-1 w-full flex-1 rounded-full border-2 border-transparent bg-white py-1 transition-colors duration-300 hover:bg-violet-600 hover:text-white dark:bg-zinc-900"
        type="button"
        title="Export Parties"
        aria-label="Export Parties"
        aria-disabled={false}
      >
        {i("buttons.exportParties")}
      </button>
    </>
  );
}
