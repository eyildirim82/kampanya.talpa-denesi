import { validateTckn } from '../utils/validation';
import { Campaign, CampaignType, FormField, ApplicationStatus, Stats, CampaignStatus, Interest, WhitelistMember, FieldTemplate, Institution } from '../types';

// Mock Data for Campaigns
let MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    slug: 'pilot-ozel-kredi',
    campaignCode: 'CREDIT_2026',
    title: 'Pilotlara Özel İhtiyaç Kredisi',
    name: 'Pilotlara Özel İhtiyaç Kredisi',
    description: 'Yüksek limitli, avantajlı faiz oranlarıyla ihtiyaç krediniz anında hesabınızda.',
    type: CampaignType.CREDIT,
    status: 'active',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    interestRate: '%3,35',
    active: true,
    pageContent: {
      heroTitle: 'Pilotlara Özel İhtiyaç Kredisi',
      heroSubtitle: 'Nakit ihtiyaçlarınız için avantajlı faiz oranları.',
      bannerImage: 'https://picsum.photos/800/600?random=1'
    },
    features: [
      { title: 'Avantajlı Oranlar', description: '%3,35\'ten başlayan faiz oranları' },
      { title: 'Esnek Vade', description: '36 aya varan vade seçenekleri' },
      { title: 'Anında Onay', description: 'Şubeye gitmeden dijital onay' }
    ],
    createdAt: '2026-02-01T10:00:00Z',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    institutionName: 'DenizBank',
    applicationCount: 450
  },
  {
    id: '2',
    slug: 'talpa-platinum-kart',
    campaignCode: 'CARD_2026',
    title: 'TALPA Platinum Kart',
    name: 'TALPA Platinum Kart',
    description: 'Yurt dışı harcamalarınızda ekstra puan ve lounge hizmeti ayrıcalığı.',
    type: CampaignType.CARD,
    status: 'active',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    active: true,
    pageContent: {
      heroTitle: 'TALPA Platinum Kart',
      heroSubtitle: 'Ayrıcalıklar dünyasına hoş geldiniz.',
    },
    longDescription: '<p>TALPA Platinum Kart ile dünyanın her yerinde ayrıcalıklısınız. Lounge kullanımı, seyahat sigortası ve restoran indirimleri sizi bekliyor.</p>',
    formSchema: [
      { id: 'f1', name: 'fullName', label: 'Ad Soyad', type: 'text', required: true, width: 'full', placeholder: 'Kimlikte yazan ad soyad' },
      { id: 'f2', name: 'phone', label: 'Cep Telefonu', type: 'tel', required: true, width: 'full', placeholder: '5XX XXX XX XX' },
      { id: 'f3', name: 'email', label: 'E-Posta', type: 'email', required: true, width: 'full' },
      { id: 'f4', name: 'monthlyIncome', label: 'Aylık Gelir', type: 'select', options: ['0-50.000 TL', '50.000-100.000 TL', '100.000 TL üzeri'], required: true, width: 'full' },
      { id: 'f5', name: 'deliveryType', label: 'Teslimat Tercihi', type: 'select', options: ['Adresime Gönderilsin', 'Şubeden Teslim'], required: true, width: 'full' },
      { id: 'f6', name: 'address', label: 'Teslimat Adresi', type: 'textarea', required: false, width: 'full' },
      { id: 'f7', name: 'kvkk', label: 'KVKK Aydınlatma Metni\'ni okudum, onaylıyorum.', type: 'checkbox', required: true, width: 'full' }
    ],
    createdAt: '2026-01-15T10:00:00Z',
    startDate: '2026-01-15',
    institutionName: 'DenizBank',
    applicationCount: 210
  },
  {
    id: '3',
    campaignCode: 'SIGORTA_2026',
    slug: 'mesleki-sorumluluk-sigortasi',
    name: 'Mesleki Sorumluluk Sigortası',
    type: CampaignType.GENERAL,
    status: 'draft',
    active: false,
    pageContent: {
      heroTitle: 'Güvenceniz Bizimle',
      heroSubtitle: 'Uçuşlarınızda güvence altında olun. TALPA üyelerine özel %20 indirim.',
      bannerImage: 'https://picsum.photos/800/600?random=3'
    },
    formSchema: [
      { id: 'f1', name: 'fullName', label: 'Ad Soyad', type: 'text', required: true, width: 'full' },
      { id: 'f2', name: 'phone', label: 'Cep Telefonu', type: 'tel', required: true, width: 'full' },
      { id: 'f3', name: 'licenseNo', label: 'Lisans Numarası', type: 'text', required: true, width: 'full' },
      { id: 'f4', name: 'airline', label: 'Havayolu Şirketi', type: 'select', options: ['THY', 'Pegasus', 'SunExpress', 'Diğer'], required: true, width: 'full' },
      { id: 'f5', name: 'kvkk', label: 'Açık rıza metnini onaylıyorum.', type: 'checkbox', required: true, width: 'full' }
    ],
    createdAt: '2026-02-05T10:00:00Z',
    institutionName: 'TALPA Sigorta',
    applicationCount: 0
  }
];

