export function useLocaleContent() {
    const { locale } = useI18n()
  
    function t(ruValue: string | null | undefined, enValue: string | null | undefined): string {
      if (locale.value === 'en' && enValue) return enValue
      return ruValue || enValue || ''
    }
  
    return { t, locale }
  }