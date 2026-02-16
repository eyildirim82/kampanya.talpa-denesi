
import React from 'react';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import Card from '../Card';
import { Stats } from '../../types';

interface DashboardStatsProps {
  stats: Stats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card padding="md" className="relative overflow-hidden group hover:border-talpa-navy/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <FileText className="h-16 w-16 text-talpa-navy" />
        </div>
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-blue-50 text-talpa-navy rounded-lg">
             <FileText className="h-5 w-5" />
           </div>
           <div className="text-sm text-slate-500 font-medium">Toplam Başvuru</div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{stats.totalApplications.toLocaleString()}</div>
        <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> %12 geçen hafta
        </div>
      </Card>

      <Card padding="md" className="relative overflow-hidden group hover:border-amber-500/30">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="h-16 w-16 text-amber-600" />
        </div>
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
             <Activity className="h-5 w-5" />
           </div>
           <div className="text-sm text-slate-500 font-medium">Bekleyen Onay</div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{stats.pendingReviews}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium">İşlem sırasına göre</div>
      </Card>

      <Card padding="md" className="relative overflow-hidden group hover:border-blue-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="h-16 w-16 text-blue-600" />
        </div>
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
             <TrendingUp className="h-5 w-5" />
           </div>
           <div className="text-sm text-slate-500 font-medium">Aktif Kampanya</div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{stats.activeCampaigns}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium">Yayında olanlar</div>
      </Card>

      <Card padding="md" className="relative overflow-hidden group hover:border-green-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users className="h-16 w-16 text-green-600" />
        </div>
         <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-green-50 text-green-600 rounded-lg">
             <Users className="h-5 w-5" />
           </div>
           <div className="text-sm text-slate-500 font-medium">Günlük Ziyaret</div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{stats.dailyRequests}</div>
        <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> %5 artış
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