// Mock Interests Data
let MOCK_INTERESTS: Interest[] = [
  { id: '1', campaignId: '1', campaignName: 'Pilotlara Özel İhtiyaç Kredisi', fullName: 'Ali Yılmaz', email: 'ali@example.com', phone: '5551234567', tckn: '12345678901', note: 'Detaylı bilgi istiyorum.', createdAt: '2026-02-10T14:00:00Z' },
  { id: '2', campaignId: '2', campaignName: 'TALPA Platinum Kart', fullName: 'Ayşe Demir', email: 'ayse@example.com', phone: '5559876543', tckn: '23456789012', createdAt: '2026-02-11T09:30:00Z' },
  { id: '3', campaignId: '1', campaignName: 'Pilotlara Özel İhtiyaç Kredisi', fullName: 'Mehmet Öz', email: 'mehmet@example.com', phone: '5551112233', tckn: '34567890123', note: 'Vade seçeneklerini öğrenmek istiyorum.', createdAt: '2026-02-12T11:15:00Z' },
  { id: '4', campaignId: '3', campaignName: 'Mesleki Sorumluluk Sigortası', fullName: 'Zeynep Kaya', email: 'zeynep@example.com', phone: '5554445566', tckn: '45678901234', createdAt: '2026-02-13T16:45:00Z' },
];

// Mock Whitelist Data
let MOCK_WHITELIST: WhitelistMember[] = [
  { id: '1', tckn: '11111111110', fullName: 'Ali Veli', isActive: true, isDebtor: false, createdAt: '2026-01-01T10:00:00Z', updatedAt: '2026-01-01T10:00:00Z' },
  { id: '2', tckn: '22222222220', fullName: 'Ayşe Fatma', isActive: true, isDebtor: false, createdAt: '2026-01-01T10:05:00Z', updatedAt: '2026-01-01T10:05:00Z' },
  { id: '3', tckn: '33333333330', fullName: 'Mehmet Can', isActive: false, isDebtor: false, createdAt: '2026-01-02T10:00:00Z', updatedAt: '2026-01-10T15:00:00Z' },
  { id: '4', tckn: '44444444440', fullName: 'Zeynep Su', isActive: true, isDebtor: true, createdAt: '2026-01-03T10:00:00Z', updatedAt: '2026-02-01T09:00:00Z' },
];

// Mock Field Templates
let MOCK_FIELD_TEMPLATES: FieldTemplate[] = [
  { id: 't1', label: 'Ad Soyad', type: 'text', required: true, createdAt: '2026-01-01T10:00:00Z' },
  { id: 't2', label: 'T.C. Kimlik No', type: 'text', required: true, createdAt: '2026-01-01T10:00:00Z' },
  { id: 't3', label: 'E-Posta Adresi', type: 'email', required: true, createdAt: '2026-01-01T10:00:00Z' },
  { id: 't4', label: 'Cep Telefonu', type: 'tel', required: true, createdAt: '2026-01-01T10:00:00Z' },
  { id: 't5', label: 'Şehir', type: 'select', required: true, options: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Diğer'], createdAt: '2026-01-01T10:00:00Z' },
  { id: 't6', label: 'KVKK Onayı', type: 'checkbox', required: true, createdAt: '2026-01-01T10:00:00Z' },
];

// Mock Institutions
let MOCK_INSTITUTIONS: Institution[] = [
  { id: 'inst-1', name: 'DenizBank', code: 'DENIZBANK', contactEmail: 'iletisim@denizbank.com', logoUrl: 'https://seeklogo.com/images/D/denizbank-logo-278292672B-seeklogo.com.png', isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'inst-2', name: 'TALPA Sigorta', code: 'TALPA_SIGORTA', contactEmail: 'sigorta@talpa.org', isActive: true, createdAt: '2026-01-01T00:00:00Z' }
];

export const getActiveCampaigns = async (): Promise<Campaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_CAMPAIGNS
    .filter(c => c.active)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
};

