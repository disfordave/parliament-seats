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

import {
  IsEditModeState,
  PartiesState,
  SelectedPartiesState,
  SortByState,
} from "@/types";
import { sort } from "@/utils/sort";
import { ResponsivePie } from "@nivo/pie";
import { useState, useEffect } from "react";

export default function PieChart({
  parties,
  selectedParties,
  isEditMode,
  sortBy,
}: {
  parties: PartiesState["parties"];
  selectedParties: SelectedPartiesState["selectedParties"];
  isEditMode: IsEditModeState["isEditMode"];
  sortBy: SortByState["sortBy"];
}) {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <ResponsivePie
        data={[
          ...selectedParties
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party) => ({
              id: party.name.length < 1 ? party.shortName : party.name,
              label: party.name.length < 1 ? party.shortName : party.name,
              value: party.seats,
              color: party.colour,
            })),
          {
            id: "empty",
            label: "empty",
            value:
              parties.reduce((acc, party) => acc + party.seats, 0) -
              selectedParties.reduce((acc, party) => acc + party.seats, 0),
            color: isDarkMode ? "#374151" : "#e5e7eb",
          },
        ]}
        startAngle={-90}
        endAngle={90}
        margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        sortByValue={false}
        innerRadius={0.35}
        colors={{ datum: "data.color" }}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        isInteractive={false}
        transitionMode="innerRadius"
        motionConfig="default"
      />
    </>
  );
}
