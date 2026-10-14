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
  useSelectedParties,
  useParties,
  useSelectedParliament,
  useI18n,
  useCustomInfo,
} from "@/lib/zustandStore";
import { parliaments } from "@/data/parliaments";
import { useEffect, useRef, useState } from "react";
import { Parliament } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function ParliamentListDropdown() {
  const { selectedParliament, setSelectedParliament } = useSelectedParliament();
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { customInfo, setCustomInfo } = useCustomInfo();
  const { i } = useI18n();
  const [openParliamentList, setOpenParliamentList] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (openParliamentList && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [openParliamentList]);

  function select(parliament: Parliament) {
    setSelectedParliament(parliament);
    const findParliament = parliaments.find((c) => c.name === parliament.name);
    if (findParliament) {
      setParties(findParliament.parties);
      setSelectedParties(findParliament.parties);
    } else {
      setSelectedParliament(null);
      setParties([]);
      setSelectedParties([]);
    }
    setOpenParliamentList(false);
  }

  useEffect(() => {
    if (
      openParliamentList &&
      selectedParliament &&
      itemRefs.current[selectedParliament.name]
    ) {
      const itemRef = itemRefs.current[selectedParliament.name];
      if (itemRef) {
        itemRef.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [openParliamentList, selectedParliament]);

  return (
    <div
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpenParliamentList(false);
        }
      }}
    >
      <button
        onClick={() => {
          setOpenParliamentList(!openParliamentList);
        }}
        className={`w-full rounded-2xl border-2 border-zinc-200 p-2 pe-1 transition-colors duration-300 dark:border-zinc-700 ${
          openParliamentList
            ? "bg-zinc-200 dark:bg-zinc-700"
            : "bg-white dark:bg-zinc-900"
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          {selectedParliament ? (
            <div className="flex flex-col items-start gap-0 text-start">
              <div className="flex gap-1">
                <span>{selectedParliament.name}</span>
                <span>{selectedParliament.emoji}</span>
              </div>
              <p className="text-xs opacity-75">
                {i("body.sampleDataUpdatedAt")}:{" "}
                {new Date(selectedParliament.updateDate).toLocaleDateString(
                  i("locale"),
                  { timeZone: "UTC" },
                )}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-0 text-start">
              <span>{customInfo.name || i("header.custom")}</span>
              {customInfo.updateDate && (
                <p className="text-xs opacity-75">
                  {i("body.dataUpdatedAt")}:{" "}
                  {new Date(customInfo.updateDate).toLocaleDateString(
                    i("locale"),
                    { timeZone: "UTC" },
                  )}
                </p>
              )}
            </div>
          )}
          <ChevronDownIcon
            className={`size-5 transition-transform duration-300 ${openParliamentList ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div className="relative">
        <AnimatePresence>
          {openParliamentList && (
            <>
              <motion.div
                key="modal"
                transition={{
                  duration: 0.3,
                }}
                initial={{ opacity: 0, translateY: -8 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -2 }}
                className="absolute top-0 z-75 max-h-[50vh] w-full overflow-auto rounded-2xl border-2 border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                ref={dropdownRef}
              >
                <ul>
                  <li>
                    <span className="px-2 py-1 text-sm opacity-75">
                      {i("header.custom")}
                    </span>
                    <ul>
                      <li>
                        <button
                          onClick={() => {
                            if (selectedParliament) {
                              setSelectedParliament(null);
                              setParties([]);
                              setSelectedParties([]);
                              setCustomInfo({ name: "", updateDate: "" });
                            }
                            setOpenParliamentList(false);
                          }}
                          className={`flex w-full flex-col items-start p-2 text-start transition-colors duration-300 ${
                            !selectedParliament
                              ? "bg-zinc-200 dark:bg-zinc-700"
                              : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          }`}
                        >
                          <div className="flex gap-1">
                            <span>
                              {(!selectedParliament && customInfo.name) ||
                                i("header.custom")}
                            </span>
                          </div>
                          {!selectedParliament && customInfo.updateDate && (
                            <p className="text-xs opacity-75">
                              {i("body.dataUpdatedAt")}:{" "}
                              {new Date(
                                customInfo.updateDate,
                              ).toLocaleDateString(i("locale"), {
                                timeZone: "UTC",
                              })}
                            </p>
                          )}
                        </button>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="px-2 py-1 text-sm opacity-75">
                      {i("header.sampleParliaments")}
                    </span>
                    <ul>
                      {[...parliaments]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((parliament) => (
                          <li
                            key={parliament.name}
                            value={parliament.name}
                            id={parliament.name}
                            ref={(el) => {
                              if (el) itemRefs.current[parliament.name] = el;
                            }}
                          >
                            <button
                              onClick={() => {
                                select(parliament);
                              }}
                              className={`flex w-full flex-col items-start p-2 text-start transition-colors duration-300 ${
                                selectedParliament === parliament
                                  ? "bg-zinc-200 dark:bg-zinc-700"
                                  : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                              }`}
                            >
                              <div className="flex gap-1">
                                <span>{parliament.name}</span>
                                <span>{parliament.emoji}</span>
                              </div>
                              {/* {selectedParliament === parliament && ( */}
                              <p className="text-xs opacity-75">
                                {i("body.sampleDataUpdatedAt")}:{" "}
                                {new Date(
                                  parliament.updateDate,
                                ).toLocaleDateString(i("locale"), {
                                  timeZone: "UTC",
                                })}
                              </p>
                              {/* )} */}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
