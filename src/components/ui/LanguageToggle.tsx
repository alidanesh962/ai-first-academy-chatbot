import { motion } from 'framer-motion';
import { useI18n, type Language } from '../../lib/i18n';

interface LanguageToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function LanguageToggle({ className = '', size = 'md' }: LanguageToggleProps) {
  const { lang, setLang, t } = useI18n();

  const options: { value: Language; label: string }[] = [
    { value: 'fa', label: t('lang.fa') },
    { value: 'en', label: t('lang.en') },
  ];

  const sizeCls = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm';
  const padCls = size === 'sm' ? 'px-3' : 'px-4';

  return (
    <div
      role="group"
      aria-label={t('lang.toggle.aria')}
      dir="ltr"
      className={`
        relative inline-flex items-center ${sizeCls}
        rounded-full bg-white/80 backdrop-blur
        border border-primary/40 shadow-sm
        p-0.5
        ${className}
      `}
    >
      {options.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLang(opt.value)}
            aria-pressed={active}
            className={`
              relative z-10 ${padCls} h-full
              rounded-full font-semibold
              transition-colors duration-200
              ${active ? 'text-dark-700' : 'text-dark-400 hover:text-dark-600'}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
            `}
          >
            {active && (
              <motion.span
                layoutId="lang-toggle-pill"
                className="absolute inset-0 bg-primary rounded-full shadow"
                transition={{ type: 'spring', duration: 0.4 }}
                style={{ zIndex: -1 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
