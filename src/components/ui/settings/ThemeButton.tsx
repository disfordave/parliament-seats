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

import { useI18n } from "@/lib/zustandStore";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import { ThemeToggle } from "themeflip";

export default function ThemeButton() {
  const { i } = useI18n();

  return (
    <>
      <ThemeToggle
        addDarkClass
        className="relative flex h-full items-center justify-center rounded-full border-2 border-transparent bg-white dark:bg-zinc-900"
        indicatorClassName="
    absolute top-0 left-0 z-0 h-full w-1/3
    rounded-full bg-zinc-700
    transition-transform duration-300
    dark:bg-zinc-200
    data-[theme=auto]:translate-x-0
    data-[theme=light]:translate-x-full
    data-[theme=dark]:translate-x-[200%]
  "
        buttonClassName="
    relative z-10 flex aspect-square size-full
    items-center justify-center rounded-full p-1.5
    transition-colors duration-300
    
  "
        activeButtonClassName="
    text-white dark:text-zinc-950
  "
        auto={{
          label: i("appearance.auto"),
          icon: <ComputerDesktopIcon className="size-5" />,
        }}
        light={{
          label: i("appearance.light"),
          icon: <SunIcon className="size-5" />,
        }}
        dark={{
          label: i("appearance.dark"),
          icon: <MoonIcon className="size-5" />,
        }}
      />
    </>
  );
}
