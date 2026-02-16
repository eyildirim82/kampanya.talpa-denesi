import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import PublicHeader from './components/PublicHeader';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import CampaignDetail from './pages/public/CampaignDetail';
import ApplicationForm from './pages/public/ApplicationForm';
import QueryStatus from './pages/public/QueryStatus';
import InterestFormPage from './pages/public/InterestFormPage';
import Login from './pages/public/Login';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import CampaignList from './pages/admin/CampaignList';
import AdminCampaignDetail from './pages/admin/CampaignDetail';
import InterestList from './pages/admin/InterestList';
import WhitelistManagement from './pages/admin/WhitelistManagement';
import FieldLibrary from './pages/admin/FieldLibrary';
import InstitutionList from './pages/admin/InstitutionList';

// Layout wrapper to conditionally show header/footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show public header/footer on admin pages
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kampanya/:slug" element={<CampaignDetail />} />
          <Route path="/basvuru" element={<ApplicationForm />} />
          <Route path="/basvuru/:slug" element={<ApplicationForm />} />
          <Route path="/talep/:slug" element={<InterestFormPage />} />
          <Route path="/sorgula" element={<QueryStatus />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/campaigns" element={<CampaignList />} />
          <Route path="/admin/campaigns/:id" element={<AdminCampaignDetail />} />
          <Route path="/admin/interests" element={<InterestList />} />
          <Route path="/admin/whitelist" element={<WhitelistManagement />} />
          <Route path="/admin/fields" element={<FieldLibrary />} />
          <Route path="/admin/institutions" element={<InstitutionList />} />
          
          {/* Fallback */}
          <Route path="*" element={<div className="p-20 text-center text-xl">404 - Sayfa Bulunamadı</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
