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

import type { ReactNode } from "react";
import { HeartIcon } from "@heroicons/react/16/solid";
import { useI18n } from "@/lib/zustandStore";
import { LocaleSettingButton, ThemeButton } from "@/components/ui/settings/";

// Opens in a new tab so the current parliament isn't lost, and says so to
// screen readers
function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { i } = useI18n();
  return (
    <a
      className={`underline hover:no-underline ${className ?? ""}`}
      href={href}
      rel={"noreferrer noopener"}
      target={"_blank"}
    >
      {children}
      <span className={"sr-only"}> {i("footer.newTab")}</span>
    </a>
  );
}

export default function Footer() {
  const { i } = useI18n();

  const links: { href: string; label: string; icon?: ReactNode }[] = [
    {
      href: "https://github.com/disfordave/parliament-seats",
      label: i("footer.sourceCode"),
    },
    {
      href: "https://github.com/disfordave/parliament-seats/issues",
      label: i("footer.issues"),
    },
    {
      href: "https://github.com/disfordave/parliament-seats/blob/main/LICENSE",
      label: i("footer.licence"),
    },
    {
      href: "https://github.com/sponsors/disfordave",
      label: i("footer.donate"),
      icon: (
        <HeartIcon
          className={
            "me-0.5 inline size-4 align-text-bottom text-pink-600 dark:text-pink-400"
          }
        />
      ),
    },
  ];

  return (
    <>
      <footer className={"mt-4 rounded-2xl bg-zinc-200 p-4 dark:bg-zinc-700"}>
        <div
          className={
            "flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          }
        >
          <div className={"flex-1 text-start"}>
            <p>
              &copy; 2024-{new Date().getFullYear()}{" "}
              <ExternalLink href={"https://hsw.is"}>HSW.is</ExternalLink>
            </p>
            {/* Without list-style, VoiceOver only announces a list with the role */}
            <ul
              className={
                "flex flex-wrap gap-x-2.5 gap-y-0.5 text-sm opacity-75"
              }
              role={"list"}
            >
              {links.map((link) => (
                <li key={link.href}>
                  <ExternalLink className={"text-nowrap"} href={link.href}>
                    {link.icon}
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2">
              <LocaleSettingButton />
            </div>
            <ThemeButton />
          </div>
        </div>
      </footer>
    </>
  );
}
