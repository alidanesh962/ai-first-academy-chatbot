import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageCircle, BookOpen, Zap, ArrowLeft, ArrowRight, Clock, Target, CheckCircle2 } from 'lucide-react';
import { Button, Accordion, AccordionItem, AccordionTrigger, AccordionContent, LanguageToggle } from '../components/ui';
import { PageWrapper, Container } from '../components/layout';
import { useDevice } from '../hooks/useDevice';
import { getChatbotIntro, getCourseInfo, getTracks, getModules } from '../lib/course-data';
import { isOnboardingComplete, loadOnboarding } from '../lib/onboarding';
import { useI18n } from '../lib/i18n';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const courseContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const courseItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isDesktop } = useDevice();
  const { t, lang, isRtl } = useI18n();

  const courseInfo = getCourseInfo(lang);
  const chatbotIntro = getChatbotIntro(lang);
  const tracks = getTracks(lang);
  const modules = getModules(lang);

  const features = [
    { icon: MessageCircle, title: t('welcome.features.qa.title'), description: t('welcome.features.qa.desc') },
    { icon: BookOpen, title: t('welcome.features.guide.title'), description: t('welcome.features.guide.desc') },
    { icon: Zap, title: t('welcome.features.concepts.title'), description: t('welcome.features.concepts.desc') },
  ];

  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;

  const startChat = () => {
    const isDone = isOnboardingComplete(loadOnboarding());
    navigate(isDone ? '/chat' : '/onboarding');
  };

  const scrollToCourseContent = (behavior: ScrollBehavior = 'smooth') => {
    document.getElementById('course-content')?.scrollIntoView({ behavior });
  };

  // Header "Course Content" links to /course — land on the course section
  useEffect(() => {
    const shouldScroll =
      location.pathname === '/course' || location.hash === '#course-content';
    if (!shouldScroll) return;

    const id = window.setTimeout(() => scrollToCourseContent('smooth'), 50);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash]);

  return (
    <PageWrapper showHeader={location.pathname === '/course'} bgVariant="gradient">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <Container size="lg">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="py-8 sm:py-20">
            {/* Language toggle — inline so it never overlaps the badge */}
            <motion.div variants={itemVariants} className="flex justify-center mb-5 sm:mb-6">
              <LanguageToggle size="sm" />
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-medium text-dark-600">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
                {t('welcome.badge')}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8 px-2">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-dark-700 mb-4 sm:mb-6 leading-tight">
                <span className="golden-highlight">{t('welcome.hero.line1')}</span>{' '}
                {t('welcome.hero.line2')}
                <br />
                {courseInfo.name}
              </h1>
              <p className="text-base sm:text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed px-2">
                {chatbotIntro.description}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center mb-8 sm:mb-12">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-br from-primary to-primary-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
                  <Bot className="w-12 h-12 sm:w-20 sm:h-20 text-dark-700" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-dark-700" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4 sm:px-0"
            >
              <Button
                size={isMobile ? 'lg' : 'xl'}
                onClick={() => scrollToCourseContent()}
                icon={<ForwardArrow className="w-4 h-4 sm:w-5 sm:h-5" />}
                iconPosition="end"
                fullWidth={isMobile}
                className="sm:min-w-[200px]"
              >
                {t('welcome.cta.viewCourse')}
              </Button>
              <Button
                variant="outline"
                size={isMobile ? 'lg' : 'xl'}
                onClick={startChat}
                icon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                iconPosition="end"
                fullWidth={isMobile}
                className="sm:min-w-[200px]"
              >
                {t('welcome.cta.startChat')}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-dark-700 mb-1.5 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-dark-400 text-xs sm:text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-dark-300 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-dark-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="py-12 sm:py-20 bg-dark-700 relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-[15%] w-40 sm:w-64 h-40 sm:h-64 bg-primary/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-10 left-[10%] w-48 sm:w-80 h-48 sm:h-80 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 25, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-0 left-[30%] w-32 sm:w-48 h-32 sm:h-48 bg-primary/30 rounded-full blur-2xl"
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center px-2 sm:px-0"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">{courseInfo.tagline}</h2>
            <p className="text-dark-200 text-base sm:text-lg max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              {courseInfo.description}
            </p>

            <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-16 max-w-md sm:max-w-none mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-black text-primary mb-1 sm:mb-2">{t('welcome.stats.numTracks')}</div>
                <div className="text-dark-300 text-xs sm:text-base">{t('welcome.stats.tracks')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-black text-primary mb-1 sm:mb-2">{t('welcome.stats.numModules')}</div>
                <div className="text-dark-300 text-xs sm:text-base">{t('welcome.stats.modules')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-black text-primary mb-1 sm:mb-2">{t('welcome.stats.numHours')}</div>
                <div className="text-dark-300 text-xs sm:text-base">{t('welcome.stats.hours')}</div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Course Content Section */}
      <section id="course-content" className="py-10 sm:py-16 bg-white border-b border-dark-100">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
            <div className={`lg:max-w-2xl text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'}`}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-4xl lg:text-5xl font-black text-dark-700 mb-3 sm:mb-4"
              >
                <span className="golden-highlight">{t('welcome.courseContent.title.prefix')}</span>{' '}
                {t('welcome.courseContent.title.suffix')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-dark-400 leading-relaxed"
              >
                {courseInfo.description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-4 lg:gap-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 bg-dark-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                <span className="font-semibold text-xs sm:text-base text-center">{courseInfo.duration}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 bg-dark-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                <span className="font-semibold text-xs sm:text-base">
                  {t('welcome.stats.numTracks')} {t('welcome.stats.tracksShort')}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 bg-dark-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                <span className="font-semibold text-xs sm:text-base">
                  {t('welcome.stats.numModules')} {t('welcome.stats.modulesShort')}
                </span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Course Tracks & Modules Section */}
      <section className="py-10 sm:py-16 bg-dark-50">
        <Container>
          <div className={`grid gap-8 sm:gap-12 ${isDesktop ? 'grid-cols-12' : ''}`}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={isDesktop ? 'col-span-4' : `text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'}`}
            >
              <div className="sticky top-24">
                <h3 className="text-xl sm:text-3xl font-black text-dark-700 mb-3 sm:mb-4">
                  <span className="golden-highlight">{t('welcome.courseContent.title.prefix')}</span>{' '}
                  {t('welcome.courseContent.title.suffix')}
                </h3>
                <p className="text-dark-400 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                  {t('welcome.content.sidebarBlurb', { duration: courseInfo.duration })}
                </p>

                <div className="p-4 sm:p-6 bg-dark-700 rounded-xl sm:rounded-2xl text-white relative overflow-hidden">
                  <motion.div
                    animate={{ x: [0, 10, 0], y: [0, -8, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-8 -right-8 w-20 sm:w-24 h-20 sm:h-24 bg-primary/30 rounded-full blur-2xl"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -bottom-6 -left-6 w-16 sm:w-20 h-16 sm:h-20 bg-primary/25 rounded-full blur-xl"
                  />

                  <h4 className={`font-bold text-base sm:text-lg mb-1.5 sm:mb-2 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t('welcome.content.haveQuestion')}
                  </h4>
                  <p className={`text-dark-200 text-xs sm:text-sm mb-3 sm:mb-4 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t('welcome.content.advisorReady')}
                  </p>
                  <Button
                    size={isMobile ? 'md' : 'lg'}
                    onClick={startChat}
                    icon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                    iconPosition="end"
                    fullWidth
                    className="relative z-10"
                  >
                    {t('welcome.cta.talkAdvisor')}
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={courseContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={isDesktop ? 'col-span-8' : ''}
            >
              <motion.div variants={courseItemVariants} className="mb-8 sm:mb-12">
                <h3 className={`text-lg sm:text-xl font-bold text-dark-700 mb-4 sm:mb-6 flex items-center gap-2 justify-center ${isRtl ? 'sm:justify-start' : 'sm:justify-start'}`}>
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  {t('welcome.tracks.sectionTitle')}
                </h3>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                  <Accordion type="single" defaultOpen={['intro']} iconStyle="plus-minus">
                    {tracks.map((track) => (
                      <AccordionItem key={track.id} id={track.id}>
                        <AccordionTrigger id={track.id} className="px-4 sm:px-6">
                          <div className={`flex flex-col items-start w-full ${isRtl ? 'text-right' : 'text-left'}`}>
                            <span className="text-sm sm:text-base">{track.title}</span>
                            <span className="text-xs sm:text-sm font-normal text-dark-400 mt-0.5 sm:mt-1">
                              {track.subtitle}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent id={track.id} className="px-4 sm:px-6">
                          <p className={`mb-3 sm:mb-4 text-sm sm:text-base ${isRtl ? 'text-right' : 'text-left'}`}>{track.description}</p>
                          <ul className="space-y-2">
                            {track.lessons.map((lesson, index) => (
                              <li key={index} className="flex items-center gap-2 sm:gap-3">
                                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
                                <span className="text-dark-600 text-sm sm:text-base">{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>

              <motion.div variants={courseItemVariants}>
                <h3 className="text-lg sm:text-xl font-bold text-dark-700 mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  {t('welcome.modules.sectionTitle')}
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-lg sm:text-xl font-black text-dark-700">{module.number}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-dark-700 mb-1.5 sm:mb-2">
                              {module.title}
                            </h4>
                            <p className="text-dark-400 text-xs sm:text-sm mb-3 sm:mb-4">
                              {module.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {module.topics.slice(0, isMobile ? 3 : 4).map((topic, i) => (
                                <span
                                  key={i}
                                  className="px-2 sm:px-3 py-0.5 sm:py-1 bg-dark-50 text-dark-600 text-[10px] sm:text-xs rounded-full"
                                >
                                  {topic}
                                </span>
                              ))}
                              {module.topics.length > (isMobile ? 3 : 4) && (
                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary-700 text-[10px] sm:text-xs rounded-full">
                                  +{module.topics.length - (isMobile ? 3 : 4)} {t('welcome.modules.moreTopics')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-10 sm:py-16 bg-dark-700 relative overflow-hidden">
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-[20%] w-48 sm:w-72 h-48 sm:h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 35, 0], y: [0, -20, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 left-[25%] w-40 sm:w-64 h-40 sm:h-64 bg-primary/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 right-[5%] -translate-y-1/2 w-28 sm:w-40 h-28 sm:h-40 bg-primary/30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-1/3 left-[8%] w-24 sm:w-32 h-24 sm:h-32 bg-primary/35 rounded-full blur-2xl"
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center px-2 sm:px-0"
          >
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{t('welcome.bottom.ready')}</h2>
            <p className="text-dark-200 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              {t('welcome.bottom.readyDesc')}
            </p>
            <Button
              size={isMobile ? 'lg' : 'xl'}
              onClick={startChat}
              icon={<ForwardArrow className="w-4 h-4 sm:w-5 sm:h-5" />}
              iconPosition="end"
              fullWidth={isMobile}
              className="sm:w-auto"
            >
              {t('welcome.cta.startChatWithAdvisor')}
            </Button>
          </motion.div>
        </Container>
      </section>
    </PageWrapper>
  );
}
