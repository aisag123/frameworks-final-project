import { CanActivateFn, Router, Routes } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';
import { inject } from '@angular/core';

// Function that checks to see if a user is currently logged in one time
const resolveAuthUser = async (): Promise<boolean> =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(Boolean(user));
    });
  });

// Guard that only allows authenticated users to access routes if not redirects to login
const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const isAuthenticated = await resolveAuthUser();

  return isAuthenticated ? true : router.createUrlTree(['/login']);
};

// Guard that only allows guests to access routes if not authenticated redirects to dashboard
const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const isAuthenticated = await resolveAuthUser();

  return isAuthenticated ? router.createUrlTree(['/dashboard']) : true;
};

// For each route add canActivate with either authGuard or guestGuard
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () => import('./sign-up-component/sign-up-component').then((m) => m.SignUpComponent),
    title: 'Sign Up',
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login-component/login-component').then((m) => m.LoginComponent),
    title: 'Login',
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
    canActivate: [authGuard],
  },
  {
    path: 'subscription',
    loadComponent: () => import('./Subscription/SubscriptionDash').then((m) => m.SubscriptionDash),
    title: 'Subscription',
    canActivate: [authGuard],
  },
    {
    path: 'subscription/add',
    loadComponent: () => import('./Subscription/SubscriptionForm').then((m) => m.SubscriptionForm),
    title: 'Add Subscription',
    canActivate: [authGuard],
  },
    {
    path: 'subscription/:id/edit',
    loadComponent: () => import('./Subscription/SubscriptionForm').then((m) => m.SubscriptionForm),
    title: 'Edit Subscription',
    canActivate: [authGuard],
  },
    {
    path: 'loan',
    loadComponent: () => import('./Loan/LoanDash').then((m) => m.LoanDash),
    title: 'Loan',
    canActivate: [authGuard],
  },
    {
    path: 'loan/add',
    loadComponent: () => import('./Loan/LoanForm').then((m) => m.LoanForm),
    title: 'Add Loan',
    canActivate: [authGuard],
  },
  {
    path: 'loan/:id/edit',
    loadComponent: () => import('./Loan/LoanForm').then((m) => m.LoanForm),
    title: 'Edit Loan',
    canActivate: [authGuard],
  },
  {
    path: 'budgets',
    loadComponent: () => import('./pages/budget/budget').then((m) => m.Budget),
    title: 'Budgets',
    canActivate: [authGuard],
  },
  {
    path: 'transactions',
    loadComponent: () => import('./transaction-list/transaction-list').then((m) => m.TransactionList),
    title: 'Transactions',
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings-component/settings-component').then((m) => m.SettingsComponent),
    title: 'Settings',
    canActivate: [authGuard],
  },
];
