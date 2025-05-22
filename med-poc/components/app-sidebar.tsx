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
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Placeholder",
          url: "#",
        },
      ],
    },
    {
      title: "Patients",
      url: "#",
      icon: UsersRound,
      isActive: true,
      items: [
        {
          title: "Placeholder",
          url: "#",
        },
      ],
    },
    {
      title: "Appointments",
      url: "#",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "Placeholder",
          url: "#",
        },
      ],
    },
    {
      title: "Records",
      url: "#",
      icon: SquareLibrary,
      isActive: true,
      items: [
        {
          title: "Placeholder",
          url: "#",
        },
      ],
    },
    {
      title: "Prescriptions",
      url: "#",
      icon: Pill,
      isActive: true,
      items: [
        {
          title: "Placeholder",
          url: "#",
        },
      ],
    },
    {
      title: "Tests",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "TestTubeDiagonal",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "Placeholder",
          url: "#",
        },
      ],
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
