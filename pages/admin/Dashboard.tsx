
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Menu, X, CreditCard, Tag, Database, Building, ChevronRight, Plane } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card';
import Button from '../../components/Button';
import DashboardStats from '../../components/admin/DashboardStats';
import ApplicationTable from '../../components/admin/ApplicationTable';
import { getAdminStats, getAdminChartData, getAdminApplications, getActiveCampaigns } from '../../services/api';
import { Stats, Campaign } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data State
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Check Auth
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, chartRes, appsData, campaignsRes] = await Promise.all([
          getAdminStats(),
          getAdminChartData(),
          getAdminApplications(selectedCampaignId || undefined),
          getActiveCampaigns()
        ]);
        
        setStats(statsData);
        setChartData(chartRes);
        setApplications(appsData);
        setCampaigns(campaignsRes);
      } catch (error) {
        console.error('Data load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCampaignId]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
        <span className="font-medium">{label}</span>
        {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
                <Plane className="h-6 w-6" />
             </div>
             <div>
               <h1 className="font-bold text-lg leading-none">TALPA</h1>
               <span className="text-xs text-slate-500">Admin Portal</span>
             </div>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-slate-400 hover:text-white">
             <X className="h-6 w-6" />
           </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">Yönetim</div>
          <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Genel Bakış" />
          <SidebarItem to="/admin/campaigns" icon={FileText} label="Kampanyalar" />
          <SidebarItem to="/admin/interests" icon={Tag} label="Talepler" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-4">Sistem & Ayarlar</div>
          <SidebarItem to="/admin/whitelist" icon={Users} label="Üye Listesi" />
          <SidebarItem to="/admin/institutions" icon={Building} label="Kurumlar" />
          <SidebarItem to="/admin/fields" icon={Database} label="Alan Kütüphanesi" />
          <SidebarItem to="#" icon={Settings} label="Genel Ayarlar" />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <div className="flex items-center gap-3 mb-4 px-2">
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
               AD
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-sm font-medium text-white truncate">Admin User</div>
               <div className="text-xs text-slate-500 truncate">admin@talpa.org</div>
             </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu className="h-6 w-6" /></button>
             <div>
               <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
               <p className="text-xs text-slate-500 hidden sm:block">Hoşgeldiniz, sistem durum özeti aşağıdadır.</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:text-talpa-navy hover:bg-blue-50 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          
          {/* Stats */}
          {stats && <DashboardStats stats={stats} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2">
              <Card className="h-[400px] flex flex-col shadow-md">
                <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="text-lg font-bold text-slate-900">Başvuru Analizi</h3>
                     <p className="text-sm text-slate-500">Günlük başvuru dağılımı</p>
                   </div>
                   <select className="text-sm border-slate-200 rounded-lg focus:ring-talpa-navy bg-slate-50 py-1.5 pl-3 pr-8 text-slate-600 font-medium">
                     <option>Son 7 Gün</option>
                     <option>Bu Ay</option>
                   </select>
                </div>
                <div className="flex-1 w-full h-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        cursor={{fill: '#f1f5f9'}}
                      />
                      <Bar dataKey="basvuru" fill="#002855" radius={[4, 4, 0, 0]} barSize={32} activeBar={{ fill: '#E30613' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="h-full bg-gradient-to-br from-[#002855] to-[#00152e] text-white border-none shadow-xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-lg font-bold mb-1">Hızlı Erişim</h3>
                  <p className="text-blue-200 text-sm mb-6">Sık kullanılan işlemler.</p>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 backdrop-blur-sm group text-left">
                      <span className="font-medium">Kampanya Oluştur</span>
                      <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 backdrop-blur-sm group text-left">
                      <span className="font-medium">Rapor İndir (Excel)</span>
                      <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 backdrop-blur-sm group text-left">
                      <span className="font-medium">Sistem Logları</span>
                      <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Campaign Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
             <button 
               onClick={() => setSelectedCampaignId(null)}
               className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${!selectedCampaignId ? 'bg-talpa-navy text-white shadow-lg shadow-talpa-navy/25' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
             >
               Tüm Başvurular
             </button>
             {campaigns.map(c => (
               <button 
                 key={c.id}
                 onClick={() => setSelectedCampaignId(c.id)}
                 className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCampaignId === c.id ? 'bg-talpa-navy text-white shadow-lg shadow-talpa-navy/25' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
               >
                 {c.title || c.name}
               </button>
             ))}
          </div>

          {/* Table */}
          <ApplicationTable applications={applications} loading={loading} />
          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
