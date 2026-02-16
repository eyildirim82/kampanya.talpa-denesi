
import React, { useState } from 'react';
import { Search, Download, Trash2, Edit, Eye } from 'lucide-react';
import Card from '../Card';
import Badge from '../Badge';
import Input from '../Input';
import Button from '../Button';

interface ApplicationRow {
  id: string;
  name: string;
  campaign: string;
  date: string;
  status: any;
}

interface ApplicationTableProps {
  applications: ApplicationRow[];
  loading?: boolean;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card padding="none" className="overflow-hidden shadow-md border border-slate-200">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div>
           <h3 className="font-bold text-slate-900 text-lg">Başvurular</h3>
           <p className="text-sm text-slate-500">Tüm kampanya başvurularını yönetin</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
               type="text" 
               placeholder="İsim veya kampanya ara..." 
               className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-talpa-navy focus:border-talpa-navy outline-none transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Referans</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">İsim Soyisim</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kampanya</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {loading ? (
               <tr>
                 <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Yükleniyor...</td>
               </tr>
            ) : filteredApps.length === 0 ? (
               <tr>
                 <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Kayıt bulunamadı.</td>
               </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      #{app.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{app.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{app.campaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-talpa-navy hover:bg-blue-50 rounded-lg transition-colors" title="Detay">
                         <Eye className="h-4 w-4" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {!loading && filteredApps.length > 0 && (
         <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30">
            <span>Toplam {filteredApps.length} kayıt</span>
            <div className="flex gap-1">
               <button className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50 transition-colors" disabled>Önceki</button>
               <button className="px-2 py-1 rounded bg-talpa-navy text-white shadow-sm">1</button>
               <button className="px-2 py-1 rounded hover:bg-slate-100 transition-colors">2</button>
               <button className="px-2 py-1 rounded hover:bg-slate-100 transition-colors">Sonraki</button>
            </div>
         </div>
      )}
    </Card>
  );
};

export default ApplicationTable;
