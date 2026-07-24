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
import { AdjustmentsHorizontalIcon, EyeIcon } from "@heroicons/react/16/solid";

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
          className={`relative box-content flex h-6 w-12 rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-700`}
          title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
        >
          <div className="absolute z-2 flex h-full w-full items-center justify-around transition-transform duration-300">
            <EyeIcon
              className={`size-4 ${!isEditMode ? "text-white dark:text-slate-950" : ""}`}
            />
            <AdjustmentsHorizontalIcon
              className={`size-4 ${isEditMode ? "text-white dark:text-slate-950" : ""}`}
            />
          </div>
          <div
            className={`h-full w-6 rounded-full bg-slate-700 transition-all dark:bg-slate-200 ${
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
