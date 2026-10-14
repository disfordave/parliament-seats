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

import { parliaments } from "@/data/parliaments";
import {
  defaultLocale,
  translate,
  supportedLocales,
  getPathLocale,
} from "@/i18n/i18n";
import {
  DefaultParliamentValueState,
  PartiesState,
  IsEditModeState,
  SortByState,
  AllowTieBreakerState,
  MajorityThresholdState,
  SelectedPartiesState,
  SelectedParliamentState,
  I18nState,
  CustomInfoState,
  ParliamentData,
  IncludeOptions,
} from "@/types";
import { simpleMajority } from "@/utils/getMajority";
import { getParliamentName } from "@/utils/parliamentTitle";
import { create } from "zustand";

function getBrowserLocale() {
  if (typeof navigator === "undefined") return null;

  const candidates = [navigator.language, ...navigator.languages].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    const exactMatch = supportedLocales.find((locale) => locale === normalized);

    if (exactMatch) return exactMatch;

    const baseLocale = normalized.split("-")[0];
    const baseMatch = supportedLocales.find((locale) => locale === baseLocale);

    if (baseMatch) return baseMatch;
  }

  return null;
}

const useDefaultParliamentValue = create<DefaultParliamentValueState>(
  (set) => ({
    defaultParliamentValue: null,
    setDefaultParliamentValue: (by) =>
      set(() => ({ defaultParliamentValue: by })),
  }),
);

const useParties = create<PartiesState>((set) => ({
  parties: [],
  setParties: (by) => set(() => ({ parties: by })),
}));

const useSelectedParties = create<SelectedPartiesState>((set) => ({
  selectedParties: [],
  setSelectedParties: (by) => set(() => ({ selectedParties: by })),
}));

const useIsEditMode = create<IsEditModeState>((set) => ({
  isEditMode: false,
  setIsEditMode: (by) => set(() => ({ isEditMode: by })),
}));

const useSortBy = create<SortByState>((set) => ({
  sortBy: "seats",
  setSortBy: (by) => set(() => ({ sortBy: by })),
}));

const useAllowTieBreaker = create<AllowTieBreakerState>((set) => ({
  allowTieBreaker: false,
  setAllowTieBreaker: (by) => set(() => ({ allowTieBreaker: by })),
}));

const useMajorityThreshold = create<MajorityThresholdState>((set) => ({
  majorityThreshold: simpleMajority,
  setMajorityThreshold: (by) => set(() => ({ majorityThreshold: by })),
}));

const useI18n = create<I18nState>((set, get) => ({
  // A language's own page, like /de/, overrides the saved language without
  // replacing it
  locale:
    typeof window !== "undefined"
      ? (getPathLocale(window.location.pathname, import.meta.env.BASE_URL) ??
        localStorage.getItem("locale") ??
        getBrowserLocale() ??
        defaultLocale)
      : defaultLocale,
  i: (key) => {
    const currentLocale = get().locale;
    return translate({ locale: currentLocale, id: key });
  },
  setLocale: (by) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", by);
    }
    set(() => ({ locale: by }));
  },
}));

const useSelectedParliament = create<SelectedParliamentState>((set) => ({
  selectedParliament:
    parliaments.find((c) => c.name === "European Union") ?? null,
  setSelectedParliament: (by) => {
    set(() => ({ selectedParliament: by }));
  },
}));

const useCustomInfo = create<CustomInfoState>((set) => ({
  customInfo: { name: "", updateDate: "" },
  setCustomInfo: (by) => set(() => ({ customInfo: by })),
}));

// Loads imported or shared data, and keeps the settings it leaves out
function importParliamentData({
  name,
  updateDate,
  parties,
  selectedParties,
  majorityThreshold,
  allowTieBreaker,
  sortBy,
  locale,
}: ParliamentData) {
  useParties.getState().setParties(parties);
  useSelectedParties.getState().setSelectedParties(selectedParties);
  useSelectedParliament.getState().setSelectedParliament(null);
  useCustomInfo.getState().setCustomInfo({ name, updateDate });

  if (majorityThreshold) {
    useMajorityThreshold.getState().setMajorityThreshold(majorityThreshold);
  }
  if (allowTieBreaker !== undefined) {
    useAllowTieBreaker.getState().setAllowTieBreaker(allowTieBreaker);
  }
  if (sortBy) useSortBy.getState().setSortBy(sortBy);
  if (locale) useI18n.getState().setLocale(locale);
}

// Collects the current data, and leaves out the settings that are not included
function exportParliamentData(include: IncludeOptions): ParliamentData {
  const { parties } = useParties.getState();
  const { selectedParties } = useSelectedParties.getState();
  const { selectedParliament } = useSelectedParliament.getState();
  const { customInfo } = useCustomInfo.getState();
  const { majorityThreshold } = useMajorityThreshold.getState();
  const { allowTieBreaker } = useAllowTieBreaker.getState();
  const { sortBy } = useSortBy.getState();
  const { locale, i } = useI18n.getState();
  const { updateDate } = selectedParliament ?? customInfo;
  // A sample is exported with the name it shows in the current language
  const name = selectedParliament
    ? getParliamentName(selectedParliament, i)
    : customInfo.name;

  return {
    name,
    updateDate,
    parties,
    selectedParties: include.selectedParties ? selectedParties : parties,
    majorityThreshold: include.majorityThreshold
      ? majorityThreshold
      : undefined,
    allowTieBreaker: include.majorityThreshold ? allowTieBreaker : undefined,
    sortBy: include.sortBy ? sortBy : undefined,
    locale: include.locale ? locale : undefined,
  };
}

export {
  useDefaultParliamentValue,
  useParties,
  useSelectedParties,
  useIsEditMode,
  useSortBy,
  useAllowTieBreaker,
  useMajorityThreshold,
  useI18n,
  useSelectedParliament,
  useCustomInfo,
  importParliamentData,
  exportParliamentData,
};
