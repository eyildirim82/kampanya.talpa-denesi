import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Percent, Calendar, ShieldCheck, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import DynamicForm from '../../components/DynamicForm';
import { verifyTcknAction, getCampaignBySlug, submitApplicationAction } from '../../services/api';
import { Campaign, CampaignType } from '../../types';

type ApplicationStage = 'INIT' | 'FORM' | 'SUCCESS';

const CampaignDetail: React.FC = () => {
  const { slug } = useParams();
  
  // Data State
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);

  // Flow State
  const [stage, setStage] = useState<ApplicationStage>('INIT');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // TCKN State
  const [tckn, setTckn] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Fetch Campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!slug) return;
      try {
        const data = await getCampaignBySlug(slug);
        setCampaign(data || null);
      } catch (err) {
        console.error('Campaign fetch error', err);
      } finally {
        setLoadingCampaign(false);
      }
    };
    fetchCampaign();
  }, [slug]);

  // --- Actions ---

  const handleTcknVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError(null);

    const cleanTckn = tckn.replace(/\D/g, '');
    if (cleanTckn.length !== 11) {
      setVerifyError('TCKN 11 haneli olmalıdır.');
      setVerifying(false);
      return;
    }

    try {
      const result = await verifyTcknAction(cleanTckn, campaign?.id || '');
      
      if (result.status === 'SUCCESS' && result.token) {
        setSessionToken(result.token);
        setStage('FORM');
      } else {
        setVerifyError(result.message || 'Doğrulama başarısız.');
      }
    } catch (err) {
      setVerifyError('Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setVerifying(false);
    }
  };

  // Only for Credit Campaign (Hardcoded legacy form)
  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate credit submission
    setTimeout(() => setStage('SUCCESS'), 1500);
  };

  // --- Sub-Components ---

  const SuccessView = () => (
    <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
        <Check className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Başvurunuz Alındı!</h3>
      <p className="text-slate-600 mb-8 max-w-sm mx-auto">
        Başvurunuz başarıyla sistemimize kaydedilmiştir.
      </p>
      <div className="flex flex-col gap-3">
        <Button variant="outline" fullWidth onClick={() => window.location.reload()}>Yeni Başvuru Yap</Button>
        <Link to="/">
          <Button variant="ghost" fullWidth>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  );

  const CreditForm = () => (
    <form onSubmit={handleCreditSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <Input label="Ad Soyad" required />
      <Input label="Cep Telefonu" required />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Talep Edilen Tutar</label>
        <select className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option>100.000 TL</option>
          <option>250.000 TL</option>
          <option>500.000 TL</option>
        </select>
      </div>
      <Button fullWidth size="lg" className="mt-4" isLoading={verifying}>Başvur</Button>
    </form>
  );

  if (loadingCampaign) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Yükleniyor...</div>;
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <AlertTriangle className="h-12 w-12 text-deniz-red mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Kampanya Bulunamadı</h2>
        <p className="text-slate-600 mt-2 mb-6">Aradığınız kampanya yayından kaldırılmış veya mevcut değil.</p>
        <Link to="/"><Button>Ana Sayfaya Dön</Button></Link>
      </div>
    );
  }

  const { title, name, description, pageContent, features, formSchema, type } = campaign;
  const displayTitle = pageContent?.heroTitle || title || name;
  const displaySubtitle = pageContent?.heroSubtitle || description;
  const isCredit = type === CampaignType.CREDIT;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Detail Header */}
      <div className="bg-talpa-navy text-white pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kampanyalara Dön
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{displayTitle}</h1>
            <p className="text-lg text-slate-300">{displaySubtitle}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="space-y-6">
              <h2 className="text-2xl font-bold text-talpa-navy">Kampanya Detayları</h2>
              
              {/* Features Grid */}
              {(features || isCredit) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(features || [
                    { title: 'Avantajlı Oranlar', description: 'Size özel faiz/puan' },
                    { title: 'Kolay Başvuru', description: 'Sadece TCKN ile' }
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <ShieldCheck className="h-6 w-6 text-talpa-navy shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-900">{feat.title}</h4>
                        <p className="text-sm text-slate-600">{feat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div 
                className="prose prose-slate max-w-none text-slate-600"
                dangerouslySetInnerHTML={{ __html: campaign.longDescription || `<p>${campaign.description}</p>` }} 
              />
            </Card>

            {/* Mock Credit Table */}
            {isCredit && (
               <Card>
                 <h3 className="text-xl font-bold text-talpa-navy mb-4">Örnek Ödeme Tablosu</h3>
                 <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-slate-200 text-sm">
                     <thead className="bg-slate-50">
                       <tr><th className="px-4 py-2">Tutar</th><th className="px-4 py-2">Vade</th><th className="px-4 py-2">Taksit</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       <tr><td className="px-4 py-2">100.000 TL</td><td className="px-4 py-2">12 Ay</td><td className="px-4 py-2 font-bold">10.850 TL</td></tr>
                     </tbody>
                   </table>
                 </div>
               </Card>
            )}
          </div>

          {/* Form Card (Right) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className={`border-t-4 ${stage === 'SUCCESS' ? 'border-t-green-500' : 'border-t-talpa-navy'}`}>
                
                {stage === 'INIT' && (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Başvuru Yap</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Başvuruya devam etmek için T.C. Kimlik Numaranızı girin. Üyeliğiniz doğrulanacaktır.
                    </p>
                    
                    {verifyError && (
                      <Alert variant="error" className="mb-4 text-sm">
                        {verifyError}
                      </Alert>
                    )}

                    <form onSubmit={handleTcknVerify} className="space-y-4">
                      <Input 
                        label="TC Kimlik No" 
                        placeholder="11111111111" 
                        maxLength={11}
                        value={tckn}
                        onChange={(e) => setTckn(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                      <Button fullWidth size="lg" className="mt-2" isLoading={verifying}>
                        Devam Et <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </form>
                  </>
                )}

                {stage === 'FORM' && (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Başvuru Formu</h3>
                    <p className="text-sm text-slate-500 mb-6">Lütfen bilgilerinizi eksiksiz doldurunuz.</p>
                    {isCredit ? (
                      <CreditForm />
                    ) : (
                      formSchema && formSchema.length > 0 ? (
                        <DynamicForm 
                          schema={formSchema} 
                          campaignId={campaign.id} 
                          sessionToken={sessionToken || ''}
                          onSuccess={() => setStage('SUCCESS')} 
                        />
                      ) : (
                        <Alert variant="warning">Bu kampanya için form tanımlanmamış.</Alert>
                      )
                    )}
                  </>
                )}

                {stage === 'SUCCESS' && <SuccessView />}
              </Card>

              {stage !== 'SUCCESS' && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                   <ShieldCheck className="h-4 w-4" />
                   <span>Güvenli Başvuru</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;