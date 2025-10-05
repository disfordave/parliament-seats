import en from './en.json' with { type: 'json' };
import fr from './fr.json' with { type: 'json' };
import { useSelector } from 'react-redux';
import { RootState } from '../app/store'; // 👈 your store type

const messages = { en, fr } as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNested(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// 1️⃣ Plain helper that accepts locale
export function i(id: string, locale: 'en' | 'fr'): string {
    return getNested(messages[locale], id) || id;
}

// 2️⃣ React hook version that reads locale from Redux
export function useI18n() {
  const locale = useSelector((state: RootState) => state.i18n.locale);
  return (id: string) => i(id, locale as 'en' | 'fr');
}