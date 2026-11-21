import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AuthProvider,
  AuthProviderNoUserManagerProps
} from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.scss';

import Layout from './components/Layout';
import SuspenseFallback from './components/SuspenseFallback';
import ErrorBoundary from './components/ErrorBoundary';
import { routes } from './routes';
import { ApiError } from './utils/api';
import { setupClients } from './utils/clients';

const rootElem = document.getElementById('root');

if (rootElem) {
  setupClients();

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, err) =>
          !(err instanceof ApiError && err.status < 500) && failureCount < 3,
        staleTime: 30000
      }
    }
  });
  const oidcConfig: AuthProviderNoUserManagerProps = {
    authority: 'http://localhost:11384/realms/pantry',
    client_id: 'pantry-web',
    redirect_uri: `${window.location.origin}/`,
    post_logout_redirect_uri: `${window.location.origin}/`,
    scope: 'openid profile email',
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    onSigninCallback: () => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };
  const root = createRoot(rootElem);
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: routes
    }
  ]);

  root.render(
    <Suspense fallback={<SuspenseFallback />}>
      <AuthProvider {...oidcConfig}>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </Suspense>
  );
}
