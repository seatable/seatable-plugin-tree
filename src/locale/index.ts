import { AvailableLocales } from '@/utils/template-utils/interfaces/App.interface';
import setting from '../setting.local';

const files = require.context('./lang', false, /\.json$/);

const AVAILABLE_LOCALES: AvailableLocales = files.keys().reduce((locales: any, key) => {
  const fileName = key.replace(/\.\/|\.json/g, '');
  locales[fileName] = files(key);
  return locales;
}, {});

const normalizeLocale = (lang?: string) => {
  const l = (lang || 'en').toLowerCase().replace('-', '_');
  if (l === 'zh' || l === 'zh_cn' || l.startsWith('zh_cn')) return 'zh_CN';
  return l;
};

const CANDIDATE_LOCALE = normalizeLocale(setting.lang);
const DEFAULT_LOCALE = AVAILABLE_LOCALES[CANDIDATE_LOCALE] ? CANDIDATE_LOCALE : 'en';

export { AVAILABLE_LOCALES, DEFAULT_LOCALE };
