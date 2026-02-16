import React, { useState } from 'react';
import { FormField } from '../types';
import Input from './Input';
import Button from './Button';
import Alert from './Alert';
import { submitDynamicApplicationAction } from '../services/api';

interface DynamicFormProps {
  schema: FormField[];
  campaignId: string;
  sessionToken: string;
  onSuccess: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, campaignId, sessionToken, onSuccess }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation Check
    for (const field of schema) {
      if (field.required && !formData[field.name]) {
        setError(`${field.label} alanı zorunludur.`);
        setLoading(false);
        return;
      }
    }

    try {
      const result = await submitDynamicApplicationAction(campaignId, formData, sessionToken);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || 'Bir hata oluştu.');
      }
    } catch (err: any) {
      setError(err.message || 'Başvuru gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getWidthClass = (width?: string) => {
    switch (width) {
      case 'half': return 'col-span-1';
      case 'third': return 'col-span-1 lg:col-span-1';
      default: return 'col-span-1 sm:col-span-2'; // full
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {error && <Alert variant="error">{error}</Alert>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schema.map((field) => (
          <div key={field.name} className={getWidthClass(field.width)}>
            {field.type === 'select' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {field.label} {field.required && <span className="text-deniz-red">*</span>}
                </label>
                <select
                  required={field.required}
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-talpa-navy focus-visible:ring-offset-2"
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  value={formData[field.name] || ''}
                >
                  <option value="">Seçiniz</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ) : field.type === 'textarea' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {field.label} {field.required && <span className="text-deniz-red">*</span>}
                </label>
                <textarea
                  required={field.required}
                  rows={3}
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-talpa-navy focus-visible:ring-offset-2"
                  placeholder={field.placeholder}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  value={formData[field.name] || ''}
                />
              </div>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required={field.required}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-talpa-navy focus:ring-talpa-navy"
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  checked={formData[field.name] || false}
                />
                <span>{field.label} {field.required && <span className="text-deniz-red">*</span>}</span>
              </label>
            ) : (
              <Input
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) => handleChange(field.name, e.target.value)}
                value={formData[field.name] || ''}
              />
            )}
          </div>
        ))}
      </div>

      <Button fullWidth size="lg" isLoading={loading}>
        Başvuruyu Gönder
      </Button>
    </form>
  );
};

export default DynamicForm;