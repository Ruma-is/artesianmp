'use client'

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, translations } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-md border-2 p-3" style={{ borderColor: '#e8dfd0' }}>
      <label className="text-sm font-medium mr-3" style={{ color: '#926829' }}>
        {translations.language[language]}
      </label>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
        style={{ 
          borderColor: '#e8dfd0',
          color: '#926829'
        }}
      >
        <option value="en">🇬🇧 English</option>
        <option value="hi">🇮🇳 हिंदी (Hindi)</option>
        <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
        <option value="te">🇮🇳 తెలుగు (Telugu)</option>
        <option value="bn">🇮🇳 বাংলা (Bengali)</option>
        <option value="mr">🇮🇳 मराठी (Marathi)</option>
        <option value="gu">🇮🇳 ગુજરાતી (Gujarati)</option>
        <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
        <option value="ml">🇮🇳 മലയാളം (Malayalam)</option>
        <option value="pa">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
      </select>
    </div>
  );
}