export const getCampaignBySlug = async (slug: string): Promise<Campaign | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return MOCK_CAMPAIGNS.find(c => 
    c.slug === slug || 
    (c.campaignCode && c.campaignCode.toLowerCase() === slug.replace(/-/g, '_'))
  );
};

export const getCampaignById = async (id: string): Promise<Campaign | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_CAMPAIGNS.find(c => c.id === id);
};

// --- Admin Campaign Actions ---

export const getAdminCampaigns = async (): Promise<Campaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  // Return all campaigns (including drafts, closed etc.)
  return [...MOCK_CAMPAIGNS].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
};

export const updateCampaignStatus = async (id: string, newStatus: CampaignStatus): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const campaignIndex = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
  if (campaignIndex === -1) {
    return { success: false, message: 'Kampanya bulunamadı.' };
  }

  // Mock Transition Logic
  const campaign = MOCK_CAMPAIGNS[campaignIndex];
  
  // Rules
  if (campaign.status === 'closed') {
    return { success: false, message: 'Kapatılmış bir kampanya tekrar açılamaz.' };
  }

  // Update
  MOCK_CAMPAIGNS[campaignIndex] = {
    ...campaign,
    status: newStatus,
    active: newStatus === 'active' // Sync active boolean
  };

  return { success: true, message: `Kampanya durumu '${newStatus}' olarak güncellendi.` };
};

export const deleteCampaign = async (id: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id);
  if (!campaign) return { success: false, message: 'Kampanya bulunamadı.' };

  if (campaign.status !== 'draft') {
    return { success: false, message: 'Sadece taslak (draft) durumundaki kampanyalar silinebilir.' };
  }

  MOCK_CAMPAIGNS = MOCK_CAMPAIGNS.filter(c => c.id !== id);
  return { success: true, message: 'Kampanya başarıyla silindi.' };
};

export const updateCampaignConfig = async (id: string, data: Partial<Campaign>): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const campaignIndex = MOCK_CAMPAIGNS.findIndex(c => c.id === id);
  if (campaignIndex === -1) return { success: false, message: 'Kampanya bulunamadı.' };

  MOCK_CAMPAIGNS[campaignIndex] = {
    ...MOCK_CAMPAIGNS[campaignIndex],
    ...data
  };

  return { success: true, message: 'Kampanya ayarları güncellendi.' };
};

// --- Interest Actions ---

export const getInterests = async (campaignId?: string): Promise<Interest[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  let data = [...MOCK_INTERESTS];
  if (campaignId && campaignId !== 'all') {
    data = data.filter(i => i.campaignId === campaignId);
  }
  return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const deleteInterest = async (id: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const exists = MOCK_INTERESTS.some(i => i.id === id);
  if (!exists) return { success: false, message: 'Talep bulunamadı.' };
  
  MOCK_INTERESTS = MOCK_INTERESTS.filter(i => i.id !== id);
  return { success: true, message: 'Talep başarıyla silindi.' };
};

// --- Whitelist Actions ---

export const getWhitelistMembers = async (): Promise<WhitelistMember[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...MOCK_WHITELIST].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const addWhitelistMember = async (tckn: string, name?: string, isActive: boolean = true): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!validateTckn(tckn)) return { success: false, message: 'Geçersiz TCKN.' };
  
  const existing = MOCK_WHITELIST.find(m => m.tckn === tckn);
  if (existing) return { success: false, message: 'Bu TCKN zaten kayıtlı.' };

  const newMember: WhitelistMember = {
    id: Math.random().toString(36).substr(2, 9),
    tckn,
    fullName: name || 'Manuel Kayıt',
    isActive,
    isDebtor: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  MOCK_WHITELIST.unshift(newMember);
  return { success: true, message: 'Üye başarıyla eklendi.' };
};

