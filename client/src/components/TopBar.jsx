import { useState } from "react";
import React from "react";
import logo from "../assets/images/logo-white.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { IoLogInSharp } from "react-icons/io5";
import { RouteSignIn, RouteSignUp, RouteIndex, RouteSearch } from "../helpers/RouteNames";
import { useSelector } from "react-redux";
import DropdownMenuComponent from "./DropdownMenu";
import { BiSearch } from "react-icons/bi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useSidebar } from "../components/ui/sidebar"; // keep the same path you used earlier

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // sidebar controls
  const { toggleSidebar, isMobile } = useSidebar();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(RouteSearch(searchQuery.trim()));
      setShowMobileSearch(false); // hide mobile search after submit
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="w-[100vw] fixed top-0 left-0 h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between z-50">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="md:hidden p-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <HiOutlineMenuAlt3 size={20} />
            </button>
          )}

          <img
            onClick={() => navigate(RouteIndex)}
            src={logo}
            alt="logo"
            className="h-8 w-auto cursor-pointer"
          />
        </div>

        {/* Center: desktop-only search */}
        <div className="flex-1 flex justify-center">
          <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-700 
               focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
              aria-label="Search"
            >
              <BiSearch className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Right: mobile search icon + profile / auth buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile search button - placed beside profile/login */}
          {!showMobileSearch && (
            <button
              onClick={() => setShowMobileSearch((s) => !s)}
              className="md:hidden p-2 rounded hover:bg-slate-100"
              aria-label="Open search"
              aria-expanded={showMobileSearch}
            >
              <BiSearch size={20} />
            </button>
          )}

          {/* Auth or profile */}
          {user?.isloggedin ? (
            <DropdownMenuComponent />
          ) : (
            <div className="flex gap-2 items-center">
              <Button
                asChild
                className="bg-purple-600 text-white hover:bg-purple-700 rounded-full 
                           px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm"
              >
                <Link to={RouteSignIn}>
                  <IoLogInSharp className="mr-1 md:mr-2" /> Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full 
                           px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm"
              >
                <Link to={RouteSignUp}> Sign Up </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search slide-down */}
      {showMobileSearch && (
        <div className="fixed top-16 left-0 w-full bg-white border-b border-gray-200 px-4 py-2 md:hidden z-40">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm text-gray-700 
               focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
              aria-label="Search"
            >
              <BiSearch className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Close search"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* spacer so page content doesn't go under the fixed top bar */}
      <div className="h-16" data-slot="top-bar-height"></div>
    </>
  );
};

export default TopBar;
