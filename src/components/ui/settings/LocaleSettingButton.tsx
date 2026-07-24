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

import { locales } from "@/i18n/i18n";
import { useI18n } from "@/lib/zustandStore";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function LocaleSettingButton() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className="relative z-100"
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        className={`flex min-w-16 items-center justify-between rounded-full border-2 border-white py-1 ps-2 pe-1 dark:border-zinc-900 ${
          isOpen ? "bg-zinc-200 dark:bg-zinc-700" : "bg-white dark:bg-zinc-900"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-start">{locale.toUpperCase()}</span>
        <ChevronDownIcon
          className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="modal"
              transition={{
                duration: 0.3,
              }}
              initial={{ opacity: 0, translateY: 2 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 2 }}
              ref={dropdownRef}
              className="absolute bottom-10 z-100 flex w-full flex-col overflow-hidden rounded-2xl border-2 border-zinc-200 shadow-xl dark:border-zinc-700"
            >
              {Object.keys(locales).map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setIsOpen(false);
                  }}
                  className={`appearance-none px-2 py-1 text-start transition-colors duration-300 ${
                    locale === loc
                      ? "bg-zinc-200 dark:bg-zinc-700"
                      : "bg-white hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
