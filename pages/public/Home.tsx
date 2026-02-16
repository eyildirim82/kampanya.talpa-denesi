
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Star, Percent, Loader2, Info } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Campaign, CampaignType } from '../../types';
import { getActiveCampaigns } from '../../services/api';
import { slugify } from '../../utils/string';

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getActiveCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to fetch campaigns', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getCampaignData = (campaign: Campaign) => {
    const title = campaign.pageContent?.heroTitle || campaign.title || campaign.name || 'Kampanya';
    const subtitle = campaign.pageContent?.heroSubtitle || campaign.description || 'Detaylar için tıklayınız.';
    const image = campaign.pageContent?.bannerImage || campaign.imageUrl || 'https://via.placeholder.com/800x600?text=TALPA';
    const slug = campaign.slug || slugify(campaign.campaignCode || campaign.name || '');
    return { title, subtitle, image, slug };
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#002855] py-24 lg:py-40 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute top-[60%] -left-[10%] w-[600px] h-[600px] rounded-full bg-deniz-red/10 blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 ring-1 ring-inset ring-white/20 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="mr-2 h-2 w-2 rounded-full bg-deniz-red"></span>
            TALPA Üyelerine Özel Ayrıcalıklar
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Ayrıcalıklar Dünyasına <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Hoş Geldiniz</span>
          </h1>
          
          <p className="mt-6 text-xl leading-8 text-slate-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Türkiye Havayolu Pilotları Derneği üyeleri için özel olarak hazırlanan finansal çözümler ve fırsatlar tek platformda.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" className="shadow-2xl shadow-blue-900/50 text-lg px-8 py-6" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Fırsatları Keşfet
            </Button>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-24 bg-slate-50 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Aktif Kampanyalar</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-talpa-navy to-deniz-red mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-lg text-slate-600">Size özel sunulan güncel avantajlar.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-talpa-navy" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex justify-center">
              <Card className="max-w-md w-full text-center py-12">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Aktif Kampanya Bulunmuyor</h3>
                <p className="text-slate-500 mt-2">Şu anda aktif bir kampanya mevcut değil. Lütfen daha sonra tekrar kontrol ediniz.</p>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => {
                const { title, subtitle, image, slug } = getCampaignData(campaign);
                
                return (
                  <Card key={campaign.id} padding="none" className="flex flex-col h-full overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative h-56 overflow-hidden bg-slate-200">
                      <img 
                        src={image} 
                        alt={title} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      
                      <div className="absolute top-4 right-4">
                        {campaign.type === CampaignType.CREDIT && campaign.interestRate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-deniz-red/90 backdrop-blur-sm px-3 py-1 text-sm font-bold text-white shadow-lg border border-white/20">
                            <Percent className="h-3 w-3" />
                            {campaign.interestRate}
                          </span>
                        )}
                      </div>
                      
                      <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                         <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                            {campaign.type === CampaignType.CREDIT && <CreditCard className="h-5 w-5" />}
                            {campaign.type === CampaignType.CARD && <Star className="h-5 w-5" />}
                            {campaign.type === CampaignType.GENERAL && <Star className="h-5 w-5" />}
                         </div>
                         <span className="text-sm font-medium opacity-90">{campaign.institutionName}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-1 group-hover:text-talpa-navy transition-colors">{title}</h3>
                      <p className="flex-1 text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3">
                        {subtitle}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100">
                         <Link to={`/kampanya/${slug}`}>
                            <Button fullWidth variant="outline" className="group-hover:bg-talpa-navy group-hover:text-white group-hover:border-talpa-navy" rightIcon={<ArrowRight className="h-4 w-4" />}>
                              Başvuru Yap
                            </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