export const updateWhitelistMemberStatus = async (id: string, isActive: boolean): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const idx = MOCK_WHITELIST.findIndex(m => m.id === id);
  if (idx === -1) return { success: false, message: 'Üye bulunamadı.' };

  MOCK_WHITELIST[idx] = { ...MOCK_WHITELIST[idx], isActive, updatedAt: new Date().toISOString() };
  return { success: true, message: 'Durum güncellendi.' };
};

export const deleteWhitelistMember = async (id: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const idx = MOCK_WHITELIST.findIndex(m => m.id === id);
  if (idx === -1) return { success: false, message: 'Üye bulunamadı.' };

  MOCK_WHITELIST = MOCK_WHITELIST.filter(m => m.id !== id);
  return { success: true, message: 'Üye silindi.' };
};

export const uploadWhitelist = async (file: File): Promise<{ success: boolean; message: string; count?: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!file.name.endsWith('.csv')) {
    return { success: false, message: 'Lütfen geçerli bir CSV dosyası yükleyiniz.' };
  }

  // Mock processing
  const mockCount = Math.floor(Math.random() * 50) + 10;
  for (let i = 0; i < mockCount; i++) {
    MOCK_WHITELIST.unshift({
      id: Math.random().toString(36).substr(2, 9),
      tckn: `${Math.floor(Math.random() * 90000000000) + 10000000000}`,
      fullName: `Yüklenen Üye ${i + 1}`,
      isActive: true,
      isDebtor: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return { success: true, message: `${mockCount} adet kayıt başarıyla yüklendi/güncellendi.` };
};

export const uploadDebtorList = async (file: File): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!file.name.endsWith('.csv')) {
    return { success: false, message: 'Lütfen geçerli bir CSV dosyası yükleyiniz.' };
  }

  // Mock processing
  const affected = MOCK_WHITELIST.slice(0, 3);
  affected.forEach(m => {
    m.isDebtor = true;
    m.updatedAt = new Date().toISOString();
  });

  return { success: true, message: `${affected.length + 2} adet borçlu kaydı güncellendi.` };
};

// --- Field Library Actions ---

export const getFieldTemplates = async (): Promise<FieldTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...MOCK_FIELD_TEMPLATES].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const saveFieldTemplate = async (template: Partial<FieldTemplate>): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!template.label || !template.type) {
    return { success: false, message: 'Lütfen zorunlu alanları doldurunuz.' };
  }

  const existingIdx = template.id ? MOCK_FIELD_TEMPLATES.findIndex(t => t.id === template.id) : -1;

  if (existingIdx > -1) {
    // Update
    MOCK_FIELD_TEMPLATES[existingIdx] = { 
      ...MOCK_FIELD_TEMPLATES[existingIdx], 
      ...template as FieldTemplate 
    };
    return { success: true, message: 'Şablon güncellendi.' };
  } else {
    // Create
    const newTemplate: FieldTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      label: template.label!,
      type: template.type!,
      required: template.required || false,
      options: template.options || [],
      createdAt: new Date().toISOString()
    };
    MOCK_FIELD_TEMPLATES.unshift(newTemplate);
    return { success: true, message: 'Şablon eklendi.' };
  }
};

export const deleteFieldTemplate = async (id: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  MOCK_FIELD_TEMPLATES = MOCK_FIELD_TEMPLATES.filter(t => t.id !== id);
  return { success: true, message: 'Şablon silindi.' };
};

// --- Institution Actions ---

export const getInstitutions = async (): Promise<Institution[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...MOCK_INSTITUTIONS].sort((a, b) => a.name.localeCompare(b.name));
};

