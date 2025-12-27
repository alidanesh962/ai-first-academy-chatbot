import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, Phone, User, GraduationCap, Gauge, Clock, Zap, Wrench, Target, Users } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '../components/ui';
import { Container, PageWrapper } from '../components/layout';
import {
  isOnboardingComplete,
  isValidIranPhone,
  loadOnboarding,
  normalizePhone,
  saveOnboarding,
  type OnboardingData,
  type OnboardingGender,
  type OnboardingPace,
  type OnboardingTimePerWeek,
  type Week4GoalChoice,
} from '../lib/onboarding';

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

  const existing = useMemo(() => loadOnboarding(), []);
  const alreadyCompleted = useMemo(() => isOnboardingComplete(existing), [existing]);

  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<Omit<OnboardingData, 'completedAt'>>({
    phone: existing?.phone ?? '',
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
        const phone = normalizePhone(form.phone);
        if (!phone) nextErrors.phone = 'شماره تلفن را وارد کنید.';
        else if (!isValidIranPhone(phone)) nextErrors.phone = 'شماره تلفن معتبر نیست. (مثل ۰۹۱۲۱۲۳۴۵۶۷)';
        break;
      }
      case 'job':
        if (!form.job.trim()) nextErrors.job = 'شغل خود را وارد کنید.';
        break;
      case 'age':
        if (!Number.isFinite(form.age) || form.age <= 0) nextErrors.age = 'سن را به‌صورت عدد وارد کنید.';
        else if (form.age < 10 || form.age > 100) nextErrors.age = 'لطفاً سن را بین ۱۰ تا ۱۰۰ وارد کنید.';
        break;
      case 'gender':
        if (!form.gender) nextErrors.gender = 'لطفاً یک گزینه انتخاب کنید.';
        break;
      case 'education':
        if (!form.education.trim()) nextErrors.education = 'تحصیلات را وارد کنید.';
        break;
      case 'level':
        if (!Number.isFinite(form.level0to10)) nextErrors.level0to10 = 'سطح را وارد کنید.';
        else if (form.level0to10 < 0 || form.level0to10 > 10) nextErrors.level0to10 = 'سطح باید بین ۰ تا ۱۰ باشد.';
        break;
      case 'time':
        if (!form.timePerWeek) nextErrors.timePerWeek = 'لطفاً زمان هفتگی را انتخاب کنید.';
        break;
      case 'pace':
        if (!form.pace) nextErrors.pace = 'لطفاً یک گزینه انتخاب کنید.';
        break;
      case 'tools':
        // optional
        break;
      case 'week4':
        if (!form.week4GoalChoice) nextErrors.week4GoalChoice = 'لطفاً یک گزینه انتخاب کنید.';
        if (form.week4GoalChoice === 'other' && !form.week4GoalOtherText?.trim()) {
          nextErrors.week4GoalOtherText = 'لطفاً هدف خود را بنویسید.';
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

  const finish = () => {
    if (!validateStep()) return;
    const data: OnboardingData = {
      ...form,
      phone: normalizePhone(form.phone),
      completedAt: new Date().toISOString(),
    };
    saveOnboarding(data);
    navigate('/chat', { replace: true });
  };

  const stepMeta = useMemo(() => {
    const metaById: Record<StepId, { title: string; desc: string; icon: ReactNode }> = {
      phone: {
        title: 'شماره تلفن',
        desc: 'برای ارتباط و پیگیری بهتر، شماره تلفن‌تان را وارد کنید.',
        icon: <Phone className="w-5 h-5 text-primary-600" />,
      },
      job: { title: 'شغل', desc: 'شغل یا حوزه کاری شما چیست؟', icon: <User className="w-5 h-5 text-primary-600" /> },
      age: { title: 'سن', desc: 'سن شما چند سال است؟', icon: <Users className="w-5 h-5 text-primary-600" /> },
      gender: { title: 'جنسیت', desc: 'لطفاً انتخاب کنید.', icon: <Users className="w-5 h-5 text-primary-600" /> },
      education: { title: 'تحصیلات', desc: 'بالاترین سطح تحصیلات شما چیست؟', icon: <GraduationCap className="w-5 h-5 text-primary-600" /> },
      level: { title: 'سطح (۰ تا ۱۰)', desc: 'سطح فعلی‌تان در کار با AI را مشخص کنید.', icon: <Gauge className="w-5 h-5 text-primary-600" /> },
      time: { title: 'زمان/هفته', desc: 'در هفته چقدر وقت می‌گذارید؟', icon: <Clock className="w-5 h-5 text-primary-600" /> },
      pace: { title: 'ریتم یادگیری', desc: 'ترجیح می‌دهید سریع پیش بروید یا عمیق؟', icon: <Zap className="w-5 h-5 text-primary-600" /> },
      tools: { title: 'ابزارها (اختیاری)', desc: 'چه ابزارهای AI استفاده می‌کنید؟', icon: <Wrench className="w-5 h-5 text-primary-600" /> },
      week4: {
        title: 'هدف هفته ۴',
        desc: 'وقتی هفته ۴ تمام می‌شود، بیشتر از همه دوست دارید چه چیزی درست باشد؟',
        icon: <Target className="w-5 h-5 text-primary-600" />,
      },
    };
    return metaById[currentStepId];
  }, [currentStepId]);

  const genderOptions: Array<{ value: OnboardingGender; label: string }> = [
    { value: 'male', label: 'مرد' },
    { value: 'female', label: 'زن' },
    { value: 'other', label: 'دیگر' },
    { value: 'na', label: 'ترجیح می‌دهم نگویم' },
  ];

  const timeOptions: Array<{ value: OnboardingTimePerWeek; label: string }> = [
    { value: '2h', label: '۲ ساعت' },
    { value: '5h', label: '۵ ساعت' },
    { value: '10h', label: '۱۰ ساعت' },
  ];

  const paceOptions: Array<{ value: OnboardingPace; label: string; hint: string }> = [
    { value: 'fast', label: 'فست ترک', hint: 'سریع و نتیجه‌محور' },
    { value: 'deep', label: 'عمیق', hint: 'با مثال و تمرین بیشتر' },
  ];

  const week4Options: Array<{ value: Week4GoalChoice; label: string }> = [
    { value: 'explain_ai_confident', label: 'می‌تونم AI رو واضح توضیح بدم و اعتمادبه‌نفس داشته باشم.' },
    { value: 'use_chatgpt_pro', label: 'می‌تونم مثل حرفه‌ای‌ها از ChatGPT برای کارهای واقعی استفاده کنم.' },
    { value: 'mini_workflow', label: 'یک مینی‌ورک‌فلو/اتوماسیونِ قابل‌استفاده برای کارم دارم.' },
    { value: 'money_plan', label: 'یک برنامه روشن دارم که AI چطور برام پول می‌سازه.' },
    { value: 'other', label: 'سایر' },
  ];

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
                  <div className="text-right">
                    <CardTitle className="text-dark-700">{stepMeta.title}</CardTitle>
                    <CardDescription className="text-sm">{stepMeta.desc}</CardDescription>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-dark-500 font-semibold">
                    مرحله {stepIndex + 1} از {TOTAL_STEPS}
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
                  <Input
                    label="شماره تلفن"
                    placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    error={errors.phone}
                    inputMode="tel"
                    autoFocus
                  />
                  <p className="text-xs text-dark-300 leading-relaxed">
                    فقط برای شخصی‌سازی مشاوره و پیگیری بهتر استفاده می‌شود.
                  </p>
                </div>
              )}

              {currentStepId === 'job' && (
                <Input
                  label="شغل"
                  placeholder="مثلاً برنامه‌نویس، مدیر محصول، فروش، دانشجو..."
                  value={form.job}
                  onChange={(e) => setField('job', e.target.value)}
                  error={errors.job}
                  autoFocus
                />
              )}

              {currentStepId === 'age' && (
                <Input
                  label="سن"
                  placeholder="مثلاً ۲۷"
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
                  label="تحصیلات"
                  placeholder="مثلاً دیپلم، کارشناسی، کارشناسی ارشد..."
                  value={form.education}
                  onChange={(e) => setField('education', e.target.value)}
                  error={errors.education}
                  autoFocus
                />
              )}

              {currentStepId === 'level' && (
                <div className="space-y-4">
                  <Input
                    label="سطح شما (۰ تا ۱۰)"
                    placeholder="۰"
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
                    <span>۰: تازه‌کار</span>
                    <span>۱۰: خیلی حرفه‌ای</span>
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
                    label="ابزارهای دیگر (اختیاری)"
                    placeholder="مثلاً Midjourney, Notion AI..."
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
                          w-full text-right px-4 py-3 rounded-2xl border transition-all
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
                      label="هدف شما"
                      placeholder="هدف خودتان را بنویسید..."
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
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="start"
                >
                  قبلی
                </Button>

                {stepIndex < TOTAL_STEPS - 1 ? (
                  <Button
                    size="md"
                    onClick={goNext}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    ادامه
                  </Button>
                ) : (
                  <Button
                    size="md"
                    onClick={finish}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    شروع گفتگو
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-dark-300">
            اگر نمی‌خواهید الان ادامه دهید، می‌توانید به{' '}
            <button className="underline hover:text-dark-500" onClick={() => navigate('/', { replace: true })}>
              صفحه اصلی
            </button>{' '}
            برگردید.
          </div>
        </motion.div>
      </Container>
    </PageWrapper>
  );
}


