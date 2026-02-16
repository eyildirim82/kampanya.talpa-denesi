
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Check, MapPin, Building, CreditCard, Plane, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import { verifyTcknAction, submitApplicationAction, getActiveCampaigns, getCampaignBySlug } from '../../services/api';
import { Campaign, FormField } from '../../types';

const ApplicationForm: React.FC = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data State
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  // Flow State
  const [stage, setStage] = useState<'INIT' | 'FORM' | 'SUCCESS'>('INIT');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // Form State
  const [tckn, setTckn] = useState(searchParams.get('tckn') || '');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryMethod: 'branch', // 'branch' | 'address'
    address: '',
    addressSharingConsent: false,
    cardApplicationConsent: false,
    tcknPhoneSharingConsent: false,
    extraFields: {} as Record<string, any>
  });

  // Check for session from Login (Flow 06)
  useEffect(() => {
    if (location.state?.sessionToken) {
      setSessionToken(location.state.sessionToken);
      setStage('FORM');
      // If TCKN wasn't in URL, try to get it from state if passed (though we use URL param primarily)
      if (!tckn && location.state?.tckn) {
        setTckn(location.state.tckn);
      }
    }
  }, [location.state]);

  // Fetch Campaign Logic
  useEffect(() => {
    const fetchCampaign = async () => {
      setLoadingCampaign(true);
      try {
        let data: Campaign | undefined;
        if (slug) {
          data = await getCampaignBySlug(slug);
        } else {
          const actives = await getActiveCampaigns();
          data = actives.length > 0 ? actives[0] : undefined;
        }

        if (data) {
          setCampaign(data);
        } else {
          setCampaignError('Aktif kampanya veya başvuru dönemi bulunamadı.');
        }
      } catch (err) {
        setCampaignError('Kampanya bilgileri yüklenirken hata oluştu.');
      } finally {
        setLoadingCampaign(false);
      }
    };
    fetchCampaign();
  }, [slug]);

  // TCKN Verify Logic
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError(null);

    const cleanTckn = tckn.replace(/\D/g, '');
    if (cleanTckn.length !== 11) {
      setVerifyError('TC Kimlik Numarası 11 haneli olmalıdır.');
      setVerifying(false);
      return;
    }

    try {
      // Use campaign ID if available, otherwise generic
      const result = await verifyTcknAction(cleanTckn, campaign?.id || 'generic');
      
      if (result.status === 'SUCCESS' && result.token) {
        setSessionToken(result.token);
        setStage('FORM');
      } else {
        setVerifyError(result.message || 'Kimlik doğrulama başarısız.');
      }
    } catch (err) {
      setVerifyError('Bağlantı hatası. Lütfen tekrar deneyiniz.');
    } finally {
      setVerifying(false);
    }
  };

  // Form Change Handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExtraFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      extraFields: { ...prev.extraFields, [name]: value }
    }));
  };

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) {
      setSubmitError('Oturum bilgisi bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
      return;
    }

    // Validation
    if (formData.deliveryMethod === 'address' && (!formData.address || formData.address.length < 10)) {
      setSubmitError('Lütfen geçerli bir teslimat adresi giriniz (en az 10 karakter).');
      return;
    }
    if (formData.deliveryMethod === 'address' && !formData.addressSharingConsent) {
      setSubmitError('Adrese teslimat için adres paylaşım izni gereklidir.');
      return;
    }
    if (!formData.cardApplicationConsent) {
      setSubmitError('Başvuru onayı gereklidir.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''), // Normalize phone
        tckn, // from state
        campaignId: campaign?.id
      };
      
      const result = await submitApplicationAction(payload, sessionToken);
      
      // Since submitApplicationAction returns generic success in mock:
      setStage('SUCCESS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Başvuru gönderilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCampaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-deniz-red mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Kampanya Bulunamadı</h2>
        <p className="text-slate-600 mt-2 mb-6 text-center max-w-md">{campaignError || 'Aradığınız kampanya mevcut değil.'}</p>
        <Button onClick={() => navigate('/')}>Ana Sayfaya Dön</Button>
      </div>
    );
  }

  // Determine Features/Benefits to show
  const benefits = [
    { icon: <Plane className="h-5 w-5" />, title: 'IGA Lounge Ücretsiz', desc: 'Yurt dışı uçuşlarınızda ayrıcalıklı bekleme salonu.' },
    { icon: <ShieldCheck className="h-5 w-5" />, title: 'Seyahat Sigortası', desc: 'Kapsamlı yurt dışı seyahat sigortası hediye.' },
    { icon: <CreditCard className="h-5 w-5" />, title: 'Restoran İndirimi', desc: 'Anlaşmalı restoranlarda %20 indirim.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner */}
      <div className="h-48 md:h-64 bg-talpa-navy relative overflow-hidden">
        <img 
          src={campaign.pageContent?.bannerImage || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2000"} 
          alt="Campaign Banner" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-talpa-navy/90 to-transparent flex items-end">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 w-full pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{campaign.title || campaign.name}</h1>
            <p className="text-blue-100 text-lg max-w-2xl">{campaign.pageContent?.heroSubtitle || campaign.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Form Area */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-t-4 border-t-deniz-red">
              
              {stage === 'INIT' && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Kampanya Başvuru Formu</h2>
                    <p className="text-slate-500 text-sm mt-1">Lütfen bilgilerinizi doğrulayarak başlayınız.</p>
                  </div>
                  
                  {verifyError && <Alert variant="error" className="mb-6">{verifyError}</Alert>}

                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Input 
                          label="T.C. Kimlik Numarası" 
                          placeholder="11111111111" 
                          maxLength={11}
                          value={tckn}
                          onChange={(e) => setTckn(e.target.value.replace(/\D/g, ''))}
                          required
                        />
                      </div>
                      <Button className="mb-1.5" isLoading={verifying}>
                        Doğrula
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      TALPA üyelik kontrolü yapılacaktır.
                    </p>
                  </form>
                </div>
              )}

              {stage === 'FORM' && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-slate-900">Başvuru Bilgileri</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">TCKN: {tckn}</span>
                      <span className="text-xs text-green-600 flex items-center"><Check className="h-3 w-3 mr-0.5" /> Doğrulandı</span>
                    </div>
                  </div>

                  {submitError && <Alert variant="error">{submitError}</Alert>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Ad Soyad" 
                      placeholder="Kimlikteki tam adınız" 
                      required 
                      className="col-span-2"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                    <Input 
                      label="Cep Telefonu" 
                      placeholder="5XX XXX XX XX" 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                    <Input 
                      label="E-Posta Adresi" 
                      type="email" 
                      placeholder="ornek@email.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  {/* Delivery Preference */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                    <label className="text-sm font-medium text-slate-700 block">Teslimat Tercihi <span className="text-deniz-red">*</span></label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.deliveryMethod === 'branch' ? 'border-talpa-navy bg-white shadow-sm ring-1 ring-talpa-navy' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="delivery" 
                          value="branch" 
                          checked={formData.deliveryMethod === 'branch'}
                          onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                          className="text-talpa-navy focus:ring-talpa-navy"
                        />
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-slate-500" />
                          <span className="text-sm font-medium">Şubeden Teslim</span>
                        </div>
                      </label>
                      <label className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.deliveryMethod === 'address' ? 'border-talpa-navy bg-white shadow-sm ring-1 ring-talpa-navy' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="delivery" 
                          value="address" 
                          checked={formData.deliveryMethod === 'address'}
                          onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                          className="text-talpa-navy focus:ring-talpa-navy"
                        />
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-slate-500" />
                          <span className="text-sm font-medium">Adresime Gönder</span>
                        </div>
                      </label>
                    </div>

                    {formData.deliveryMethod === 'address' && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                         <label className="text-sm font-medium text-slate-700 block mb-1.5">Teslimat Adresi <span className="text-deniz-red">*</span></label>
                         <textarea 
                            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-talpa-navy focus:outline-none"
                            rows={3}
                            placeholder="Mahalle, Cadde, Sokak, No, İlçe/İl..."
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                         />
                         <label className="flex items-start gap-2 mt-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="mt-1 rounded text-talpa-navy focus:ring-talpa-navy"
                              checked={formData.addressSharingConsent}
                              onChange={(e) => handleInputChange('addressSharingConsent', e.target.checked)}
                            />
                            <span className="text-xs text-slate-600">
                              Kartımın teslimi için adres bilgilerimin kurye firması ile paylaşılmasını onaylıyorum.
                            </span>
                         </label>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Fields */}
                  {campaign.formSchema && campaign.formSchema.length > 0 && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-900">Ek Bilgiler</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {campaign.formSchema.map((field: FormField) => (
                           <div key={field.id || field.name} className={field.width === 'full' ? 'col-span-2' : 'col-span-1'}>
                              {field.type === 'select' ? (
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-sm font-medium text-slate-700">{field.label}</label>
                                  <select 
                                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy"
                                    required={field.required}
                                    onChange={(e) => handleExtraFieldChange(field.name, e.target.value)}
                                  >
                                    <option value="">Seçiniz</option>
                                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                                </div>
                              ) : (
                                <Input 
                                  label={field.label}
                                  type={field.type}
                                  required={field.required}
                                  placeholder={field.placeholder}
                                  onChange={(e) => handleExtraFieldChange(field.name, e.target.value)}
                                />
                              )}
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consents */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-2 cursor-pointer p-3 rounded bg-slate-50">
                      <input 
                        type="checkbox" 
                        className="mt-1 rounded text-talpa-navy focus:ring-talpa-navy"
                        required
                        checked={formData.cardApplicationConsent}
                        onChange={(e) => handleInputChange('cardApplicationConsent', e.target.checked)}
                      />
                      <span className="text-xs text-slate-700 font-medium">
                        Yukarıdaki bilgilerimle DenizBank kredi kartı başvurusunda bulunmayı kabul ve beyan ederim.
                      </span>
                    </label>
                    
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1 rounded text-talpa-navy focus:ring-talpa-navy"
                        required
                        checked={formData.tcknPhoneSharingConsent}
                        onChange={(e) => handleInputChange('tcknPhoneSharingConsent', e.target.checked)}
                      />
                      <span className="text-xs text-slate-600">
                        Başvurumun değerlendirilmesi amacıyla TCKN ve iletişim bilgilerimin DenizBank A.Ş. ile paylaşılmasını onaylıyorum.
                      </span>
                    </label>
                  </div>

                  <Button fullWidth size="lg" isLoading={submitting}>
                    Başvuruyu Tamamla
                  </Button>
                </form>
              )}

              {stage === 'SUCCESS' && (
                <div className="text-center py-10 animate-in zoom-in">
                  <div className="mx-auto h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Check className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Başvurunuz Alındı!</h2>
                  <p className="text-slate-600 mt-3 mb-8 max-w-sm mx-auto">
                    Talebiniz işleme alınmıştır. Değerlendirme sonucu SMS ile tarafınıza iletilecektir.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left max-w-sm mx-auto border border-slate-100">
                    <h4 className="font-semibold text-slate-900 text-sm mb-2">Sonraki Adımlar</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Onaylanan kartlarınız tercih ettiğiniz teslimat yöntemine göre (Şube veya Adres) en kısa sürede tarafınıza ulaştırılacaktır. 
                      DenizBank Yeşilköy Şubesi yetkilileri gerekirse sizinle iletişime geçecektir.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <Button onClick={() => navigate('/sorgula')} variant="outline">Başvuru Sorgula</Button>
                    <Button onClick={() => navigate('/')} variant="ghost">Ana Sayfaya Dön</Button>
                  </div>
                </div>
              )}

            </Card>

            {/* Disclaimer Footer */}
            <div className="text-[10px] text-slate-400 text-justify leading-snug px-2">
              <p>
                <strong>Önemli Uyarı ve Sorumluluk Reddi:</strong> TALPA, işbu kampanya kapsamında yalnızca duyuru platformu olarak hareket etmektedir. 
                Kredi ve kredi kartı tahsis politikaları, faiz oranları ve onay süreçleri tamamen DenizBank A.Ş. sorumluluğundadır. 
                TALPA'nın finansal işlemlerle ilgili herhangi bir yasal sorumluluğu bulunmamaktadır.
              </p>
            </div>
          </div>

          {/* Sidebar / Benefits */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Özel Avantajlar</h3>
              <div className="space-y-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="shrink-0 h-10 w-10 rounded-lg bg-blue-50 text-talpa-navy flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{benefit.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-deniz-red to-deniz-dark rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">İhtiyaç Kredisi Fırsatı</h3>
              <p className="text-white/90 text-sm mb-4">Pilotlara özel faiz oranlarıyla nakit ihtiyaçlarınız için hemen başvurun.</p>
              <Button size="sm" variant="secondary" className="w-full text-deniz-red border-none hover:bg-white/90" onClick={() => navigate('/kampanya/pilot-ozel-kredi')}>
                Detayları Gör
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
