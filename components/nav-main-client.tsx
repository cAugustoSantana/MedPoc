'use client';

import { GalleryVerticalEnd, type LucideIcon } from 'lucide-react';
import {
  Calendar,
  Home,
  Pill,
  Settings,
  SquareLibrary,
  UsersRound,
} from 'lucide-react';

import { Collapsible } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Icon mapping for client component
const iconMap: Record<string, LucideIcon> = {
  Home,
  UsersRound,
  Calendar,
  SquareLibrary,
  Pill,
  Settings,
};

export function NavMainClient({
  items,
}: {
  items: {
    title: string;
    url: string;
    iconName: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">WIP</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarMenu>
        {items.map((item) => {
          const IconComponent = iconMap[item.iconName] || Home;
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <a href={item.url}>
                  <SidebarMenuButton tooltip={item.title}>
                    <IconComponent />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
