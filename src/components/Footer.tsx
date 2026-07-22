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
import { LocaleSettingButton, ThemeButton } from "@/components/ui/settings/";

export default function Footer() {
  const { i } = useI18n();
  return (
    <>
      <footer className={"p-4 bg-zinc-200 dark:bg-zinc-700 rounded-t-2xl -mb-4 mt-4"}>
        <div
          className={"flex items-center justify-between gap-2"}
        >
          <div className="flex flex-wrap items-center justify-start gap-2">
            <ThemeButton />
            <div className="flex gap-2">
              <LocaleSettingButton />
            </div>
          </div>
          <div className={"text-end"}>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a
                className={"no-underline hover:underline"}
                href={"https://hsw.is"}
                rel={"noreferrer noopener"}
                target={"_blank"}
              >
                @disfordave
              </a>{" "}
            </p>
            <p className={"text-sm opacity-75"}>
              {i("footer.feelFree")}{" "}
              <a
                className={"underline hover:no-underline"}
                href={"https://git.hsw.is/parliament-seats"}
                rel={"noreferrer noopener"}
                target={"_blank"}
              >
                {i("footer.onGitHub")}
              </a>{" "}
              {i("footer.ifYouHave")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
