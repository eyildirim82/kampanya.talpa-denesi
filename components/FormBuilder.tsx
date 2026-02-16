import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Settings, BookOpen, X } from 'lucide-react';
import { FormField, FieldTemplate } from '../types';
import { getFieldTemplates } from '../services/api';
import Card from './Card';
import Button from './Button';
import Input from './Input';

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ fields, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [templates, setTemplates] = useState<FieldTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await getFieldTemplates();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (isLibraryOpen && templates.length === 0) {
      loadTemplates();
    }
  }, [isLibraryOpen]);

  const addField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      name: `field_${Date.now()}`,
      label: 'Yeni Alan',
      type: 'text',
      required: false,
      width: 'full'
    };
    onChange([...fields, newField]);
    setEditingId(newField.id!);
  };

  const addFromTemplate = (template: FieldTemplate) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      name: `field_${Date.now()}`,
      label: template.label,
      type: template.type,
      required: template.required,
      options: template.options,
      width: 'full'
    };
    onChange([...fields, newField]);
    setIsLibraryOpen(false);
  };

  const removeField = (id: string) => {
    if (window.confirm('Bu alanı silmek istediğinize emin misiniz?')) {
      onChange(fields.filter(f => f.id !== id));
    }
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    onChange(newFields);
  };

  return (
    <div className="space-y-4">
      {/* Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-talpa-navy" /> Alan Kütüphanesi
              </h3>
              <button onClick={() => setIsLibraryOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              {loadingTemplates ? (
                <div className="text-center py-8 text-slate-500">Yükleniyor...</div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Kayıtlı şablon bulunamadı. Admin panelinden ekleyebilirsiniz.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <button 
                      key={template.id}
                      onClick={() => addFromTemplate(template)}
                      className="text-left p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-talpa-navy hover:shadow-md transition-all group"
                    >
                      <div className="font-semibold text-slate-800 group-hover:text-talpa-navy">{template.label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono uppercase">{template.type}</span>
                        {template.required && <span className="text-xs text-red-600 font-medium">Zorunlu</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {fields.length === 0 && (
        <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-500">
          Henüz form alanı eklenmemiş.
        </div>
      )}

      {fields.map((field, index) => (
        <Card key={field.id} padding="sm" className="border border-slate-200 shadow-sm relative group transition-all">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 text-slate-300">
              <button onClick={() => moveField(index, 'up')} className="hover:text-talpa-navy">▲</button>
              <button onClick={() => moveField(index, 'down')} className="hover:text-talpa-navy">▼</button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-800">{field.label}</span>
                {field.required && <span className="text-xs bg-deniz-red/10 text-deniz-red px-1.5 py-0.5 rounded">Zorunlu</span>}
                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{field.type}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">variable: {field.name}</div>
            </div>

            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" onClick={() => setEditingId(editingId === field.id ? null : field.id)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeField(field.id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {editingId === field.id && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
              <Input 
                label="Etiket (Label)" 
                value={field.label} 
                onChange={(e) => updateField(field.id!, { label: e.target.value })} 
              />
              <Input 
                label="Değişken Adı (Name)" 
                value={field.name} 
                onChange={(e) => updateField(field.id!, { name: e.target.value })} 
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Tip</label>
                <select 
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy"
                  value={field.type}
                  onChange={(e) => updateField(field.id!, { type: e.target.value as any })}
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
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Genişlik</label>
                <select 
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-talpa-navy"
                  value={field.width || 'full'}
                  onChange={(e) => updateField(field.id!, { width: e.target.value as any })}
                >
                  <option value="full">Tam Genişlik</option>
                  <option value="half">Yarım (1/2)</option>
                </select>
              </div>

              {field.type === 'select' && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700">Seçenekler (Virgülle ayırın)</label>
                  <textarea 
                    rows={2}
                    className="flex w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={field.options?.join(', ') || ''}
                    onChange={(e) => updateField(field.id!, { options: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
              )}

              <div className="col-span-2 flex items-center gap-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-talpa-navy focus:ring-talpa-navy"
                      checked={field.required}
                      onChange={(e) => updateField(field.id!, { required: e.target.checked })}
                    />
                    <span className="text-sm text-slate-700">Zorunlu Alan</span>
                 </label>
              </div>
            </div>
          )}
        </Card>
      ))}

      <div className="flex gap-2">
        <Button variant="secondary" fullWidth onClick={addField} leftIcon={<Plus className="h-4 w-4" />}>
          Alan Ekle
        </Button>
        <Button variant="secondary" fullWidth onClick={() => setIsLibraryOpen(true)} leftIcon={<BookOpen className="h-4 w-4" />}>
          Kütüphaneden Ekle
        </Button>
      </div>
    </div>
  );
};

export default FormBuilder;
