"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Pill,
  Settings,
  Settings2,
  SquareLibrary,
  SquareTerminal,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true ,
    },
    {
      title: "Patients",
      url: "/patient",
      icon: UsersRound,
      isActive: true,
    },
    {
      title: "Appointments",
      url: "/appoinment",
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
