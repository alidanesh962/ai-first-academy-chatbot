import { useMemo } from 'react';
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';
import { toEnglishDigits } from '../../lib/onboarding';
import { useI18n } from '../../lib/i18n';

export interface InternationalPhoneInputProps {
  label?: string;
  error?: string;
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

type CountryOption = { code: CountryCode; name: string; callingCode: string };

function safeRegionDisplayName(code: string, lang: 'fa' | 'en'): string {
  try {
    const locales = lang === 'en' ? ['en', 'fa'] : ['fa', 'en'];
    const dn =
      typeof Intl !== 'undefined' && 'DisplayNames' in Intl
        ? new Intl.DisplayNames(locales, { type: 'region' })
        : null;
    return dn?.of(code) ?? code;
  } catch {
    return code;
  }
}

export default function InternationalPhoneInput({
  label,
  error,
  country,
  onCountryChange,
  value,
  onChange,
  placeholder,
  autoFocus,
}: InternationalPhoneInputProps) {
  const { t, lang } = useI18n();
  const options = useMemo<CountryOption[]>(() => {
    const codes = getCountries() as CountryCode[];
    const opts = codes.map((c) => ({
      code: c,
      name: safeRegionDisplayName(c, lang),
      callingCode: getCountryCallingCode(c),
    }));
    return opts.sort((a, b) => a.name.localeCompare(b.name, lang));
  }, [lang]);

  const callingCode = useMemo(() => {
    try {
      return getCountryCallingCode(country);
    } catch {
      return '';
    }
  }, [country]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-600 mb-2">
          {label}
        </label>
      )}

      <div
        className={`
          flex gap-2 items-stretch
          ${error ? '' : ''}
        `}
        dir="ltr"
      >
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value as CountryCode)}
          className={`
            w-[45%] sm:w-[40%] px-3 py-3 rounded-xl
            bg-dark-50 border border-dark-100
            text-dark-700
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          aria-label={t('phone.countryAria')}
        >
          {options.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.name} (+{opt.callingCode})
            </option>
          ))}
        </select>

        <div className="relative flex-1">
          <span
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 text-dark-500
              pointer-events-none select-none
            `}
          >
            +{callingCode}
          </span>
          <input
            className={`
              w-full px-4 py-3 rounded-xl
              bg-dark-50 border border-dark-100
              text-dark-700 placeholder-dark-300
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              pl-16
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(toEnglishDigits(e.target.value))}
            autoFocus={autoFocus}
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}


