import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, BookOpen, MessageCircle } from 'lucide-react';
import Container from './Container';
import { isOnboardingComplete, loadOnboarding } from '../../lib/onboarding';
import { useI18n } from '../../lib/i18n';
import LanguageToggle from '../ui/LanguageToggle';

export default function Header() {
  const location = useLocation();
  const { t } = useI18n();
  const chatPath = isOnboardingComplete(loadOnboarding()) ? '/chat' : '/onboarding';

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Bot },
    { path: '/course', label: t('nav.course'), icon: BookOpen },
    { path: '/chat', label: t('nav.advisor'), icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-dark-100">
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center"
            >
              <span className="text-dark-700 font-bold text-lg sm:text-xl">AI</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-dark-700 text-lg">{t('nav.brand.title')}</h1>
              <p className="text-xs text-dark-400">{t('nav.brand.subtitle')}</p>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const effectivePath = path === '/chat' ? chatPath : path;
              const isActive =
                location.pathname === effectivePath ||
                (path === '/chat' && location.pathname === '/onboarding') ||
                (path !== '/chat' && location.pathname === path);
              return (
                <Link
                  key={path}
                  to={effectivePath}
                  className={`
                    relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl
                    flex items-center gap-2
                    text-sm sm:text-base font-medium
                    transition-colors duration-200
                    ${isActive
                      ? 'text-dark-700'
                      : 'text-dark-400 hover:text-dark-600 hover:bg-dark-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/20 rounded-xl -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
            <LanguageToggle size="sm" className="ml-1 sm:ml-2" />
          </div>
        </nav>
      </Container>
    </header>
  );
}
