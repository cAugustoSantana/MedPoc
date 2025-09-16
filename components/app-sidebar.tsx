'use client';

import * as React from 'react';
import {
  Calendar,
  Home,
  Pill,
  Settings,
  SquareLibrary,
  UsersRound,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useTranslations } from '@/hooks/use-translations';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslations();

  const data = {
    navMain: [
      {
        title: t('Navigation.dashboard'),
        url: '/dashboard',
        icon: Home,
        isActive: true,
      },
      {
        title: t('Navigation.patients'),
        url: '/patient',
        icon: UsersRound,
        isActive: true,
      },
      {
        title: t('Navigation.appointments'),
        url: '/appointments',
        icon: Calendar,
        isActive: true,
      },
      {
        title: 'Records',
        url: '/records',
        icon: SquareLibrary,
        isActive: true,
      },
      {
        title: t('Navigation.prescriptions'),
        url: '/prescriptions',
        icon: Pill,
        isActive: true,
      },
      {
        title: 'Tests',
        url: '#',
        icon: Home,
        isActive: true,
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings,
        isActive: true,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <div className="p-4">
          <LanguageSwitcher />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
