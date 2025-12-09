import en from "@/locales/en.json";
import sk from "@/locales/sk.json";
import { useConfigurator } from "@/store/useConfigurator";

// Map locales to data files
const TRANSLATIONS = { en, sk };

export function useTranslation() {
  const locale = useConfigurator((state) => state.locale);

  /**
   * Translates a key.
   * Usage: t('ui.total') -> "Spolu"
   * If key is missing, it returns the key itself as a fallback.
   */
  const t = (key: string) => {
    // @ts-expect-error - Simple lookup avoiding strict Type checks on huge JSONs
    const text = TRANSLATIONS[locale]?.[key] || TRANSLATIONS["en"]?.[key];

    return text || key;
  };

  return { t, locale };
}
