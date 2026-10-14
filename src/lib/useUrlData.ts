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
import { parliaments } from "@/data/parliaments";
import { supportedLocales } from "@/i18n/i18n";
import {
  useParties,
  useSelectedParties,
  useSelectedParliament,
  useI18n,
  importParliamentData,
} from "@/lib/zustandStore";
import { ParliamentData } from "@/types";
import { decodeShareData, getShareData } from "@/utils/shareLink";

// Loads the sample parliament, shared data, and language that the URL asks for,
// and returns the shared data and whether a share link could not be read
export function useUrlData(isEmbed: boolean) {
  const { setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const { setSelectedParliament } = useSelectedParliament();
  const { i, setLocale } = useI18n();
  const [sharedParliament, setSharedParliament] =
    useState<ParliamentData | null>(null);
  const [isShareLinkInvalid, setIsShareLinkInvalid] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(document.location.search);
    // ?country= is kept so older links still work
    const parliamentName =
      queryParams.get("parliament") ?? queryParams.get("country");
    const lang = queryParams.get("lang");
    let isCancelled = false;

    const loadParliament = () => {
      const parliament =
        parliaments.find((parliament) => parliament.name === parliamentName) ??
        parliaments.find((parliament) => parliament.name === "European Union");
      if (parliament) {
        setSelectedParliament(parliament);
        setParties(parliament.parties);
        setSelectedParties(parliament.parties);
      }
    };

    const loadSharedParliament = async (data: string) => {
      const decodedParliament = await decodeShareData(data);
      if (isCancelled) return;

      setSharedParliament(decodedParliament);
      setIsShareLinkInvalid(!decodedParliament);
      if (decodedParliament) {
        importParliamentData(decodedParliament);
      } else if (!isEmbed) {
        // Embeds show a message instead, since iframes block alerts
        alert(i("dialogs.invalidShareLink"));
        loadParliament();
      }
    };

    // Pasting a share link into an open tab only changes the hash
    const handleHashChange = () => {
      const data = getShareData(document.location.hash);
      if (data) loadSharedParliament(data);
    };

    const data = getShareData(document.location.hash);
    if (data) {
      loadSharedParliament(data);
    } else {
      loadParliament();
    }

    if (lang && supportedLocales.some((locale) => locale === lang)) {
      setLocale(lang);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      isCancelled = true;
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [
    i,
    isEmbed,
    setLocale,
    setParties,
    setSelectedParliament,
    setSelectedParties,
  ]);

  return { sharedParliament, isShareLinkInvalid };
}
