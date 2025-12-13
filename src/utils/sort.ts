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

import { IsEditModeState, Party, SortByState } from "@/types";

export const sort = (
  a: Party,
  b: Party,
  isEditMode: IsEditModeState["isEditMode"],
  sortBy: SortByState["sortBy"],
) => {
  if (isEditMode) return 0; // Stop sorting if edit mode is on
  if (sortBy === "name") {
    const aIsIndependent = a.isIndependent === true;
    const bIsIndependent = b.isIndependent === true;

    // If both are independent, maintain original order
    if (aIsIndependent && bIsIndependent) return 0;

    // If only a is independent, push it to the end
    if (aIsIndependent) return 1;

    // If only b is independent, push it to the end
    if (bIsIndependent) return -1;

    return a.shortName.localeCompare(b.shortName);
  }
  if (sortBy === "seats") {
    const aIsIndependent = a.isIndependent === true;
    const bIsIndependent = b.isIndependent === true;

    // If both are independent, maintain original order
    if (aIsIndependent && bIsIndependent) return 0;

    // If only a is independent, push it to the end
    if (aIsIndependent) return 1;

    // If only b is independent, push it to the end
    if (bIsIndependent) return -1;

    if (a.seats === b.seats) {
      // If seats are equal, sort by name
      return a.shortName.localeCompare(b.shortName);
    }

    // If neither is independent, sort by seats in descending order
    return b.seats - a.seats;
  }
  if (sortBy === "position") return a.position - b.position;
  return 0;
};
