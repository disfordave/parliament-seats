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

import "./App.css";
import Body from "@/components/Body";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandscapeCountryListBanner from "./components/ui/app/head/LandscapeCountryListBanner";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl p-4">
        <Header />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[14.5fr_5.5fr]">
          <div className="">
            <Body />
          </div>
          <div className="hidden pt-4 lg:block">
            <LandscapeCountryListBanner />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
