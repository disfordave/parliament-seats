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

import { Parliament, ParliamentInfo } from "@/types";

// A sample's name in the current language. The English name in the data stays
// its identifier, for links and for languages that have no name for it
export function getParliamentName(
  parliament: Parliament,
  i: (key: string) => string,
) {
  const key = `parliamentNames.${parliament.name}`;
  const name = i(key);
  // i() gives back the key when there is no translation
  return name === key ? parliament.name : name;
}

// The name and date line shown above a chart
export function getParliamentTitle(
  selectedParliament: Parliament | null,
  customInfo: ParliamentInfo,
  i: (key: string) => string,
) {
  const title = selectedParliament
    ? getParliamentName(selectedParliament, i)
    : customInfo.name;
  const { updateDate } = selectedParliament ?? customInfo;
  const dateLabel = selectedParliament
    ? i("body.sampleDataUpdatedAt")
    : i("body.dataUpdatedAt");
  const subtitle = updateDate
    ? `${dateLabel}: ${new Date(updateDate).toLocaleDateString(i("locale"), {
        timeZone: "UTC",
      })}`
    : "";

  return { title, subtitle };
}
