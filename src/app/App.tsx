import { useEffect, useState } from 'react';
import HomePage from '../pages/home/HomePage';
import AdminPage from '../pages/admin/AdminPage';

function getCurrentPathname() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return window.location.pathname;
}

function App() {
  const [pathname, setPathname] = useState(getCurrentPathname);

  useEffect(() => {
    const handleNavigation = () => {
      setPathname(getCurrentPathname());
    };

    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return <AdminPage />;
  }

  return <HomePage />;
}

export default App;
