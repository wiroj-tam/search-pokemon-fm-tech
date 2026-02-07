"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POKEMONS_NAME } from "@/graphql/queries";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameFromUrl = searchParams.get("name") || "";

  const [value, setValue] = useState(nameFromUrl);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Call API to get all Pokmon names
  const { data } = useQuery(GET_POKEMONS_NAME, {
    variables: { first: 151 },
  });

  const allNames = data?.pokemons?.map((p) => p.name) || [];

  useEffect(() => setValue(nameFromUrl), [nameFromUrl]);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlight(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Update suggestions based on input value
  const updateSuggestions = (val: string) => {
    if (!val) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlight(-1);
      return;
    }

    const lowerVal = val.toLowerCase();
    const filtered = allNames
      .sort((a: string, b: string) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();

        // The name starts with value shows first
        const aStartsWith = aLower.startsWith(lowerVal) ? 0 : 1;
        const bStartsWith = bLower.startsWith(lowerVal) ? 0 : 1;

        if (aStartsWith !== bStartsWith) return aStartsWith - bStartsWith;

        // If both start with value, sort alphabetically
        return aLower.localeCompare(bLower);
      })
      .filter((n: string) => n.toLowerCase().includes(lowerVal))
      .slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setHighlight(-1);
  };

  // Handle search action
  const handleSearch = (name?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const searchName = name || value;
    router.push(`/?name=${searchName.toLowerCase()}`);
    setShowSuggestions(false);
  };

  // Handle input change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue(name);
    updateSuggestions(name);
  };

  // For keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") handleSearch(undefined, e);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newHighlight = Math.min(highlight + 1, suggestions.length - 1);
      setHighlight(newHighlight);
      scrollToItem(newHighlight);
    } 
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newHighlight = Math.max(highlight - 1, 0);
      setHighlight(newHighlight);
      scrollToItem(newHighlight);
    } 
    else if (e.key === "Enter") {
      e.preventDefault();
      const selected = highlight >= 0 ? suggestions[highlight] : value;
      if (selected) handleSearch(selected);
    } 
    else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlight(-1);
    }
  };

  // To scroll the suggestions when pressing arrow up or down
  const scrollToItem = (index: number) => {
    const item = itemRefs.current[index];
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  };

  return (
    <form
      onSubmit={(e) => handleSearch(undefined, e)}
      className="flex justify-center gap-2 mb-8"
      autoComplete="off"
    >
      <div className="relative" ref={wrapperRef}>
        <input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => {
            updateSuggestions(value || "");
          }}
          placeholder="Search Pokémon..."
          className="capitalize w-64 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
        />
        {showSuggestions && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-auto">
            {suggestions.map((s, i) => (
              <li
                key={s}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  handleSearch(s);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`px-3 py-2 cursor-pointer ${
                  i === highlight ? "bg-gray-100" : ""
                } capitalize`}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 active:scale-95 transition"
      >
        Search
      </button>
    </form>
  );
}
