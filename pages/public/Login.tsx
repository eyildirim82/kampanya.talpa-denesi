import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft, Lock } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { checkAuthAction, verifyAuthAction } from '../../services/api';

type Step = 'TCKN' | 'OTP';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState<Step>('TCKN');
  const [tckn, setTckn] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

  // Handlers
  const handleTcknSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tckn.length !== 11) {
      setError('TCKN 11 haneli olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const response = await checkAuthAction(tckn);

      if (response.status === 'REDIRECT_FORM') {
        // Direct redirect for users without existing application (no OTP needed)
        navigate(`/basvuru?tckn=${tckn}`);
      } else if (response.status === 'OTP_SENT') {
        // OTP required for users with existing application
        setMaskedEmail(response.emailMasked || '***@***.com');
        setStep('OTP');
      } else if (response.status === 'NOT_FOUND') {
        setError('Girdiğiniz TCKN ile kayıtlı bir üye bulunamadı.');
      } else {
        setError(response.message || 'Bir hata oluştu.');
      }
    } catch (err) {
      setError('Giriş yapılırken sunucuyla iletişim kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await verifyAuthAction(tckn, otp);
      
      if (response.success) {
        // OTP Verified
        // Navigate to application form with session token state to skip verification
        navigate(`/basvuru?tckn=${tckn}`, { 
          state: { sessionToken: response.sessionToken } 
        });
      } else {
        setError(response.message || 'Hatalı veya süresi dolmuş kod.');
      }
    } catch (err) {
      setError('Doğrulama işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-talpa-navy text-white mb-5 shadow-lg shadow-blue-900/20">
            <LogIn className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Başvuru Sistemi</h1>
          <p className="text-slate-500 mt-2">
            {step === 'TCKN' ? 'Lütfen TCKN ile giriş yapınız.' : 'Kimlik doğrulama adımı.'}
          </p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-talpa-navy">
          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          {step === 'TCKN' && (
            <form onSubmit={handleTcknSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Input 
                label="T.C. Kimlik No" 
                placeholder="11111111111" 
                maxLength={11}
                required
                value={tckn}
                onChange={(e) => setTckn(e.target.value.replace(/\D/g, ''))}
                leftIcon={<Lock className="h-4 w-4" />}
              />
              
              <Button type="submit" fullWidth size="lg" isLoading={loading}>
                {loading ? 'İşleniyor...' : 'Giriş Yap'}
              </Button>

              <p className="text-xs text-center text-slate-400">
                TALPA üyelik kaydınız kontrol edilecektir.
              </p>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Alert variant="info" className="text-sm">
                Lütfen <strong>{maskedEmail}</strong> adresine gönderilen 6 haneli kodu giriniz.
              </Alert>

              <Input 
                label="Doğrulama Kodu (OTP)" 
                placeholder="123456" 
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-widest"
              />
              
              <div className="flex flex-col gap-3">
                <Button type="submit" fullWidth size="lg" isLoading={loading}>
                  Doğrula
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  fullWidth 
                  onClick={() => {
                    setStep('TCKN');
                    setOtp('');
                    setError(null);
                  }}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Geri Dön
                </Button>
              </div>
            </form>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Login;