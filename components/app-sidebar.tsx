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
        title: t(translations, 'Navigation.dashboard'),
        url: '/dashboard',
        iconName: 'Home',
        isActive: true,
      },
      {
        title: t(translations, 'Navigation.patients'),
        url: '/patient',
        iconName: 'UsersRound',
        isActive: true,
      },
      {
        title: t(translations, 'Navigation.appointments'),
        url: '/appointments',
        iconName: 'Calendar',
        isActive: true,
      },
      {
        title: t(translations, 'Navigation.records'),
        url: '/records',
        iconName: 'SquareLibrary',
        isActive: true,
      },
      {
        title: t(translations, 'Navigation.prescriptions'),
        url: '/prescriptions',
        iconName: 'Pill',
        isActive: true,
      },
      {
        title: t(translations, 'Navigation.tests'),
        url: '#',
        iconName: 'Home',
        isActive: true,
      },
      {
        title: t(translations, 'Navigation.settings'),
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
