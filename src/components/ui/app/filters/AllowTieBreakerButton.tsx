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

import { useAllowTieBreaker, useI18n } from "@/lib/zustandStore";

export default function AllowTieBreakerButton() {
  const { allowTieBreaker, setAllowTieBreaker } = useAllowTieBreaker();
  const { i } = useI18n();

  return (
    <>
      <div className="flex-1 justify-start text-nowrap sm:w-auto">
        <label className="flex items-center gap-2">
          <span className="relative">
            <input
              title="Allow Tie Breaker"
              type="checkbox"
              name="allowTieBreaker"
              id="allowTieBreaker"
              className="absolute h-full w-full opacity-0"
              checked={allowTieBreaker}
              onChange={() => {
                setAllowTieBreaker(!allowTieBreaker);
              }}
            />
            <div
              role="checkbox"
              aria-label={"Allow Tie Breaker"}
              aria-checked={allowTieBreaker}
              className={`${
                allowTieBreaker
                  ? "bg-violet-600 dark:bg-violet-400"
                  : "bg-gray-200 dark:bg-gray-700"
              } flex aspect-square size-6 items-center justify-center overflow-hidden rounded-full transition-colors`}
            >
              {allowTieBreaker ? (
                <div className="flex h-full w-full items-center justify-center text-white dark:text-gray-950">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-white dark:bg-gray-700 dark:text-gray-950"></div>
              )}
            </div>
          </span>
          <span className="select-none text-wrap">
            {i("body.allowTieBreaker")}
          </span>
        </label>
      </div>
    </>
  );
}
