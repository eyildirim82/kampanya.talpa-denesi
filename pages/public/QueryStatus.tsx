
import React, { useState } from 'react';
import { Search, ArrowLeft, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Alert from '../../components/Alert';
import { checkApplicationStatusAction, ApplicationResult } from '../../services/api';

const QueryStatus: React.FC = () => {
  const [formData, setFormData] = useState({
    tckn: '',
    phone: ''
  });
  const [results, setResults] = useState<ApplicationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    // Normalize phone number (remove non-digits)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const cleanTckn = formData.tckn.replace(/\D/g, '');

    try {
      const response = await checkApplicationStatusAction(cleanTckn, cleanPhone);
      
      if (response.success && response.data && response.data.length > 0) {
        setResults(response.data);
      } else {
        setError(response.message || 'Bu bilgilerle eşleşen bir başvuru bulunamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Sorgulama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-lg">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-talpa-navy text-white mb-6 shadow-lg shadow-blue-900/20">
            <Plane className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-talpa-navy">Başvuru Sorgulama</h1>
          <p className="mt-3 text-slate-600">TCKN ve telefon numaranız ile başvurunuzun durumunu öğrenin.</p>
        </div>

        {/* Search Form */}
        <Card className="mb-6 shadow-xl">
          <form onSubmit={handleQuery} className="space-y-6">
            <Input 
              label="T.C. Kimlik Numarası" 
              placeholder="11111111111" 
              maxLength={11}
              required
              value={formData.tckn}
              onChange={(e) => handleInputChange('tckn', e.target.value.replace(/\D/g, ''))}
            />
            <Input 
              label="Telefon Numarası" 
              placeholder="5XX XXX XX XX" 
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={loading}
              leftIcon={!loading ? <Search className="h-4 w-4" /> : undefined}
            >
              {loading ? 'Sorgulanıyor...' : 'Sorgula'}
            </Button>
          </form>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="error" title="Sorgu Hatası" className="animate-in fade-in slide-in-from-bottom-2 mb-6">
            {error}
          </Alert>
        )}

        {/* Results List */}
        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-semibold text-slate-900 ml-1">Başvuru Sonuçları ({results.length})</h3>
            
            {results.map((result) => (
              <Card key={result.id} className="border-l-4 border-l-talpa-navy hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{result.campaignName}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">Ref: {result.id}</p>
                  </div>
                  <Badge status={result.status} />
                </div>
                
                <div className="space-y-3 pt-2 border-t border-slate-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Başvuru Tarihi:</span>
                    <span className="font-medium text-slate-900">{result.appliedAt}</span>
                  </div>
                  {result.message && (
                    <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">
                      {result.message}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-talpa-navy transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Ana Sayfaya Dön
          </Link>
        </div>

      </div>
    </div>
  );
};

export default QueryStatus;
