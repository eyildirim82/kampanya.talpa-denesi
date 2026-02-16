
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle, Building } from 'lucide-react';
import { getInstitutions, saveInstitution, deleteInstitution } from '../../services/api';
import { Institution } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';

const InstitutionList: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Institution>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInstitutions();
      setInstitutions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (inst?: Institution) => {
    if (inst) {
      setFormData({ ...inst });
    } else {
      setFormData({
        name: '',
        code: '',
        contactEmail: '',
        logoUrl: '',
        isActive: true
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await saveInstitution(formData);
      if (result.success) {
        handleCloseModal();
        loadData();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kurumu silmek istediğinize emin misiniz?')) return;
    
    const result = await deleteInstitution(id);
    if (result.success) {
      loadData();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin/dashboard" className="text-slate-500 hover:text-talpa-navy flex items-center gap-1 text-sm mb-2 font-medium">
              <ArrowLeft className="h-4 w-4" /> Dashboard'a Dön
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Kurum Listesi</h1>
            <p className="text-sm text-slate-500 mt-1">Kampanya sağlayan kurumları yönetin.</p>
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
            Yeni Kurum
          </Button>
        </div>

        {/* List */}
        <Card padding="none" className="overflow-hidden border border-slate-200 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kurum Adı</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kod</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">İletişim</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Yükleniyor...</td></tr>
                ) : institutions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                       <div className="flex flex-col items-center justify-center text-slate-500">
                          <Building className="h-10 w-10 mb-3 text-slate-300" />
                          <p>Henüz kurum eklenmemiş.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  institutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-1">
                             {inst.logoUrl ? (
                               <img src={inst.logoUrl} alt={inst.name} className="h-full w-full object-contain" />
                             ) : (
                               <Building className="h-5 w-5 text-slate-400" />
                             )}
                          </div>
                          <div>
                             <span className="block text-sm font-semibold text-slate-900">{inst.name}</span>
                             <span className="text-xs text-slate-400 font-mono">ID: {inst.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          {inst.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {inst.contactEmail ? (
                           <span className="text-blue-600 hover:underline cursor-pointer">{inst.contactEmail}</span>
                        ) : (
                           <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${inst.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {inst.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {inst.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(inst)} className="p-2 text-slate-400 hover:text-talpa-navy hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(inst.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        </Card>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-bold text-slate-900">{formData.id ? 'Kurumu Düzenle' : 'Yeni Kurum Ekle'}</h3>
                   <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                   {error && <Alert variant="error">{error}</Alert>}
                   
                   <Input 
                      label="Kurum Adı"
                      placeholder="Örn: DenizBank"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />

                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Kurum Kodu</label>
                      <input 
                        type="text"
                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy uppercase font-mono shadow-sm transition-all"
                        placeholder="Örn: DENIZBANK"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      />
                      <p className="text-xs text-slate-500">Sistem içi benzersiz kod.</p>
                   </div>

                   <Input 
                      label="İletişim E-posta"
                      type="email"
                      placeholder="iletisim@denizbank.com"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                   />

                   <Input 
                      label="Logo URL"
                      placeholder="https://..."
                      value={formData.logoUrl || ''}
                      onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                   />

                   <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                          <input 
                            type="checkbox" 
                            className="rounded text-talpa-navy focus:ring-talpa-navy h-4 w-4"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          />
                          <span className="text-sm text-slate-700 font-medium">Aktif Durumda</span>
                      </label>
                   </div>

                   <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
                      <Button type="button" variant="ghost" fullWidth onClick={handleCloseModal}>İptal</Button>
                      <Button type="submit" fullWidth isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>Kaydet</Button>
                   </div>
                </form>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InstitutionList;
