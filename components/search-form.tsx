import React from "react";
import Form from "next/form";
import SearchFormReset from "./ui/search-form-reset";
import { Search } from "lucide-react";
const SearchForm = ({ query }: { query: string }) => {
  return (
    <Form action="/" className="search-form">
      <input
        type="text"
        name="query"
        className="search-input"
        placeholder="Search Startups"
      />
      <div className="flex gap-2">
        {query && <SearchFormReset />}

        <button type="submit" className="search-btn text-white cursor-pointer">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
