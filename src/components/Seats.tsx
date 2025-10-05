import { useState, useRef } from "react";
import { countries } from "./countries";
import { useSelector } from 'react-redux'

export interface Party {
  name: string;
  shortName: string;
  seats: number;
  colour: string;
  position: number;
  isIndependent?: boolean;
}

interface ButtonConfig {
  label: string;
  onClick: () => void;
}

const CaretDownIcon = ({ className = "" }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className={"bi bi-caret-down-fill" + " " + className}
        viewBox="0 0 16 16"
      >
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
      </svg>
    </>
  );
};

const TrashIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </>
  );
};

const getPosition = (position: number, locale: string) => {
  const ranges = [
    { min: 100, max: Infinity, full: locale === 'en' ? "Far right" : "Extrême droite", short: "RR" },
    { min: 75, max: 99, full: locale === 'en' ? "Right-wing" : "Droite", short: "Rr" },
    { min: 50, max: 74, full: locale === 'en' ? "Centre right" : "Centre droit", short: "rr" },
    { min: 25, max: 49, full: locale === 'en' ? "Lean right" : "Légèrement à droite", short: "r" },
    { min: -24, max: 24, full: locale === 'en' ? "Centre" : "Centre", short: "C" },
    { min: -49, max: -25, full: locale === 'en' ? "Lean left" : "Légèrement à gauche", short: "l" },
    { min: -74, max: -50, full: locale === 'en' ? "Centre left" : "Centre gauche", short: "ll" },
    { min: -99, max: -75, full: locale === 'en' ? "Left-wing" : "Gauche", short: "Ll" },
    { min: -Infinity, max: -100, full: locale === 'en' ? "Far left" : "Extrême gauche", short: "LL" },
  ];

  const match = ranges.find(
    (range) => position >= range.min && position <= range.max
  );

  return match || { full: locale === 'en' ? "Centre" : "Centre", short: "C" };
};