export const saveInstitution = async (institution: Partial<Institution>): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!institution.name || !institution.code) {
    return { success: false, message: 'Name and Code are required.' };
  }

  const existingIdx = institution.id ? MOCK_INSTITUTIONS.findIndex(i => i.id === institution.id) : -1;

  if (existingIdx > -1) {
    // Update
    MOCK_INSTITUTIONS[existingIdx] = {
      ...MOCK_INSTITUTIONS[existingIdx],
      ...institution as Institution
    };
    return { success: true, message: 'Kurum güncellendi.' };
  } else {
    // Check duplicate code
    if (MOCK_INSTITUTIONS.some(i => i.code === institution.code)) {
      return { success: false, message: 'Bu kurum kodu zaten kullanılıyor.' };
    }
    // Create
    const newInstitution: Institution = {
      id: Math.random().toString(36).substr(2, 9),
      name: institution.name!,
      code: institution.code!,
      contactEmail: institution.contactEmail,
      logoUrl: institution.logoUrl,
      isActive: institution.isActive !== false,
      createdAt: new Date().toISOString()
    };
    MOCK_INSTITUTIONS.push(newInstitution);
    return { success: true, message: 'Kurum eklendi.' };
  }
};

export const deleteInstitution = async (id: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  MOCK_INSTITUTIONS = MOCK_INSTITUTIONS.filter(i => i.id !== id);
  return { success: true, message: 'Kurum silindi.' };
};

// --- Email Config Mocks ---

export interface EmailConfig {
  id: string;
  campaignId: string;
  recipientType: 'applicant' | 'admin' | 'custom';
  subjectTemplate: string;
  bodyTemplate: string;
  isActive: boolean;
}

const MOCK_EMAILS: EmailConfig[] = [
  { id: '1', campaignId: '1', recipientType: 'applicant', subjectTemplate: 'Başvurunuz Alındı - {{name}}', bodyTemplate: 'Sn. {{name}}, başvurunuz alınmıştır.', isActive: true }
];

export const getEmailConfigs = async (campaignId: string): Promise<EmailConfig[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_EMAILS.filter(e => e.campaignId === campaignId);
};

export const saveEmailConfig = async (config: EmailConfig): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const existingIndex = MOCK_EMAILS.findIndex(e => e.id === config.id);
  if (existingIndex > -1) {
    MOCK_EMAILS[existingIndex] = config;
  } else {
    MOCK_EMAILS.push({ ...config, id: Math.random().toString(36).substr(2, 9) });
  }
  return { success: true, message: 'E-posta şablonu kaydedildi.' };
};

// --- Other Existing Actions ---

export interface VerifyResponse {
  status: 'SUCCESS' | 'INVALID' | 'EXISTS' | 'NOT_FOUND' | 'BLOCKED' | 'ERROR';
  message?: string;
  token?: string;
}

export const verifyTcknAction = async (tckn: string, campaignId: string): Promise<VerifyResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!validateTckn(tckn)) {
    return { status: 'INVALID', message: 'Lütfen geçerli bir T.C. Kimlik Numarası giriniz.' };
  }

  if (tckn.endsWith('2')) return { status: 'EXISTS', message: 'Bu kampanya için aktif bir başvurunuz zaten mevcut.' };
  if (tckn.endsWith('4')) return { status: 'NOT_FOUND', message: 'TALPA üye listesinde kaydınız bulunamadı.' };
  if (tckn.endsWith('6')) return { status: 'BLOCKED', message: 'Üyelik durumunuz nedeniyle şu anda başvuru alınamıyor.' };

  return { 
    status: 'SUCCESS', 
    token: `session_${tckn}_${Date.now()}` 
  };
};

export const submitDynamicApplicationAction = async (campaignId: string, data: any, token: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (!token) throw new Error("Oturum süreniz dolmuş veya geçersiz.");
  return { success: true, message: 'Başvurunuz başarıyla alınmıştır.', applicationId: `APP-${Math.floor(Math.random() * 10000)}` };
};

export const submitApplicationAction = async (data: any, token: string) => {
  return submitDynamicApplicationAction('generic', data, token);
};

