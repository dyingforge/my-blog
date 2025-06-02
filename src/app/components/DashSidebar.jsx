"use client";

import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashSidebar() {
  const [tab, setTab] = useState("");
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  if (!isSignedIn) {
    return null;
  }

  const SidebarItem = ({ href, icon: Icon, children, active, label }) => (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
          active
            ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1">{children}</span>
        {label && (
          <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
            {label}
          </span>
        )}
      </div>
    </Link>
  );

  const SignOutItem = ({ icon: Icon }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-700 dark:text-gray-300">
      <Icon className="w-5 h-5" />
      <SignOutButton />
    </div>
  );

  return (
    <div className="w-full md:w-56 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-1 p-3">
        {user?.publicMetadata?.isAdmin && (
          <SidebarItem
            href="/dashboard?tab=dash"
            icon={HiChartPie}
            active={tab === "dash" || !tab}
          >
            Dashboard
          </SidebarItem>
        )}

        <SidebarItem
          href="/dashboard?tab=profile"
          icon={HiUser}
          active={tab === "profile"}
          label={user?.publicMetadata?.isAdmin ? "Admin" : "User"}
        >
          Profile
        </SidebarItem>

        {user?.publicMetadata?.isAdmin && (
          <SidebarItem
            href="/dashboard?tab=posts"
            icon={HiDocumentText}
            active={tab === "posts"}
          >
            Posts
          </SidebarItem>
        )}

        {user?.publicMetadata?.isAdmin && (
          <SidebarItem
            href="/dashboard?tab=users"
            icon={HiOutlineUserGroup}
            active={tab === "users"}
          >
            Users
          </SidebarItem>
        )}

        <SignOutItem icon={HiArrowSmRight} />
      </div>
    </div>
  );
}
