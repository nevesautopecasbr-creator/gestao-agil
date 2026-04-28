import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import LoginPage from '@/pages/Login';
import LandingPage from '@/pages/LandingPage';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;
const internalHomePath = mainPageKey ? `/${mainPageKey}` : '/Dashboard';

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

/** Evita open redirect: só caminhos relativos na mesma origem. */
function safePostLoginRedirect(raw) {
  if (!raw || typeof raw !== 'string') return internalHomePath;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded === '/') return internalHomePath;
    if (decoded.startsWith('/') && !decoded.startsWith('//')) return decoded;
  } catch {
    /* ignore */
  }
  return internalHomePath;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError, isAuthenticated } = useAuth();
  const location = useLocation();
  const isPublicPath = location.pathname === '/' || location.pathname === '/login';

  const renderProtectedPage = (pageName, Page) => {
    if (!isAuthenticated) {
      const next = `${location.pathname}${location.search}`;
      return <Navigate to={`/login?redirect=${encodeURIComponent(next)}`} replace />;
    }

    if (authError?.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }

    return (
      <LayoutWrapper currentPageName={pageName}>
        <Page />
      </LayoutWrapper>
    );
  };

  if (isLoadingAuth && !isPublicPath) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={safePostLoginRedirect(new URLSearchParams(location.search).get('redirect'))} replace />
            : <LoginPage />
        }
      />
      <Route
        path={internalHomePath}
        element={renderProtectedPage(mainPageKey, MainPage)}
      />
      {Object.entries(Pages)
        .filter(([path]) => `/${path}` !== internalHomePath)
        .map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={renderProtectedPage(path, Page)}
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
