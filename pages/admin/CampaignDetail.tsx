import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Layout, FileText, Mail } from 'lucide-react';
import { getCampaignById, updateCampaignConfig } from '../../services/api';
import { Campaign, FormField } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import FormBuilder from '../../components/FormBuilder';
import EmailConfig from '../../components/admin/EmailConfig';
import Alert from '../../components/Alert';

type Tab = 'details' | 'form' | 'email';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Campaign State
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  
  // Editable Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  
  // Page Content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getCampaignById(id);
      if (data) {
        setCampaign(data);
        setTitle(data.title || data.name || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setFormFields(data.formSchema || []);
        
        // Page Content
        setHeroTitle(data.pageContent?.heroTitle || '');
        setHeroSubtitle(data.pageContent?.heroSubtitle || '');
        setBannerImage(data.pageContent?.bannerImage || '');
      } else {
        alert('Kampanya bulunamadı.');
        navigate('/admin/campaigns');
      }
      setLoading(false);
    };
    loadData();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true);
    
    const payload: Partial<Campaign> = {
      title,
      slug,
      description,
      formSchema: formFields,
      pageContent: {
        ...campaign.pageContent,
        heroTitle,
        heroSubtitle,
        bannerImage
      }
    };

    const result = await updateCampaignConfig(campaign.id, payload);
    if (result.success) {
      alert('Değişiklikler kaydedildi.');
    } else {
      alert('Hata: ' + result.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/admin/campaigns" className="text-slate-500 hover:text-talpa-navy">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
             <h1 className="text-xl font-bold text-slate-900">{campaign.title}</h1>
             <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono">{campaign.campaignCode}</span>
                <span className={`px-2 py-0.5 rounded-full ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                  {campaign.status}
                </span>
             </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/kampanya/${campaign.slug}`} target="_blank">
             <Button variant="secondary" leftIcon={<Eye className="h-4 w-4" />}>Önizle</Button>
          </Link>
          <Button onClick={handleSave} isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>
            Kaydet
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${activeTab === 'details' ? 'border-talpa-navy text-talpa-navy' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Layout className="h-4 w-4" /> Detaylar & İçerik
          </button>
          <button 
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${activeTab === 'form' ? 'border-talpa-navy text-talpa-navy' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileText className="h-4 w-4" /> Başvuru Formu
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${activeTab === 'email' ? 'border-talpa-navy text-talpa-navy' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Mail className="h-4 w-4" /> E-posta Ayarları
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
            <Card className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b pb-2">Temel Bilgiler</h3>
              <Input label="Kampanya Başlığı" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="space-y-1">
                 <label className="text-sm font-medium text-slate-700">Slug (URL)</label>
                 <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2.5 text-slate-500 text-sm">/kampanya/</span>
                    <input 
                      className="flex-1 rounded-r-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                 </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Kısa Açıklama</label>
                <textarea 
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b pb-2">Sayfa İçeriği</h3>
              <Input label="Hero Başlık" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              <Input label="Hero Alt Başlık" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
              <Input label="Banner Görsel URL" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} />
              {bannerImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-32 bg-slate-100">
                  <img src={bannerImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-900">Form Alanları ({formFields.length})</h3>
               <div className="text-xs text-slate-500">Sürükle bırak özelliği henüz aktif değil. Okları kullanın.</div>
            </div>
            <FormBuilder fields={formFields} onChange={setFormFields} />
          </div>
        )}

        {activeTab === 'email' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <EmailConfig campaignId={campaign.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