export const submitInterestAction = async (campaignId: string, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const errors: Record<string, string> = {};
  if (!data.fullName || data.fullName.length < 2) errors.fullName = 'Ad Soyad en az 2 karakter olmalıdır.';
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Geçerli bir e-posta adresi giriniz.';
  if (!validateTckn(data.tckn)) errors.tckn = 'Geçersiz T.C. Kimlik Numarası.';
  if (Object.keys(errors).length > 0) return { success: false, message: 'Lütfen form alanlarını kontrol ediniz.', errors };
  
  if (data.tckn.endsWith('4')) return { success: false, message: 'TALPA üye listesinde kaydınız bulunamadı.' };
  if (data.tckn.endsWith('6')) return { success: false, message: 'Derneğimizde bulunan borcunuz nedeniyle işleminize devam edilememektedir.' };
  
  return { success: true, message: 'Talebiniz başarıyla alınmıştır.' };
};

export interface ApplicationResult {
  id: string;
  campaignName: string;
  status: ApplicationStatus;
  appliedAt: string;
  message?: string;
}

export const checkApplicationStatusAction = async (tckn: string, phone: string): Promise<{ success: boolean; data?: ApplicationResult[]; message?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (!validateTckn(tckn)) return { success: false, message: 'Geçersiz TCKN.' };
  if (tckn.endsWith('0')) return { success: false, message: 'Başvuru bulunamadı.' };
  if (tckn.endsWith('4')) throw new Error('Teknik hata.');
  if (tckn.endsWith('2')) return {
    success: true,
    data: [
      { id: 'APP-101', campaignName: 'İhtiyaç Kredisi', status: ApplicationStatus.APPROVED, appliedAt: '12.02.2026', message: 'Onaylandı.' },
      { id: 'APP-102', campaignName: 'Platinum Kart', status: ApplicationStatus.PENDING, appliedAt: '14.02.2026', message: 'Değerlendiriliyor.' }
    ]
  };
  return { success: true, data: [{ id: 'APP-999', campaignName: 'Genel', status: ApplicationStatus.WAITING, appliedAt: 'Bugün', message: 'Beklemede.' }] };
};

export interface AuthCheckResponse {
  status: 'REDIRECT_FORM' | 'OTP_SENT' | 'NOT_FOUND' | 'ERROR';
  message?: string;
  emailMasked?: string;
}

export const checkAuthAction = async (tckn: string): Promise<AuthCheckResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (!validateTckn(tckn)) return { status: 'ERROR', message: 'Geçersiz TCKN.' };
  if (tckn.endsWith('0')) return { status: 'NOT_FOUND', message: 'Üye bulunamadı.' };
  if (tckn.endsWith('2')) return { status: 'OTP_SENT', emailMasked: 'al***@talpa.org' };
  return { status: 'REDIRECT_FORM' };
};

export const verifyAuthAction = async (tckn: string, otp: string): Promise<{ success: boolean; message?: string; sessionToken?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  if (otp === '123456') return { success: true, sessionToken: `session_${tckn}_${Date.now()}` };
  return { success: false, message: 'Hatalı kod.' };
};

export const adminLoginAction = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (email === 'admin@talpa.org' && password === 'admin123') {
    return { success: true, user: { id: 'admin-1', email, role: 'admin', name: 'Admin' }, token: 'mock_token' };
  }
  return { success: false, message: 'Giriş başarısız.' };
};

export const getAdminStats = async (): Promise<Stats> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return { totalApplications: 1284, pendingReviews: 45, activeCampaigns: MOCK_CAMPAIGNS.filter(c => c.active).length, dailyRequests: 850 };
};

export const getAdminChartData = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [{ name: 'Pzt', basvuru: 40 }, { name: 'Sal', basvuru: 30 }, { name: 'Çar', basvuru: 20 }, { name: 'Per', basvuru: 50 }, { name: 'Cum', basvuru: 18 }];
};

export const getAdminApplications = async (campaignId?: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '101', name: 'Ahmet Yılmaz', campaignId: '1', campaign: 'Pilotlara Özel İhtiyaç Kredisi', date: '12.02.2026', status: ApplicationStatus.PENDING },
    { id: '102', name: 'Mehmet Demir', campaignId: '2', campaign: 'TALPA Platinum Kart', date: '11.02.2026', status: ApplicationStatus.APPROVED }
  ].filter(app => !campaignId || app.campaignId === campaignId);
};
