import React from "react";

export default function SearchBar() {
  return (
    <div className="flex items-center p-4 border rounded-md shadow-md">
      <input
        type="text"
        placeholder="Search here"
        className="w-full p-2 text-sm outline-none"
      />
      <button className="ml-2 text-orange-500">
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
}
