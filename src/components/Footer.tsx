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
      <div className={"mt-4 italic opacity-75"}>
        <p>
          {i("footer.feelFree")}{" "}
          <a
            className={"underline hover:no-underline"}
            href={"https://github.com/disfordave/parliament-seats"}
            rel={"noreferrer noopener"}
            target={"_blank"}
          >
            {i("footer.onGitHub")}
          </a>{" "}
          {i("footer.ifYouHave")}
        </p>
      </div>
      <footer
        className={
          "flex flex-wrap items-center justify-between gap-2 py-8 text-start"
        }
      >
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            className={"no-underline hover:underline"}
            href={"https://disfordave.com"}
            rel={"noreferrer noopener"}
            target={"_blank"}
          >
            @disfordave
          </a>{" "}
        </p>
        <div className="flex flex-wrap items-center justify-start gap-2">
          <ThemeButton />
          <div className="flex gap-2">
            <LocaleSettingButton />
          </div>
        </div>
      </footer>
    </>
  );
}
