import "./App.css";
import Seats from "./components/Seats";
import {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setLocale } from "./i18n/i18n";
import { useI18n } from "./i18n/i18nMessage";

type Theme = "light" | "dark" | "auto";

function App() {
  const locale = useSelector((state: { i18n: { locale: string } }) => state.i18n.locale);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState<Theme>(
    (localStorage.theme as Theme) || "auto"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme =
        theme === "auto"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : theme;

      // update DOM
      document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
    };

    // Apply immediately
    applyTheme();

    // Only watch system preference if we're in auto mode
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

  const i = useI18n();
  
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-950 dark:text-white min-h-screen transition-colors duration-300">
        <div className="max-w-2xl mx-auto p-4 ">
            <div className={"flex justify-between items-center  mb-4"}>
                <h1 className="text-2xl font-bold">{i('parliament')}</h1>
                <div className="flex gap-2">
                  <div>
                  <button className={`px-2 py-1 border-2 border-e-0 rounded-s-lg border-gray-200 dark:border-gray-700 ${locale === 'en' ? 'bg-gray-200 dark:bg-gray-700' : ''}`} title={"English"} onClick={() => dispatch(setLocale('en'))}>EN</button>
                  <button className={`px-2 py-1 border-2 border-s-0 rounded-e-lg border-gray-200 dark:border-gray-700 ${locale === 'fr' ? 'bg-gray-200 dark:bg-gray-700' : ''}`} title={"Français"} onClick={() => dispatch(setLocale('fr'))}>FR</button> 
                </div>
                <select
                    className="px-2 py-1 border-2 rounded-lg border-gray-200 dark:border-gray-700 appearance-none bg-white dark:bg-gray-900"
                    value={theme} title={"Appearance"} onChange={
                    (e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')
                }>
                    <option value={'light'}>{i('appearances.light')}</option>
                    <option value={'dark'}>{i('appearances.dark')}</option>
                    <option value={'auto'}>{i('appearances.auto')}</option>
                </select>
                </div>

            </div>
            <Seats/>
            <div className={"mt-4 italic opacity-75"}>
                <p>
                    Feel free to contact me through <a className={"underline hover:no-underline"} href={"https://disfordave.com/projects/parliament/#comments"} rel={"noreferrer noopener"} target={"_blank"}>my website</a> if you have any issues or suggestions.
                </p>
            </div>
            <footer className={"p-8 text-center"}>
                <p>&copy; {new Date().getFullYear()} <a className={"hover:underline no-underline"} href={"https://disfordave.com"} rel={"noreferrer noopener"} target={"_blank"}>@disfordave</a> </p>
            </footer>
        </div>
    </div>
  );
}

export default App;
