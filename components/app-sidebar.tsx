"use client";

import * as React from "react";
import {
  Calendar,
  Home,
  Pill,
  Settings,
  SquareLibrary,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Patients",
      url: "/patient",
      icon: UsersRound,
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/appointment",
      icon: Calendar,
      isActive: true,
    },
    {
      title: "Records",
      url: "/records",
      icon: SquareLibrary,
      isActive: true,
    },
    {
      title: "Prescriptions",
      url: "#",
      icon: Pill,
      isActive: true,
    },
    {
      title: "Tests",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
