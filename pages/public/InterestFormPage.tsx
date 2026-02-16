import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import { getCampaignBySlug, submitInterestAction } from '../../services/api';
import { Campaign } from '../../types';

const InterestFormPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Data State
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tckn: '',
    note: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const data = await getCampaignBySlug(slug || '');
        if (data) {
          setCampaign(data);
        } else {
          setError('Kampanya bulunamadı.');
        }
      } catch (err) {
        setError('Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [slug]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const result = await submitInterestAction(campaign?.id || '', formData);

      if (result.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setSubmitError(result.message || 'Bir hata oluştu.');
      }
    } catch (err) {
      setSubmitError('Bağlantı hatası veya sunucu kaynaklı bir sorun oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-deniz-red mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Kampanya Bulunamadı</h2>
        <p className="text-slate-600 mt-2 mb-6">Aradığınız kampanya mevcut değil veya yayından kaldırılmış.</p>
        <Link to="/"><Button>Ana Sayfaya Dön</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-talpa-navy pt-20 pb-32">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tüm Kampanyalar
          </Link>
          <h1 className="text-3xl font-bold text-white mb-4">{campaign.title || campaign.name}</h1>
          <p className="text-blue-100 text-lg">Bu kampanya için ön talep oluşturarak ilginizi belirtebilirsiniz.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-20">
        <Card className="shadow-xl">
          {isSuccess ? (
            <div className="text-center py-12 animate-in zoom-in">
              <div className="mx-auto h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Talebiniz Alındı!</h2>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                Ön talebiniz başarıyla kaydedilmiştir. İlginiz için teşekkür ederiz. Konuyla ilgili en kısa sürede sizinle iletişime geçilecektir.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/')}>Ana Sayfaya Dön</Button>
                <Button onClick={() => window.location.reload()}>Yeni Talep Oluştur</Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Talep Formu</h2>
                <p className="text-sm text-slate-500 mt-1">Lütfen iletişim bilgilerinizi eksiksiz doldurunuz.</p>
              </div>

              {submitError && <Alert variant="error" className="mb-6">{submitError}</Alert>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input 
                    label="Ad Soyad" 
                    placeholder="Tam adınız" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    error={fieldErrors.fullName}
                    className="col-span-2 sm:col-span-1"
                  />
                  <Input 
                    label="T.C. Kimlik No" 
                    placeholder="11111111111" 
                    maxLength={11}
                    required 
                    value={formData.tckn}
                    onChange={(e) => handleChange('tckn', e.target.value.replace(/\D/g, ''))}
                    error={fieldErrors.tckn}
                    className="col-span-2 sm:col-span-1"
                  />
                  <Input 
                    label="E-Posta Adresi" 
                    type="email" 
                    placeholder="ornek@email.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={fieldErrors.email}
                    className="col-span-2"
                  />
                  <Input 
                    label="Cep Telefonu (İsteğe bağlı)" 
                    type="tel" 
                    placeholder="5XX XXX XX XX" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="col-span-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Notunuz (İsteğe bağlı)</label>
                  <textarea 
                    rows={3}
                    className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-talpa-navy focus-visible:ring-offset-2"
                    placeholder="Varsa eklemek istedikleriniz..."
                    value={formData.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <Button fullWidth size="lg" isLoading={isSubmitting} rightIcon={!isSubmitting ? <Send className="h-4 w-4" /> : undefined}>
                    {isSubmitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-4">
                    Bu form aracılığıyla ilettiğiniz bilgiler sadece kampanya bilgilendirmesi amacıyla kullanılacaktır.
                  </p>
                </div>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InterestFormPage;