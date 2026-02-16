
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, MoreHorizontal, Pause, Play, Eye } from 'lucide-react';
import { getAdminCampaigns, updateCampaignStatus, deleteCampaign } from '../../services/api';
import { Campaign, CampaignStatus } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

const CampaignList: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getAdminCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Kampanyalar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: CampaignStatus) => {
    if (!window.confirm(`Kampanya durumunu '${newStatus}' olarak değiştirmek istiyor musunuz?`)) return;
    
    const result = await updateCampaignStatus(id, newStatus);
    if (result.success) {
      loadCampaigns();
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kampanyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

    const result = await deleteCampaign(id);
    if (result.success) {
      loadCampaigns();
    } else {
      alert(result.message);
    }
  };

  const getStatusBadge = (status?: CampaignStatus) => {
    switch (status) {
      case 'active': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Yayında</span>;
      case 'draft': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">Taslak</span>;
      case 'paused': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Durduruldu</span>;
      case 'closed': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Kapandı</span>;
      default: 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Bilinmiyor</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin/dashboard" className="text-slate-500 hover:text-talpa-navy flex items-center gap-1 text-sm mb-2 font-medium">
              <ArrowLeft className="h-4 w-4" /> Dashboard'a Dön
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Kampanya Yönetimi</h1>
            <p className="text-sm text-slate-500 mt-1">Tüm kampanyaları listeleyin ve yönetin.</p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => alert('Flow 07 kapsamındadır (Create Campaign)')}>
            Yeni Kampanya
          </Button>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <Card padding="none" className="overflow-hidden border border-slate-200 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kampanya Bilgisi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kurum</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Başvuru / Kota</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih Aralığı</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Yükleniyor...</td></tr>
                ) : campaigns.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-900 group-hover:text-talpa-navy transition-colors">{campaign.title || campaign.name}</span>
                           <span className="text-xs text-slate-500 font-mono mt-0.5">{campaign.campaignCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {campaign.institutionName || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                             <div 
                               className="h-full bg-blue-500 rounded-full" 
                               style={{ width: `${Math.min(((campaign.applicationCount || 0) / (campaign.maxQuota || 1000)) * 100, 100)}%` }}
                             ></div>
                          </div>
                          <span className="text-xs font-medium text-slate-600">{campaign.applicationCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <div className="flex flex-col">
                           <span>{new Date(campaign.startDate || '').toLocaleDateString('tr-TR')}</span>
                           <span className="text-slate-400">to {new Date(campaign.endDate || '').toLocaleDateString('tr-TR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {campaign.status === 'draft' && (
                             <button title="Yayınla" onClick={() => handleStatusChange(campaign.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                               <Play className="h-4 w-4" />
                             </button>
                          )}
                          {campaign.status === 'active' && (
                             <button title="Durdur" onClick={() => handleStatusChange(campaign.id, 'paused')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                               <Pause className="h-4 w-4" />
                             </button>
                          )}
                          {campaign.status === 'paused' && (
                             <button title="Devam Et" onClick={() => handleStatusChange(campaign.id, 'active')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                               <Play className="h-4 w-4" />
                             </button>
                          )}
                          
                          <Link to={`/admin/campaigns/${campaign.id}`}>
                            <button title="Düzenle" className="p-2 text-slate-400 hover:text-talpa-navy hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          
                          {campaign.status === 'draft' && (
                            <button title="Sil" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(campaign.id)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CampaignList;
