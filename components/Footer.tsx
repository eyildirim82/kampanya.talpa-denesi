import React from 'react';
import { Plane } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Plane className="h-6 w-6" />
              <span className="font-bold text-lg">TALPA</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Türkiye Havayolu Pilotları Derneği üyeleri için hazırlanan özel kampanya portalı.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Kampanyalar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Yasal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition-colors">KVKK Aydınlatma Metni</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2026 TALPA. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;