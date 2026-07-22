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

import { useParties, useSelectedParties, useI18n } from "@/lib/zustandStore";

interface ButtonConfig {
  id: string;
  label: string;
  onClick: () => void;
}

export default function CoalitionBySpectrumButtons() {
  const { parties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { i } = useI18n();
  const buttonConfigurations: ButtonConfig[] = [
    {
      id: "selectAll",
      label: i("controls.selectAll"),
      onClick: () => setSelectedParties([...parties]),
    },
    {
      id: "deselectAll",
      label: i("controls.deselectAll"),
      onClick: () => setSelectedParties([]),
    },
    {
      id: "left",
      label: i("controls.left"),
      onClick: () => {
        const leftParties = parties.filter((party) => party.position < 0);
        setSelectedParties(leftParties);
      },
    },
    {
      id: "right",
      label: i("controls.right"),
      onClick: () => {
        const rightParties = parties.filter((party) => party.position > 0);
        setSelectedParties(rightParties);
      },
    },
    {
      id: "leftWithoutFarLeft",
      label: i("controls.leftWithoutFarLeft"),
      onClick: () => {
        const leftParties = parties.filter(
          (party) => party.position < 0 && party.position > -100,
        );
        setSelectedParties(leftParties);
      },
    },
    {
      id: "rightWithoutFarRight",
      label: i("controls.rightWithoutFarRight"),
      onClick: () => {
        const rightParties = parties.filter(
          (party) => party.position > 0 && party.position < 100,
        );
        setSelectedParties(rightParties);
      },
    },
    {
      id: "leftWing",
      label: i("controls.leftWing"),
      onClick: () => {
        const leftParties = parties.filter((party) => party.position <= -75);
        setSelectedParties(leftParties);
      },
    },
    {
      id: "rightWing",
      label: i("controls.rightWing"),
      onClick: () => {
        const rightParties = parties.filter((party) => party.position >= 75);
        setSelectedParties(rightParties);
      },
    },
    {
      id: "centre",
      label: i("controls.centre"),
      onClick: () => {
        const centerParties = parties.filter(
          (party) =>
            party.position <= 25 &&
            party.position >= -25 &&
            !party.isIndependent,
        );
        setSelectedParties(centerParties);
      },
    },
    {
      id: "grandCentre",
      label: i("controls.grandCentre"),
      onClick: () => {
        const centerParties = parties.filter(
          (party) =>
            party.position < 75 && party.position > -75 && !party.isIndependent,
        );
        setSelectedParties(centerParties);
      },
    },
    {
      id: "grandWithoutExtremes",
      label: i("controls.grandWithoutExtremes"),
      onClick: () => {
        const grandParties = parties.filter(
          (party) =>
            party.position > -100 &&
            party.position < 100 &&
            !party.isIndependent,
        );
        setSelectedParties(grandParties);
      },
    },
  ];

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2 overflow-auto rounded-2xl bg-zinc-200 p-4 dark:bg-zinc-700">
        {buttonConfigurations.map((buttonConfig) => (
          <button
            key={buttonConfig.id}
            onClick={buttonConfig.onClick}
            className="rounded-full border-2 border-transparent bg-white px-3 py-1 text-nowrap transition-colors hover:bg-violet-600 hover:text-white dark:bg-zinc-900 dark:hover:bg-violet-600"
            type="button"
            title={buttonConfig.label}
            aria-label={buttonConfig.label}
            aria-describedby={buttonConfig.label}
            aria-disabled={false}
          >
            {buttonConfig.label}
          </button>
        ))}
      </div>
    </>
  );
}
