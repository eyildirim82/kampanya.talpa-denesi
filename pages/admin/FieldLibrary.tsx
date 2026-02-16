import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { getFieldTemplates, saveFieldTemplate, deleteFieldTemplate } from '../../services/api';
import { FieldTemplate } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Alert from '../../components/Alert';

const FieldLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<FieldTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<FieldTemplate> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getFieldTemplates();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (template?: FieldTemplate) => {
    if (template) {
      setEditingTemplate({ ...template });
    } else {
      setEditingTemplate({
        label: '',
        type: 'text',
        required: false,
        options: []
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await saveFieldTemplate(editingTemplate);
      if (result.success) {
        handleCloseModal();
        loadTemplates();
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
    if (!window.confirm('Bu şablonu silmek istediğinize emin misiniz?')) return;
    
    const result = await deleteFieldTemplate(id);
    if (result.success) {
      loadTemplates();
    } else {
      alert(result.message);
    }
  };

  const handleOptionsChange = (text: string) => {
    const options = text.split(',').map(s => s.trim());
    setEditingTemplate(prev => prev ? ({ ...prev, options }) : null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin/dashboard" className="text-slate-500 hover:text-talpa-navy flex items-center gap-1 text-sm mb-2">
              <ArrowLeft className="h-4 w-4" /> Dashboard'a Dön
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Alan Kütüphanesi</h1>
            <p className="text-sm text-slate-500 mt-1">Sık kullanılan form alanlarını yönetin.</p>
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="h-4 w-4" />}>
            Yeni Alan Ekle
          </Button>
        </div>

        {/* Template List */}
        {loading ? (
          <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
        ) : templates.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-dashed border-slate-300">
            Henüz kayıtlı alan şablonu bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <Card key={template.id} padding="md" className="flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[#002855] text-lg">{template.label}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(template)} className="text-slate-400 hover:text-talpa-navy transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(template.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 flex-1">
                   <div className="flex gap-2">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono uppercase border border-slate-200">
                        {template.type}
                      </span>
                      {template.required && (
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded font-medium border border-red-100">
                          Zorunlu
                        </span>
                      )}
                   </div>
                   {template.type === 'select' && template.options && (
                     <p className="text-xs text-slate-500 line-clamp-2">
                       Seçenekler: {template.options.join(', ')}
                     </p>
                   )}
                </div>
                
                <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 mt-auto">
                   Oluşturulma: {new Date(template.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-bold text-slate-900">{editingTemplate.id ? 'Alanı Düzenle' : 'Yeni Alan Ekle'}</h3>
                   <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                   {error && <Alert variant="error">{error}</Alert>}
                   
                   <Input 
                      label="Görünen İsim (Label)"
                      placeholder="Örn: Anne Kızlık Soyadı"
                      required
                      value={editingTemplate.label}
                      onChange={(e) => setEditingTemplate({...editingTemplate, label: e.target.value})}
                   />

                   <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Veri Tipi</label>
                      <select 
                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy"
                        value={editingTemplate.type}
                        onChange={(e) => setEditingTemplate({...editingTemplate, type: e.target.value as any})}
                      >
                        <option value="text">Metin (Text)</option>
                        <option value="textarea">Uzun Metin (Textarea)</option>
                        <option value="email">E-Posta</option>
                        <option value="tel">Telefon</option>
                        <option value="number">Sayı</option>
                        <option value="select">Seçim (Select)</option>
                        <option value="checkbox">Onay Kutusu (Checkbox)</option>
                      </select>
                   </div>

                   {editingTemplate.type === 'select' && (
                     <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium text-slate-700">Seçenekler</label>
                        <textarea 
                          rows={3}
                          className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy"
                          placeholder="Seçenek 1, Seçenek 2, Seçenek 3..."
                          value={editingTemplate.options?.join(', ') || ''}
                          onChange={(e) => handleOptionsChange(e.target.value)}
                        />
                        <p className="text-xs text-slate-500">Değerleri virgül ile ayırınız.</p>
                     </div>
                   )}

                   <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded text-talpa-navy focus:ring-talpa-navy"
                            checked={editingTemplate.required}
                            onChange={(e) => setEditingTemplate({...editingTemplate, required: e.target.checked})}
                          />
                          <span className="text-sm text-slate-700 font-medium">Bu alan zorunludur</span>
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

export default FieldLibrary;
