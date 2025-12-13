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
      <div className="order-2 flex flex-1 select-none items-center justify-end gap-2 sm:order-3">
        <span
          title={"Switch to View Mode"}
          className="cursor-default select-none"
          onClick={() => setIsEditMode(false)}
        >
          {i("body.view")}
        </span>
        <div
          onClick={() => setIsEditMode(!isEditMode)}
          className={`relative flex h-6 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700`}
          title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
        >
          <div
            className={`h-full w-6 rounded-full bg-violet-600 transition-all dark:bg-violet-400 ${
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
