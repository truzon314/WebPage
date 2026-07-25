"use client";

import { Search } from "lucide-react";
import { usePropertySearch } from "@/lib/context/PropertySearchContext";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/constants/hero-slides";

const fieldClasses =
  "border-0 border-b-[1.5px] border-border bg-transparent px-1 py-2 text-sm text-navy-900 outline-none focus:border-gold-400";
const labelClasses = "text-[11px] font-semibold tracking-[0.3px] text-text-muted";

export function SearchBar() {
  const { draft, setDraftField, runSearch } = usePropertySearch();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        runSearch();
      }}
      aria-label="Search properties"
      className="flex flex-wrap items-end gap-[18px] rounded-xl bg-surface px-6 py-6 shadow-[0_20px_50px_rgba(10,18,36,0.25)] sm:px-8"
    >
      <div className="flex min-w-[150px] flex-1 flex-col gap-2">
        <label htmlFor="search-location" className={labelClasses}>
          LOCATION
        </label>
        <select
          id="search-location"
          value={draft.location}
          onChange={(e) => setDraftField("location", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">All Locations</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
        </select>
      </div>

      <div className="flex min-w-[150px] flex-1 flex-col gap-2">
        <label htmlFor="search-type" className={labelClasses}>
          PROPERTY TYPE
        </label>
        <select
          id="search-type"
          value={draft.propertyType}
          onChange={(e) => setDraftField("propertyType", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">All Types</option>
          {PROPERTY_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-[150px] flex-1 flex-col gap-2">
        <label htmlFor="search-budget" className={labelClasses}>
          BUDGET RANGE
        </label>
        <select
          id="search-budget"
          value={draft.budget}
          onChange={(e) => setDraftField("budget", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">Any Budget</option>
          <option value="under2">Under ₹2 Cr</option>
          <option value="2to5">₹2 Cr - ₹5 Cr</option>
          <option value="5to10">₹5 Cr - ₹10 Cr</option>
          <option value="10plus">₹10 Cr+</option>
        </select>
      </div>

      <div className="flex min-w-[130px] flex-1 flex-col gap-2">
        <label htmlFor="search-area" className={labelClasses}>
          AREA (SQ.FT)
        </label>
        <input
          id="search-area"
          type="text"
          inputMode="numeric"
          value={draft.area}
          onChange={(e) => setDraftField("area", e.target.value)}
          placeholder="e.g. 2000"
          className={fieldClasses}
        />
      </div>

      <div className="flex min-w-[130px] flex-1 flex-col gap-2">
        <label htmlFor="search-beds" className={labelClasses}>
          BEDROOMS
        </label>
        <select
          id="search-beds"
          value={draft.beds}
          onChange={(e) => setDraftField("beds", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">Any Bedrooms</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="5+">5+ BHK</option>
        </select>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-navy-900 px-[26px] py-3.5 text-[13px] font-bold tracking-[0.3px] text-white transition-colors hover:bg-[#26304f] cursor-pointer"
      >
        <Search size={15} />
        Search Properties
      </button>
    </form>
  );
}
