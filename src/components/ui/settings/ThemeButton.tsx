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

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/zustandStore";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";

type Theme = "light" | "dark" | "auto";

export default function ThemeButton() {
  const { i } = useI18n();
  const [theme, setTheme] = useState<Theme>(
    (localStorage.theme as Theme) || "auto",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme =
        theme === "auto" ? (mediaQuery.matches ? "dark" : "light") : theme;

      document.documentElement.classList.toggle(
        "dark",
        effectiveTheme === "dark",
      );
    };

    applyTheme();

    if (theme === "auto") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = theme;
    }
  }, [theme]);

  const themes = [
    {
      value: "auto",
      label: i("appearance.auto"),
      icon: <ComputerDesktopIcon className="size-5" />,
    },
    {
      value: "light",
      label: i("appearance.light"),
      icon: <SunIcon className="size-5" />,
    },
    {
      value: "dark",
      label: i("appearance.dark"),
      icon: <MoonIcon className="size-5" />,
    },
  ];

  return (
    <>
      <div className="relative flex h-full items-center justify-center rounded-full border-2 border-transparent bg-white dark:bg-zinc-900">
        <div
          className={`absolute top-0 left-0 z-2 h-full w-1/3 rounded-full bg-zinc-700 transition-transform duration-300 dark:bg-zinc-200 ${
            theme === themes[0].value
              ? "translate-x-0"
              : theme === themes[1].value
                ? "translate-x-full"
                : "translate-x-[200%]"
          }`}
        ></div>
        {themes.map((t) => (
          <div className="z-4" key={t.value}>
            <button
              onClick={() => setTheme(t.value as Theme)}
              title={t.label}
              className={`flex aspect-square size-full items-center justify-center rounded-full p-1.5 transition-colors duration-300 ${
                t.value === theme
                  ? "text-white dark:text-zinc-950"
                  : "dark:text-white"
              }`}
            >
              {t.icon}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
