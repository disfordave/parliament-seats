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

import { useIsEditMode, useI18n } from "@/lib/zustandStore";

export default function SwitchViewModeButton() {
  const { isEditMode, setIsEditMode } = useIsEditMode();
  const { i } = useI18n();
  return (
    <>
      <div className="order-2 flex flex-1 items-center justify-end gap-2 select-none md:order-3">
        <span
          title={"Switch to View Mode"}
          className="cursor-default select-none"
          onClick={() => setIsEditMode(false)}
        >
          {i("body.view")}
        </span>
        <div
          onClick={() => setIsEditMode(!isEditMode)}
          className={`relative box-content flex h-6 w-12 rounded-full border-2 border-transparent bg-zinc-200 dark:bg-zinc-700`}
          title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
        >
          <div className="absolute z-2 flex h-full w-full items-center justify-around transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className={`size-4 ${!isEditMode ? "text-white" : ""}`}
            >
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path
                fillRule="evenodd"
                d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                clipRule="evenodd"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className={`size-4 ${isEditMode ? "text-white" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className={`h-full w-6 rounded-full bg-violet-600 transition-all ${
              isEditMode ? "translate-x-full rtl:-translate-x-full" : ""
            }`}
          ></div>
        </div>
        <span
          title="Switch to Edit Mode"
          className="cursor-default select-none"
          onClick={() => setIsEditMode(true)}
        >
          {i("body.edit")}
        </span>
      </div>
    </>
  );
}
