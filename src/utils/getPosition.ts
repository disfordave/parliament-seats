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

export const getPosition = (position: number, i: (id: string) => string) => {
  const ranges = [
    { min: 100, max: Infinity, full: i("spectrum.farRight"), short: "RR" },
    { min: 75, max: 99, full: i("spectrum.rightWing"), short: "Rr" },
    { min: 50, max: 74, full: i("spectrum.centreRight"), short: "rr" },
    { min: 25, max: 49, full: i("spectrum.leanRight"), short: "r" },
    { min: -24, max: 24, full: i("spectrum.centre"), short: "C" },
    { min: -49, max: -25, full: i("spectrum.leanLeft"), short: "l" },
    { min: -74, max: -50, full: i("spectrum.centreLeft"), short: "ll" },
    { min: -99, max: -75, full: i("spectrum.leftWing"), short: "Ll" },
    { min: -Infinity, max: -100, full: i("spectrum.farLeft"), short: "LL" },
  ];

  const match = ranges.find(
    (range) => position >= range.min && position <= range.max,
  );

  return match || { full: "Centre", short: "C" };
};
