
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Search, Trash2, Filter, Mail, Phone, Calendar } from 'lucide-react';
import { getInterests, deleteInterest, getAdminCampaigns } from '../../services/api';
import { Interest, Campaign } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

const InterestList: React.FC = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedCampaignId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [interestsData, campaignsData] = await Promise.all([
        getInterests(selectedCampaignId === 'all' ? undefined : selectedCampaignId),
        getAdminCampaigns()
      ]);
      setInterests(interestsData);
      setCampaigns(campaignsData);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu talebi silmek istediğinize emin misiniz?')) return;
    
    const result = await deleteInterest(id);
    if (result.success) {
      setInterests(prev => prev.filter(i => i.id !== id));
    } else {
      alert(result.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Tarih', 'Kampanya', 'Ad Soyad', 'E-posta', 'Telefon', 'TCKN', 'Not'];
    const rows = filteredInterests.map(item => [
      new Date(item.createdAt).toLocaleDateString('tr-TR'),
      item.campaignName || '-',
      item.fullName,
      item.email,
      item.phone,
      item.tckn || '-',
      item.note ? `"${item.note.replace(/"/g, '""')}"` : '-'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(';'), ...rows.map(e => e.join(";"))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `talepler_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    alert('PDF İndirme özelliği şu anda hazırlanıyor. Lütfen CSV formatını kullanınız.');
  };

  const filteredInterests = interests.filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.tckn && item.tckn.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/admin/dashboard" className="text-slate-500 hover:text-talpa-navy flex items-center gap-1 text-sm mb-2 font-medium">
              <ArrowLeft className="h-4 w-4" /> Dashboard'a Dön
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Talep Yönetimi</h1>
            <p className="text-sm text-slate-500 mt-1">Kampanyalar için oluşturulan ön talepleri yönetin.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportCSV} leftIcon={<Download className="h-4 w-4" />}>
              Excel (CSV)
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportPDF} leftIcon={<FileText className="h-4 w-4" />}>
              PDF
            </Button>
          </div>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Filters */}
        <Card className="mb-6 shadow-sm border border-slate-200" padding="sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="İsim, E-posta veya TCKN ile ara..." 
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-talpa-navy focus:border-talpa-navy outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-72">
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select 
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-talpa-navy focus:border-talpa-navy appearance-none bg-white outline-none cursor-pointer"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                  <option value="all">Tüm Kampanyalar</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title || c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card padding="none" className="overflow-hidden border border-slate-200 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kişi Bilgisi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">İletişim</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kampanya</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Not</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Yükleniyor...</td></tr>
                ) : filteredInterests.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                ) : (
                  filteredInterests.map((interest) => (
                    <tr key={interest.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{interest.fullName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{interest.tckn}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 mb-1">
                           <Mail className="h-3 w-3 text-slate-400" />
                           <span>{interest.email}</span>
                        </div>
                        {interest.phone && (
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                             <Phone className="h-3 w-3 text-slate-400" />
                             <span>{interest.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-talpa-navy">
                        {interest.campaignName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={interest.note}>
                        {interest.note ? (
                          <span className="italic">"{interest.note}"</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                         <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {new Date(interest.createdAt).toLocaleDateString('tr-TR')}
                         </div>
                         <div className="text-[10px] text-slate-400 mt-1 pl-4.5">
                           {new Date(interest.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(interest.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredInterests.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30">
              <span>Toplam {filteredInterests.length} kayıt gösteriliyor</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InterestList;
