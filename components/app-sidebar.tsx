import * as React from 'react';
import { NavUser } from '@/components/nav-user';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { getTranslations, t } from '@/lib/translations';
import { NavMainClient } from '@/components/nav-main-client';

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Get translations server-side to prevent flashing
  const translations = await getTranslations();

  const navData = {
    navMain: [
      {
        title: t(translations, 'navigation.dashboard'),
        url: '/dashboard',
        iconName: 'Home',
        isActive: true,
      },
      {
        title: t(translations, 'navigation.patients'),
        url: '/patient',
        iconName: 'UsersRound',
        isActive: true,
      },
      {
        title: t(translations, 'navigation.appointments'),
        url: '/appointments',
        iconName: 'Calendar',
        isActive: true,
      },
      {
        title: t(translations, 'navigation.records'),
        url: '/records',
        iconName: 'SquareLibrary',
        isActive: true,
      },
      {
        title: t(translations, 'navigation.prescriptions'),
        url: '/prescriptions',
        iconName: 'Pill',
        isActive: true,
      },
      {
        title: t(translations, 'navigation.tests'),
        url: '#',
        iconName: 'Home',
        isActive: true,
      },
      {
        title: t(translations, 'navigation.settings'),
        url: '#',
        iconName: 'Settings',
        isActive: true,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMainClient items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <LanguageSwitcher />
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
