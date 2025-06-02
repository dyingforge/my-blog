"use client";

import {
  Button,
  Navbar,
  TextInput,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { dark, light } from "@clerk/themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const search = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [search]);

  return (
    <Navbar className="border-b-2">
      <Link
        href="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          dyingforge
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <SignedIn>
          <UserButton
            appearance={{ baseTheme: theme === "light" ? light : dark }}
            userProfileUrl="/dashboard?tab=profile"
          />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </SignedOut>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <Link href="/">
          <NavbarLink active={path === "/"} as={"div"}>
            Home
          </NavbarLink>
        </Link>
        <Link href="/about">
          <NavbarLink active={path === "/about"} as={"div"}>
            About
          </NavbarLink>
        </Link>
        <Link href="/projects">
          <NavbarLink active={path === "/projects"} as={"div"}>
            Projects
          </NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}
