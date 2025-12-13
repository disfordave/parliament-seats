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

import { countries } from "@/data/countries";
import { defaultLocale, translate } from "@/i18n/i18n";
import {
  BearState,
  DefaultCountryValueState,
  PartiesState,
  IsEditModeState,
  SortByState,
  AllowTieBreakerState,
  SelectedPartiesState,
  SelectedCountryState,
  I18nState,
} from "@/types";
import { create } from "zustand";

const useBear = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  removeAllBears: () => set({ bears: 0 }),
}));

const useDefaultCountryValue = create<DefaultCountryValueState>((set) => ({
  defaultCountryValue: null,
  setDefaultCountryValue: (by) => set(() => ({ defaultCountryValue: by })),
}));

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

const useI18n = create<I18nState>((set, get) => ({
  locale: localStorage.getItem("locale") || defaultLocale,
  i: (key) => {
    const currentLocale = get().locale;
    return translate({ locale: currentLocale, id: key });
  },
  setLocale: (by) => {
    localStorage.setItem("locale", by);
    set(() => ({ locale: by }));
  },
}));

const useSelectedCountry = create<SelectedCountryState>((set) => ({
  selectedCountry: countries.find((c) => c.name === "European Union") ?? null,
  setSelectedCountry: (by) => {
    set(() => ({ selectedCountry: by }));
  },
}));

export {
  useBear,
  useDefaultCountryValue,
  useParties,
  useSelectedParties,
  useIsEditMode,
  useSortBy,
  useAllowTieBreaker,
  useI18n,
  useSelectedCountry,
};