const PartyButton = ({
  party,
  selectedParties,
  setSelectedParties,
  setParties,
  parties,
  isEditMode,
}: {
  party: Party;
  selectedParties: Party[];
  setSelectedParties: React.Dispatch<React.SetStateAction<Party[]>>;
  setParties: React.Dispatch<React.SetStateAction<Party[]>>;
  parties: Party[];
  isEditMode: boolean;
}) => {

  const locale = useSelector((state: { i18n: { locale: string } }) => state.i18n.locale)
  const selected = selectedParties.includes(party);
  //   const colour = party.isIndependent ? "#6B7280" : party.colour;
  const colour = party.colour;
  const partyName = party.isIndependent
    ? party.shortName.length > 0
      ? party.shortName + " (I)"
      : "Independent"
    : party.shortName;

  const shortDesc = `${partyName} (${party.seats})`;

  return (
    <div
      onClick={() => {
        if (isEditMode) return;
        if (selected) {
          setSelectedParties(selectedParties.filter((p) => p !== party));
        } else {
          setSelectedParties([...selectedParties, party]);
        }
      }}
      className={`${
        isEditMode ? "" : "cursor-pointer"
      } shadow-md party-button overflow-hidden flex gap-2 items-center border-2 p-2 rounded-lg w-full transition-all duration-300 bg-white dark:bg-gray-900`}
      style={{
        borderColor: selected ? colour : "var(--border-colour)", // dark mode #374151
        flexDirection: isEditMode ? "column" : "row",
      }}
      title={
        isEditMode
          ? ""
          : selected
          ? `Deselect ${shortDesc}`
          : `Select ${shortDesc}`
      }
      // disabled={isEditMode}
    >
      <div
        className={`relative ${
          isEditMode ? "w-full flex justify-center items-center" : ""
        }`}
      >
        {isEditMode && (
          <input
            name="partyColour"
            type="color"
            title="Party Colour"
            aria-label="Party Colour"
            className="w-full cursor-pointer opacity-0 absolute"
            value={colour}
            onChange={(e) => {
              const newParty = { ...party, colour: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }
            }}
          />
        )}
        <div
          className={` transition-all  ${
            isEditMode
              ? "h-6 w-full rounded-full border border-gray-200 dark:border-gray-700"
              : "size-4 aspect-square rounded-full"
          }`}
          style={{ backgroundColor: colour }}
        ></div>
      </div>
      <span className={isEditMode ? "w-full" : "truncate"}>
        {isEditMode ? (
          <input
            name="partyName"
            type="text"
            placeholder="Party Name"
            className="w-full outline-none border-b border-gray-200 dark:border-gray-700 bg-transparent"
            value={party.name}
            onChange={(e) => {
              const newParty = { ...party, name: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }
            }}
          />
        ) : (
          partyName
        )}
      </span>

      {isEditMode && (
        <span className={isEditMode ? "w-full" : "truncate"}>
          <input
            name="partyShortName"
            type="text"
            placeholder="Party Short Name"
            className="w-full outline-none border-b border-gray-200 dark:border-gray-700 bg-transparent"
            value={party.shortName}
            onChange={(e) => {
              const newParty = { ...party, shortName: e.target.value };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }
            }}
          />
        </span>
      )}

      <span
        className={` font-semibold 
            ${isEditMode ? "w-full" : "text-nowrap"}`}
      >
        {isEditMode ? (
          <input
            name="seats"
            type="number"
            placeholder="Seats"
            className="w-full outline-none border-b border-gray-200 dark:border-gray-700 bg-transparent"
            min={0}
            max={99999}
            value={party.seats.toFixed(0)}
            onChange={(e) => {
              const newParty = { ...party, seats: parseInt(e.target.value) };
              setParties(parties.map((p) => (p === party ? newParty : p)));
              if (selected) {
                setSelectedParties(
                  selectedParties.map((p) => (p === party ? newParty : p))
                );
              }

              if (e.target.value.length <= 0) {
                const newParty = { ...party, seats: 0 };
                setParties(parties.map((p) => (p === party ? newParty : p)));
                if (selected) {
                  setSelectedParties(
                    selectedParties.map((p) => (p === party ? newParty : p))
                  );
                }
              }
            }}
          />
        ) : (
          party.seats
        )}
      </span>
      {isEditMode ? (
        <>
          <div className="flex  w-full">
            <label className="flex flex-col gap-2 items-center w-full">
              <input
                name="position"
                dir="ltr"
                id="position-range"
                step={25}
                className="w-full appearance-none rounded-full bg-gray-200 dark:bg-gray-700"
                type="range"
                min="-100"
                max="100"
                value={party.position}
                onChange={(e) => {
                  const newParty = {
                    ...party,
                    position: parseInt(e.target.value),
                  };
                  setParties(parties.map((p) => (p === party ? newParty : p)));
                  if (selected) {
                    setSelectedParties(
                      selectedParties.map((p) => (p === party ? newParty : p))
                    );
                  }
                }}
              />
              <span className="text-center">
                {getPosition(party.position, locale).full}
              </span>
            </label>
          </div>
          <div>
            <label className="flex gap-1 items-center">
              <input
                type="checkbox"
                name="isIndependent"
                value={party.isIndependent ? "1" : "0"}
                checked={party.isIndependent}
                onChange={(e) => {
                  const newParty = {
                    ...party,
                    isIndependent: e.target.checked,
                  };
                  setParties(parties.map((p) => (p === party ? newParty : p)));
                  if (selected) {
                    setSelectedParties(
                      selectedParties.map((p) => (p === party ? newParty : p))
                    );
                  }
                }}
              />
              <span className="select-none">{locale === 'en' ? "Independent" : "Indépendant"}</span>
            </label>
          </div>
          <div className="w-full flex justify-evenly items-center gap-2">
            <button
              onClick={() => {
                if (selected) {
                  setSelectedParties(
                    selectedParties.filter((p) => p !== party)
                  );
                } else {
                  setSelectedParties([...selectedParties, party]);
                }
              }}
              className={`hover:opacity-75 transition-opacity `}
              type="button"
              title={selected ? "Deselect party" : "Select party"}
              aria-label={selected ? "Deselect party" : "Select party"}
            >
              {selected ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                setParties(parties.filter((p) => p !== party));
                if (selected) {
                  setSelectedParties(
                    selectedParties.filter((p) => p !== party)
                  );
                }
              }}
              type="button"
              className={`hover:opacity-75 transition-opacity `}
              title="Remove party"
              aria-label="Remove party"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      ) : (
        // <span className="text-nowrap font-mono">
        //   {`[${getPosition(party.position).short}]`}
        // </span>
        <></>
      )}
    </div>
  );
};

