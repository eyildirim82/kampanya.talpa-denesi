import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { adminLoginAction } from '../../services/api';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLoginAction(email, password);
      
      if (result.success && result.token) {
        // Securely store token (Mock implementation: using localStorage)
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', JSON.stringify(result.user));
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Giriş başarısız.');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-talpa-navy text-white mb-6 shadow-xl shadow-blue-900/20">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Yönetim Paneli</h1>
          <p className="text-slate-500 mt-2">Sadece yetkili personel erişebilir.</p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-talpa-navy">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <Alert variant="error">{error}</Alert>}
            
            <Input 
              label="E-Posta Adresi" 
              type="email" 
              placeholder="admin@talpa.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Şifre" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Giriş Yap
            </Button>
            
            <p className="text-xs text-center text-slate-400">
              Güvenli giriş için IP adresiniz kaydedilmektedir.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;