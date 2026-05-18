import { lazy, Suspense, useEffect, useState } from 'react';
import { getHomeRouteMode } from '../pages/home/homeRoutes';
import { getCurrentAppPath, navigateToAppPath, subscribeToAppNavigation } from './navigation';

const HomePage = lazy(() => import('../pages/home/HomePage'));
const AdminPage = lazy(() => import('../pages/admin/AdminPage'));

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return getCurrentAppPath();
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const queryStartIndex = currentPath.indexOf('?');
  const pathname = queryStartIndex >= 0 ? currentPath.slice(0, queryStartIndex) : currentPath;
  const search = queryStartIndex >= 0 ? currentPath.slice(queryStartIndex) : '';

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(getCurrentPath());
    };

    return subscribeToAppNavigation(handleNavigation);
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      navigateToAppPath('/explore', { replace: true });
    }
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <HomePage
        locationSearch={search}
        routeMode={getHomeRouteMode(pathname)}
      />
    </Suspense>
  );
}

export default App;
