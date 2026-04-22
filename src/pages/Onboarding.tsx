import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, Phone, User, GraduationCap, Gauge, Clock, Zap, Wrench, Target, Users, Loader2 } from 'lucide-react';
import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, InternationalPhoneInput, Textarea } from '../components/ui';
import { Container, PageWrapper } from '../components/layout';
import {
  isOnboardingComplete,
  loadOnboarding,
  normalizePhone,
  saveOnboarding,
  toE164Phone,
  type OnboardingData,
  type OnboardingGender,
  type OnboardingPace,
  type OnboardingTimePerWeek,
  type Week4GoalChoice,
} from '../lib/onboarding';
import { sendOnboardingWebhook } from '../lib/chat-service';
import { useI18n } from '../lib/i18n';

type StepId =
  | 'phone'
  | 'job'
  | 'age'
  | 'gender'
  | 'education'
  | 'level'
  | 'time'
  | 'pace'
  | 'tools'
  | 'week4';

const TOTAL_STEPS = 10;

function stepIndexToId(stepIndex: number): StepId {
  const ids: StepId[] = ['phone', 'job', 'age', 'gender', 'education', 'level', 'time', 'pace', 'tools', 'week4'];
  return ids[stepIndex]!;
}

const toolSuggestions = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Cursor', 'Copilot'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { t, isRtl } = useI18n();

  const existing = useMemo(() => loadOnboarding(), []);
  const alreadyCompleted = useMemo(() => isOnboardingComplete(existing), [existing]);

  const initialPhone = useMemo(() => {
    const raw = existing?.phone ?? '';
    const normalized = normalizePhone(raw);
    const fallbackCountry: CountryCode = 'IR';
    if (!normalized) return { country: fallbackCountry, national: '' };

    const parsed = normalized.startsWith('+')
      ? parsePhoneNumberFromString(normalized)
      : parsePhoneNumberFromString(normalized, fallbackCountry);

    if (parsed?.isValid()) {
      return {
        country: (parsed.country ?? fallbackCountry) as CountryCode,
        national: parsed.nationalNumber,
      };
    }

    // If we can't parse, keep a best-effort national value and fallback country.
    return { country: fallbackCountry, national: normalized.replace(/^\+/, '') };
  }, [existing]);

  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(initialPhone.country);

  const [form, setForm] = useState<Omit<OnboardingData, 'completedAt'>>({
    phone: initialPhone.national,
    job: existing?.job ?? '',
    age: existing?.age ?? 0,
    gender: existing?.gender ?? 'na',
    education: existing?.education ?? '',
    level0to10: existing?.level0to10 ?? 0,
    timePerWeek: existing?.timePerWeek ?? '5h',
    pace: existing?.pace ?? 'deep',
    tools: existing?.tools ?? [],
    week4GoalChoice: existing?.week4GoalChoice ?? 'explain_ai_confident',
    week4GoalOtherText: existing?.week4GoalOtherText ?? '',
  });

  useEffect(() => {
    if (alreadyCompleted) {
      // If user comes back to onboarding after completing it, just go to chat.
      navigate('/chat', { replace: true });
    }
  }, [alreadyCompleted, navigate]);

  if (alreadyCompleted) return null;

  const currentStepId = stepIndexToId(stepIndex);
  const progressPct = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key as string]: '' }));
  };

  const toggleTool = (tool: string) => {
    setForm((prev) => {
      const set = new Set(prev.tools ?? []);
      if (set.has(tool)) set.delete(tool);
      else set.add(tool);
      return { ...prev, tools: Array.from(set) };
    });
  };

  const validateStep = (): boolean => {
    const nextErrors: Record<string, string> = {};

    switch (currentStepId) {
      case 'phone': {
        const raw = form.phone;
        if (!normalizePhone(raw)) nextErrors.phone = t('err.phone.required');
        else if (!toE164Phone(raw, phoneCountry)) nextErrors.phone = t('err.phone.invalid');
        break;
      }
      case 'job':
        if (!form.job.trim()) nextErrors.job = t('err.job.required');
        break;
      case 'age':
        if (!Number.isFinite(form.age) || form.age <= 0) nextErrors.age = t('err.age.numeric');
        else if (form.age < 10 || form.age > 100) nextErrors.age = t('err.age.range');
        break;
      case 'gender':
        if (!form.gender) nextErrors.gender = t('err.gender.required');
        break;
      case 'education':
        if (!form.education.trim()) nextErrors.education = t('err.edu.required');
        break;
      case 'level':
        if (!Number.isFinite(form.level0to10)) nextErrors.level0to10 = t('err.level.required');
        else if (form.level0to10 < 0 || form.level0to10 > 10) nextErrors.level0to10 = t('err.level.range');
        break;
      case 'time':
        if (!form.timePerWeek) nextErrors.timePerWeek = t('err.time.required');
        break;
      case 'pace':
        if (!form.pace) nextErrors.pace = t('err.pace.required');
        break;
      case 'tools':
        break;
      case 'week4':
        if (!form.week4GoalChoice) nextErrors.week4GoalChoice = t('err.week4.required');
        if (form.week4GoalChoice === 'other' && !form.week4GoalOtherText?.trim()) {
          nextErrors.week4GoalOtherText = t('err.week4.otherRequired');
        }
        break;
      default:
        break;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (stepIndex < TOTAL_STEPS - 1) setStepIndex((s) => s + 1);
  };

  const goBack = () => setStepIndex((s) => Math.max(0, s - 1));

  const finish = async () => {
    if (!validateStep()) return;
    
    const data: OnboardingData = {
      ...form,
      phone: toE164Phone(form.phone, phoneCountry),
      completedAt: new Date().toISOString(),
    };
    saveOnboarding(data);
    
    // Show loading state
    setIsSubmitting(true);
    
    try {
      // Send onboarding webhook and wait for response
      const response = await sendOnboardingWebhook();
      
      // Store the response in sessionStorage so Chat page can display it
      sessionStorage.setItem('onboarding_response', JSON.stringify(response));
      
      // Navigate to chat
      navigate('/chat', { replace: true });
    } catch (error) {
      console.error('Error sending onboarding webhook:', error);
      // Even if webhook fails, proceed to chat
      navigate('/chat', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepMeta = useMemo(() => {
    const metaById: Record<StepId, { title: string; desc: string; icon: ReactNode }> = {
      phone: { title: t('onb.phone.title'), desc: t('onb.phone.desc'), icon: <Phone className="w-5 h-5 text-primary-600" /> },
      job: { title: t('onb.job.title'), desc: t('onb.job.desc'), icon: <User className="w-5 h-5 text-primary-600" /> },
      age: { title: t('onb.age.title'), desc: t('onb.age.desc'), icon: <Users className="w-5 h-5 text-primary-600" /> },
      gender: { title: t('onb.gender.title'), desc: t('onb.gender.desc'), icon: <Users className="w-5 h-5 text-primary-600" /> },
      education: { title: t('onb.edu.title'), desc: t('onb.edu.desc'), icon: <GraduationCap className="w-5 h-5 text-primary-600" /> },
      level: { title: t('onb.level.title'), desc: t('onb.level.desc'), icon: <Gauge className="w-5 h-5 text-primary-600" /> },
      time: { title: t('onb.time.title'), desc: t('onb.time.desc'), icon: <Clock className="w-5 h-5 text-primary-600" /> },
      pace: { title: t('onb.pace.title'), desc: t('onb.pace.desc'), icon: <Zap className="w-5 h-5 text-primary-600" /> },
      tools: { title: t('onb.tools.title'), desc: t('onb.tools.desc'), icon: <Wrench className="w-5 h-5 text-primary-600" /> },
      week4: { title: t('onb.week4.title'), desc: t('onb.week4.desc'), icon: <Target className="w-5 h-5 text-primary-600" /> },
    };
    return metaById[currentStepId];
  }, [currentStepId, t]);

  const genderOptions: Array<{ value: OnboardingGender; label: string }> = [
    { value: 'male', label: t('onb.gender.male') },
    { value: 'female', label: t('onb.gender.female') },
    { value: 'other', label: t('onb.gender.other') },
    { value: 'na', label: t('onb.gender.na') },
  ];

  const timeOptions: Array<{ value: OnboardingTimePerWeek; label: string }> = [
    { value: '2h', label: t('onb.time.2h') },
    { value: '5h', label: t('onb.time.5h') },
    { value: '10h', label: t('onb.time.10h') },
  ];

  const paceOptions: Array<{ value: OnboardingPace; label: string; hint: string }> = [
    { value: 'fast', label: t('onb.pace.fast'), hint: t('onb.pace.fastHint') },
    { value: 'deep', label: t('onb.pace.deep'), hint: t('onb.pace.deepHint') },
  ];

  const week4Options: Array<{ value: Week4GoalChoice; label: string }> = [
    { value: 'explain_ai_confident', label: t('onb.week4.explain') },
    { value: 'use_chatgpt_pro', label: t('onb.week4.chatgpt') },
    { value: 'mini_workflow', label: t('onb.week4.mini') },
    { value: 'money_plan', label: t('onb.week4.money') },
    { value: 'other', label: t('onb.week4.other') },
  ];

  // Show loading screen while submitting onboarding data
  if (isSubmitting) {
    return (
      <PageWrapper bgVariant="gradient">
        <Container size="sm" className="py-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
              {/* Pulse effect */}
              <div className="absolute inset-0 w-24 h-24 bg-primary/10 rounded-full animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-dark-700 mb-3 text-center">
              {t('onb.submitting.title')}
            </h2>
            <p className="text-dark-400 text-center max-w-sm leading-relaxed">
              {t('onb.submitting.desc')}
            </p>
          </motion.div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper bgVariant="gradient">
      <Container size="sm" className="py-10 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    {stepMeta.icon}
                  </div>
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <CardTitle className="text-dark-700">{stepMeta.title}</CardTitle>
                    <CardDescription className="text-sm">{stepMeta.desc}</CardDescription>
                  </div>
                </div>
                <div className={isRtl ? 'text-left' : 'text-right'}>
                  <div className="text-sm text-dark-500 font-semibold">
                    {t('onb.step.of', { current: stepIndex + 1, total: TOTAL_STEPS })}
                  </div>
                  <div className="text-xs text-dark-300">{progressPct}%</div>
                </div>
              </div>

              <div className="mt-5 h-2 bg-dark-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              {/* Step Content */}
              {currentStepId === 'phone' && (
                <div className="space-y-4">
                  <InternationalPhoneInput
                    label={t('onb.phone.label')}
                    placeholder={t('onb.phone.placeholder')}
                    value={form.phone}
                    onChange={(v) => setField('phone', v)}
                    error={errors.phone}
                    country={phoneCountry}
                    onCountryChange={(c) => {
                      setPhoneCountry(c);
                      setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    autoFocus
                  />
                  <p className="text-xs text-dark-300 leading-relaxed">
                    {t('onb.phone.hint')}
                  </p>
                </div>
              )}

              {currentStepId === 'job' && (
                <Input
                  label={t('onb.job.title')}
                  placeholder={t('onb.job.placeholder')}
                  value={form.job}
                  onChange={(e) => setField('job', e.target.value)}
                  error={errors.job}
                  autoFocus
                />
              )}

              {currentStepId === 'age' && (
                <Input
                  label={t('onb.age.title')}
                  placeholder={t('onb.age.placeholder')}
                  value={form.age ? String(form.age) : ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const n = Number(normalizePhone(raw).replace('+', '').replace(/^0+/, ''));
                    setField('age', Number.isFinite(n) ? n : 0);
                  }}
                  error={errors.age}
                  inputMode="numeric"
                  autoFocus
                />
              )}

              {currentStepId === 'gender' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {genderOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={form.gender === opt.value ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => setField('gender', opt.value)}
                        className="justify-between"
                      >
                        <span>{opt.label}</span>
                        {form.gender === opt.value && <CheckCircle2 className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>
              )}

              {currentStepId === 'education' && (
                <Input
                  label={t('onb.edu.title')}
                  placeholder={t('onb.edu.placeholder')}
                  value={form.education}
                  onChange={(e) => setField('education', e.target.value)}
                  error={errors.education}
                  autoFocus
                />
              )}

              {currentStepId === 'level' && (
                <div className="space-y-4">
                  <Input
                    label={t('onb.level.label')}
                    placeholder="0"
                    value={String(form.level0to10)}
                    onChange={(e) => {
                      const n = Number(normalizePhone(e.target.value).replace('+', '').replace(/^0+/, ''));
                      setField('level0to10', Number.isFinite(n) ? n : 0);
                    }}
                    error={errors.level0to10}
                    inputMode="numeric"
                    autoFocus
                  />
                  <div className="flex justify-between text-xs text-dark-300">
                    <span>{t('onb.level.lo')}</span>
                    <span>{t('onb.level.hi')}</span>
                  </div>
                </div>
              )}

              {currentStepId === 'time' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {timeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={form.timePerWeek === opt.value ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => setField('timePerWeek', opt.value)}
                        className="justify-between"
                      >
                        <span>{opt.label}</span>
                        {form.timePerWeek === opt.value && <CheckCircle2 className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                  {errors.timePerWeek && <p className="text-sm text-red-500">{errors.timePerWeek}</p>}
                </div>
              )}

              {currentStepId === 'pace' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paceOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={form.pace === opt.value ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => setField('pace', opt.value)}
                        className="justify-between"
                      >
                        <span className="text-right">
                          <div className="font-semibold">{opt.label}</div>
                          <div className="text-xs opacity-80">{opt.hint}</div>
                        </span>
                        {form.pace === opt.value && <CheckCircle2 className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                  {errors.pace && <p className="text-sm text-red-500">{errors.pace}</p>}
                </div>
              )}

              {currentStepId === 'tools' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {toolSuggestions.map((t) => {
                      const selected = (form.tools ?? []).includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTool(t)}
                          className={`
                            px-3 py-2 rounded-full text-sm transition-colors
                            ${selected ? 'bg-primary text-dark-700' : 'bg-dark-50 text-dark-600 hover:bg-dark-100'}
                          `}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  <Input
                    label={t('onb.tools.other')}
                    placeholder={t('onb.tools.placeholder')}
                    value={(form.tools ?? []).filter((x) => !toolSuggestions.includes(x)).join(', ')}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const extras = raw
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const base = (form.tools ?? []).filter((x) => toolSuggestions.includes(x));
                      setField('tools', Array.from(new Set([...base, ...extras])));
                    }}
                  />
                </div>
              )}

              {currentStepId === 'week4' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {week4Options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField('week4GoalChoice', opt.value)}
                        className={`
                          w-full ${isRtl ? 'text-right' : 'text-left'} px-4 py-3 rounded-2xl border transition-all
                          ${form.week4GoalChoice === opt.value
                            ? 'border-primary bg-primary/10'
                            : 'border-dark-100 bg-white hover:bg-dark-50'}
                        `}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-dark-700">{opt.label}</span>
                          {form.week4GoalChoice === opt.value && <CheckCircle2 className="w-5 h-5 text-primary-700" />}
                        </div>
                      </button>
                    ))}
                    {errors.week4GoalChoice && <p className="text-sm text-red-500">{errors.week4GoalChoice}</p>}
                  </div>

                  {form.week4GoalChoice === 'other' && (
                    <Textarea
                      label={t('onb.week4.otherLabel')}
                      placeholder={t('onb.week4.otherPlaceholder')}
                      value={form.week4GoalOtherText ?? ''}
                      onChange={(e) => setField('week4GoalOtherText', e.target.value)}
                      error={errors.week4GoalOtherText}
                      rows={4}
                    />
                  )}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  icon={isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  iconPosition="start"
                >
                  {t('onb.prev')}
                </Button>

                {stepIndex < TOTAL_STEPS - 1 ? (
                  <Button
                    size="md"
                    onClick={goNext}
                    icon={isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    {t('onb.next')}
                  </Button>
                ) : (
                  <Button
                    size="md"
                    onClick={finish}
                    icon={isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    {t('onb.finish')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-dark-300">
            {t('onb.backToHome.prefix')}{' '}
            <button className="underline hover:text-dark-500" onClick={() => navigate('/', { replace: true })}>
              {t('onb.backToHome.link')}
            </button>
            {t('onb.backToHome.suffix')}
          </div>
        </motion.div>
      </Container>
    </PageWrapper>
  );
}