const Seats = () => {
  const locale = useSelector((state: { i18n: { locale: string } }) => state.i18n.locale)
  const [parties, setParties] = useState<Party[]>(
    countries.find((country) => country.name === "European Union")?.parties ||
      []
  );
  const [selectedParties, setSelectedParties] = useState<Party[]>(
    countries.find((country) => country.name === "European Union")?.parties ||
      []
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "seats" | "position">("seats");
  const [allowTieBreaker, setAllowTieBreaker] = useState(false);
  const total = parties.reduce((acc, party) => acc + party.seats, 0);
  const selectedTotal = selectedParties.reduce(
    (acc, party) => acc + party.seats,
    0
  );
  // const totalPositions =
  //   selectedParties.reduce((acc, party) => acc + party.position, 0) /
  //   selectedParties.length;

  const selectRef = useRef<HTMLSelectElement | null>(null);

  const majorityThreshold = (
    total % 2 === 0
      ? total / 2 + (allowTieBreaker ? 0 : 1)
      : Math.ceil(total / 2)
  ) as number;

  const sort = (a: Party, b: Party) => {
    if (isEditMode) return 0; // Stop sorting if edit mode is on
    if (sortBy === "name") {
      const aIsIndependent = a.isIndependent === true;
      const bIsIndependent = b.isIndependent === true;

      // If both are independent, maintain original order
      if (aIsIndependent && bIsIndependent) return 0;

      // If only a is independent, push it to the end
      if (aIsIndependent) return 1;

      // If only b is independent, push it to the end
      if (bIsIndependent) return -1;

      return a.shortName.localeCompare(b.shortName);
    }
    if (sortBy === "seats") {
      const aIsIndependent = a.isIndependent === true;
      const bIsIndependent = b.isIndependent === true;

      // If both are independent, maintain original order
      if (aIsIndependent && bIsIndependent) return 0;

      // If only a is independent, push it to the end
      if (aIsIndependent) return 1;

      // If only b is independent, push it to the end
      if (bIsIndependent) return -1;

      // If neither is independent, sort by seats in descending order
      return b.seats - a.seats;
    }
    if (sortBy === "position") return a.position - b.position;
    return 0;
  };

  const buttonConfigurations: ButtonConfig[] = [
    {
      label: {en: "Select All", fr: "Tout sélectionner"}[locale] || "Select All",
      onClick: () => setSelectedParties([...parties]),
    },
    {
      label: {en: "Deselect All", fr: "Tout désélectionner"}[locale] || "Deselect All",
      onClick: () => setSelectedParties([]),
    },
    {
      label: {en: "Left", fr: "Gauche"}[locale] || "Left",
      onClick: () => {
        const leftParties = parties.filter((party) => party.position < 0);
        setSelectedParties(leftParties);
      },
    },
    {
      label: {en: "Right", fr: "Droite"}[locale] || "Right",
      onClick: () => {
        const rightParties = parties.filter((party) => party.position > 0);
        setSelectedParties(rightParties);
      },
    },
    {
      label: {en: "Left (without far left)", fr: "Gauche (sans extrême gauche)"}[locale] || "Left (without far left)",
      onClick: () => {
        const leftParties = parties.filter(
          (party) => party.position < 0 && party.position > -100
        );
        setSelectedParties(leftParties);
      },
    },
    {
      label: {en: "Right (without far right)", fr: "Droite (sans extrême droite)"}[locale] || "Right (without far right)",
      onClick: () => {
        const rightParties = parties.filter(
          (party) => party.position > 0 && party.position < 100
        );
        setSelectedParties(rightParties);
      },
    },
    {
      label: {en: "Left-wing", fr: "Aile gauche"}[locale] || "Left-wing",
      onClick: () => {
        const leftParties = parties.filter((party) => party.position <= -75);
        setSelectedParties(leftParties);
      },
    },
    {
      label: {en: "Right-wing", fr: "Aile droite"}[locale] || "Right-wing",
      onClick: () => {
        const rightParties = parties.filter((party) => party.position >= 75);
        setSelectedParties(rightParties);
      },
    },
    {
      label: {en: "Centre", fr: "Centre"}[locale] || "Centre",
      onClick: () => {
        const centerParties = parties.filter(
          (party) =>
            party.position <= 25 &&
            party.position >= -25 &&
            !party.isIndependent
        );
        setSelectedParties(centerParties);
      },
    },
    {
      label: {en: "Grand (centre)", fr: "Grand (centre)"}[locale] || "Grand (centre)",
      onClick: () => {
        const centerParties = parties.filter(
          (party) =>
            party.position < 75 && party.position > -75 && !party.isIndependent
        );
        setSelectedParties(centerParties);
      },
    },
    {
      label: {en: "Grand (without extremists)", fr: "Grand (sans extrémistes)"}[locale] || "Grand (without extremists)",
      onClick: () => {
        const grandParties = parties.filter(
          (party) =>
            party.position > -100 &&
            party.position < 100 &&
            !party.isIndependent
        );
        setSelectedParties(grandParties);
      },
    },
  ];

  const sortButtonConfigs = [
    { label: {
      en: "Name",
      fr: "Nom"
    }[locale] || "Name", sortByKey: "name", title: "Sort by Name" },
    {
      label: {
        en: "Position",
        fr: "Position"
      }[locale] || "Position",
      sortByKey: "position",
      title: "Sort by Political Position",
    },
    { label: {
      en: "Seats",
      fr: "Sièges"
    }[locale] || "Seats", sortByKey: "seats", title: "Sort by Seats" },
  ] as {
    label: string;
    sortByKey: "name" | "position" | "seats";
    title: string;
  }[];

  return (
    <div>
      <select
        ref={selectRef}
        defaultValue={"European Union"}
        title="Select Country"
        aria-label="Select Country"
        onChange={(e) => {
          if (e.target.value === "CustomValue") {
            setParties([]);
            setSelectedParties([]);
            return;
          }
          const country = countries.find(
            (country) => country.name === e.target.value
          );
          if (country) {
            setParties(country.parties);
            setSelectedParties(country.parties);
          }
        }}
        id="countries-datalist"
        className="p-2 border-2 rounded-lg w-full border-gray-200 dark:border-gray-700 duration-300 transition-colors appearance-none bg-white dark:bg-gray-900"
      >
        <option value="CustomValue">Custom</option>
        <optgroup label="Sample">
          {countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((country) => (
              <option key={country.name} value={country.name}>
                {`${country.name}${country.emoji ? " " + country.emoji : ""}`}
              </option>
            ))}
        </optgroup>
      </select>

      <div className=" sticky top-0 z-50 bg-white dark:bg-gray-900 duration-300 transition-colors pt-4 px-4 -mx-4  mb-4">
        <div className="flex justify-between items-center">
          <p className="flex-1 ">
            {selectedTotal === total || selectedTotal === 0 ? (
              ""
            ) : allowTieBreaker && majorityThreshold === selectedTotal ? (
              <span className="text-emerald-600 dark:text-emerald-400 line-clamp-1">
                Tie-breaking majority
              </span>
            ) : (total % 2 === 0 ? total / 2 + 1 : Math.ceil(total / 2)) <=
              selectedTotal ? (
              <span className="text-violet-600 dark:text-violet-400 line-clamp-1">
                {selectedTotal - majorityThreshold + (allowTieBreaker ? 0 : 1)}{" "}
                {selectedTotal -
                  majorityThreshold +
                  (allowTieBreaker ? 0 : 1) ===
                1
                  ? "seat"
                  : "seats"}{" "}
                majority
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">{`${
                majorityThreshold - selectedTotal
              } ${
                majorityThreshold - selectedTotal === 1 ? "seat" : "seats"
              } left
                `}</span>
            )}
          </p>
          <div
            className="flex items-center justify-center relative"
            title={`${
              total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)
            } seats for majority`}
          >
            <CaretDownIcon />
            <p className="absolute left-5 rtl:right-5">
              {total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)}{" "}
            </p>
          </div>
          <div className="flex-1 flex justify-end text-end">
            <p className="tabular-nums ">
              <span className="font-semibold">{selectedTotal}</span> / {total}
            </p>
          </div>
        </div>
        <div
          className="relative flex rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 h-12 w-full transition-all"
          dir={sortBy === "position" ? "ltr" : ""}
        >
          {parties
            .sort((a, b) => sort(a, b))
            .map((party, index) => (
              <div
                key={index}
                title={`${
                  party.isIndependent
                    ? party.shortName.length > 0
                      ? party.shortName + " (I)"
                      : "Independent"
                    : party.shortName
                } (${party.seats})`}
                style={{
                  backgroundColor: party.colour,
                  minWidth: "0%",
                  width: selectedParties.includes(party)
                    ? `${(party.seats / total) * 100}%`
                    : "0%",
                }}
                className={`h-full transition-[width] duration-300 r-0 text-ellipsis overflow-hidden text-nowrap`}
              ></div>
            ))}
          <div className="absolute border-l-2 border-violet-500 border-dashed h-full bg-background-elevated left-[calc(50%-1px)] "></div>
        </div>
        <hr className="border-y border-gray-200 dark:border-gray-700 mt-4 -mx-4 sm:-mx-0 duration-300 transition-colors" />
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex-1 justify-start text-nowrap sm:w-auto">
          <label className="flex gap-2 items-center ">
            <span className="relative">
              <input
                title="Allow Tie Breaker"
                type="checkbox"
                name="allowTieBreaker"
                id="allowTieBreaker"
                className="opacity-0 absolute w-full h-full"
                checked={allowTieBreaker}
                onChange={() => {
                  setAllowTieBreaker(!allowTieBreaker);
                }}
              />
              <div
                role="checkbox"
                aria-label={"Allow Tie Breaker"}
                aria-checked={allowTieBreaker}
                className={`${
                  allowTieBreaker
                    ? "bg-violet-600 dark:bg-violet-400"
                    : "bg-gray-200 dark:bg-gray-700"
                } rounded-full aspect-square size-6 flex justify-center items-center overflow-hidden transition-colors`}
              >
                {allowTieBreaker ? (
                  <div className="w-full h-full text-white dark:text-gray-950 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4 "
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full text-white bg-gray-200 dark:bg-gray-700 dark:text-gray-950 flex justify-center items-center"></div>
                )}
              </div>
            </span>
            <span className="select-none ">{locale === 'en' ? "Allow Tie Breaker" : "Autoriser le briseur d'égalité"}</span>
          </label>
        </div>
        <div className="flex sm:order-2 order-3 rounded-lg overflow-y-hidden overflow-x-auto whitespace-nowrap sm:w-auto w-full">
          {sortButtonConfigs.map((config, index) => (
            <button
              key={index}
              onClick={() => setSortBy(config.sortByKey)}
              className={`${
                sortBy === config.sortByKey
                  ? "bg-violet-600 dark:bg-violet-400 text-white dark:text-gray-950"
                  : "bg-gray-200 dark:bg-gray-700"
              } px-2 py-1 transition-colors flex-1`}
              title={config.title}
            >
              {config.label}
            </button>
          ))}
        </div>
        <div className=" select-none flex sm:order-3 order-2 items-center gap-2 flex-1 justify-end">
          <span
            title={"Switch to View Mode"}
            className="select-none cursor-default"
            onClick={() => setIsEditMode(false)}
          >
            {locale === 'en' ? "View" : "Vue"}
          </span>
          <div
            onClick={() => setIsEditMode(!isEditMode)}
            className={` cursor-pointer rounded-full relative w-12 h-6 bg-gray-200 dark:bg-gray-700 flex `}
            title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
          >
            <div
              className={`h-full w-6 rounded-full bg-violet-600 dark:bg-violet-400 transition-all ${
                isEditMode ? "translate-x-full rtl:-translate-x-full" : ""
              }`}
            ></div>
          </div>
          <span
            title="Switch to Edit Mode"
            className="select-none cursor-default"
            onClick={() => setIsEditMode(true)}
          >
            {locale === 'en' ? "Edit" : "Éditer"}
          </span>
        </div>
      </div>
      <ul
        className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-4 transition-all`}
      >
        {parties
          .sort((a, b) => sort(a, b))
          .map((party, index) => (
            <li key={index}>
              <PartyButton
                parties={parties}
                party={party}
                selectedParties={selectedParties}
                setSelectedParties={setSelectedParties}
                setParties={setParties}
                isEditMode={isEditMode}
              />
            </li>
          ))}
        {isEditMode && (
          <li className="w-full h-full justify-center flex items-center">
            <button
              onClick={() => {
                setParties([
                  ...parties,
                  {
                    name: "",
                    shortName: "",
                    seats: 0,
                    colour: "#6B7280",
                    position: 0,
                    isIndependent: false,
                  },
                ]);
              }}
              className="p-2 border-2 border-transparent rounded-full w-1/3  aspect-square m-4 bg-gray-200 dark:bg-gray-700 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
              type="button"
              title="Add Party"
              aria-label="Add Party"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-2/3 stroke-2 dark:text-white text-gray-950 m-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </li>
        )}
      </ul>
      {parties.length <= 0 && <p className="text-center">{locale === 'en' ? "No parties" : "Aucun parti"}</p>}

      <div className="flex gap-2 flex-wrap mt-4 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 overflow-auto">
        {buttonConfigurations.map((buttonConfig, index) => (
          <button
            key={index}
            onClick={buttonConfig.onClick}
            className="px-3 py-1 border-2 border-transparent hover:border-violet-600 dark:hover:border-violet-400 transition-colors rounded-full bg-white dark:bg-gray-900 text-nowrap"
            type="button"
            title={buttonConfig.label}
            aria-label={buttonConfig.label}
            aria-describedby={buttonConfig.label}
            aria-disabled={false}
          >
            {buttonConfig.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setParties([]);
          setSelectedParties([]);
          if (selectRef.current) {
            selectRef.current.value = "CustomValue";
          }
        }}
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200 dark:border-gray-700"
      >
        {locale === 'en' ? "Clear All Parties" : "Effacer tous les partis"}
      </button>
      <button
        onClick={() => {
          const data = JSON.stringify(parties);
          const blob = new Blob([data], { type: "text/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "parties.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="p-2 border-2 rounded-lg w-full mt-4 border-gray-200 dark:border-gray-700"
        type="button"
        title="Export Parties"
        aria-label="Export Parties"
        aria-describedby="Export Parties"
        aria-disabled={false}
      >
        {locale === 'en' ? "Export Parties" : "Exporter les partis"}
      </button>
      <input
        type="file"
        accept=".json"
        className="mt-4 max-w-full"
        title="Import Parties"
        aria-label="Import Parties"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target?.result;
            if (!data) return;

            try {
              const parsedData = JSON.parse(data as string);

              // Check if parsedData is an array and conforms to Party structure
              if (
                Array.isArray(parsedData) &&
                parsedData.every(
                  (item) =>
                    typeof item.name === "string" &&
                    typeof item.shortName === "string" &&
                    typeof item.seats === "number" &&
                    typeof item.colour === "string" &&
                    typeof item.position === "number" &&
                    (typeof item.isIndependent === "boolean" ||
                      item.isIndependent === undefined)
                )
              ) {
                setParties(parsedData as Party[]);
                setSelectedParties(parsedData as Party[]);
                if (selectRef.current) {
                  selectRef.current.value = "CustomValue";
                }
              } else {
                console.error("Uploaded JSON file has an incorrect format");
                alert(
                  "The uploaded file has an incorrect format. Please upload a valid JSON file."
                );
              }
            } catch (error) {
              console.error("Error parsing JSON file:", error);
              alert(
                "Failed to parse the JSON file. Please ensure it's in the correct format."
              );
            }
          };
          reader.readAsText(file);
        }}
      />
    </div>
  );
};

export default Seats;
