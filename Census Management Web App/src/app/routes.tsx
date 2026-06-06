import { createBrowserRouter, redirect } from 'react-router';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CitizensPage } from './pages/CitizensPage';
import { RegisterCitizenPage } from './pages/RegisterCitizenPage';
import { RegisterStaffPage } from './pages/RegisterStaffPage';
import { CensusEntryPage } from './pages/CensusEntryPage';
import { EnumeratorsPage } from './pages/EnumeratorsPage';
import { ReportsPage } from './pages/ReportsPage';
import { BillingPage } from './pages/BillingPage';
import { AndroidPage } from './pages/AndroidPage';
import { SettingsPage } from './pages/SettingsPage';
import { DataGeneratorPage } from './pages/DataGeneratorPage';
import { SupervisorsPage } from './pages/SupervisorsPage';
import  CitizenCardPage  from './pages/CitizenCardPage';
import { CensusRecordsPage } from './pages/CensusRecordsPage';

function requireAuth() {
  const raw = localStorage.getItem('census_user');

  if (!raw) return redirect('/login');

  try {
    const user = JSON.parse(raw);
    // Make sure the stored value is actually a valid user object
    if (!user || !user.role) return redirect('/login');
  } catch {
    // Corrupted data — clear it and redirect
    localStorage.removeItem('census_user');
    return redirect('/login');
  }

  return null;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: Layout,
    loader: requireAuth,
    children: [
      { index: true,             loader: () => redirect('/dashboard') },
      { path: 'dashboard',       Component: DashboardPage },
      { path: 'citizens',        Component: CitizensPage },
      { path: 'register',        Component: RegisterCitizenPage },
      { path: 'register-staff',  Component: RegisterStaffPage },
      { path: 'census-entry',    Component: CensusEntryPage },
      { path: 'enumerators',     Component: EnumeratorsPage },
      { path: 'data-generator',  Component: DataGeneratorPage },
      { path: 'reports',         Component: ReportsPage },
      { path: 'billing',         Component: BillingPage },
      { path: 'android',         Component: AndroidPage },
      { path: 'settings',        Component: SettingsPage },
      { path: 'supervisors',     Component: SupervisorsPage },
      { path: 'uid-cards', Component: CitizenCardPage },
      { path: 'census-records', Component: CensusRecordsPage },
    ],
  },
  {
    path: '*',
    loader: () => redirect('/login'),
  },
]);