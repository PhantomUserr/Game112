
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ShieldCheck, 
  Target,
  Trophy,
  Activity,
  GraduationCap
} from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface TutorialOverlayProps {
  onClose: () => void;
  language: 'ru' | 'en';
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose, language }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = language === 'ru' ? [
    {
      title: "Добро пожаловать",
      content: "Вы — старший оператор системы Метрополис 112. Город в ваших руках. Каждое решение влияет на жизни тысяч людей.",
      icon: <ShieldCheck className="text-emerald-400" size={40} />
    },
    {
      title: "Показатели",
      content: "РЕПУТАЦИЯ — это ваша прочность. ПАНИКА — враг города. Если репутация упадет до нуля или паника захлестнет город — смена окончена.",
      icon: <Activity className="text-red-500" size={40} />
    },
    {
      title: "Вызовы",
      content: "Сначала дайте ИНСТРУКЦИЮ звонящему, а затем выберите подходящую СЛУЖБУ для отправки на место происшествия.",
      icon: <Target className="text-sky-400" size={40} />
    },
    {
      title: "Опыт и Протоколы",
      content: "Ваше мастерство растет с каждым вызовом. Правильные действия повышают компетенцию служб, что ускоряет реагирование и лучше снижает панику.",
      icon: <GraduationCap className="text-yellow-500" size={40} />
    },
    {
      title: "Карьера и Успех",
      content: "Зарабатывайте бюджет и XP. Покупайте улучшения в МАГАЗИНЕ и открывайте ДОСТИЖЕНИЯ. Пройдите путь до Комиссара МЧС!",
      icon: <Trophy className="text-amber-500" size={40} />
    }
  ] : [
    {
      title: "Welcome aboard",
      content: "You are the head operator of Metropolis 112. The city depends on you. Every decision matters.",
      icon: <ShieldCheck className="text-emerald-400" size={40} />
    },
    {
      title: "Vital Stats",
      content: "REPUTATION is your health. PANIC is the enemy. If reputation hits zero or panic peaks — your shift is over.",
      icon: <Activity className="text-red-500" size={40} />
    },
    {
      title: "Call Flow",
      content: "First, provide INSTRUCTIONS, then DISPATCH the appropriate service to the emergency location.",
      icon: <Target className="text-sky-400" size={40} />
    },
    {
      title: "Field Experience",
      content: "Your mastery grows with every call. Proper protocol compliance increases service proficiency, resulting in faster responses.",
      icon: <GraduationCap className="text-yellow-500" size={40} />
    },
    {
      title: "Career Progress",
      content: "Earn budget and XP. Buy UPGRADES and unlock ACHIEVEMENTS. Rise from trainee to the Commissioner!",
      icon: <Trophy className="text-amber-500" size={40} />
    }
  ];

  const next = () => currentStep < steps.length - 1 ? setCurrentStep(s => s + 1) : onClose();
  const prev = () => currentStep > 0 && setCurrentStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 sm:p-10 flex flex-col items-center text-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>

        <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center border-2 border-slate-700 mb-6">
          {steps[currentStep].icon}
        </div>

        <div className="space-y-3 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">{steps[currentStep].title}</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{steps[currentStep].content}</p>
        </div>

        <div className="flex items-center gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-sky-500' : 'w-1.5 bg-slate-800'}`} />
          ))}
        </div>

        <div className="flex w-full gap-3">
          {currentStep > 0 && (
            <button onClick={prev} className="flex-1 py-4 px-4 rounded-2xl bg-slate-800 text-slate-300 font-black text-[10px] uppercase hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
              <ChevronLeft size={16} /> {language === 'ru' ? 'Назад' : 'Back'}
            </button>
          )}
          <button onClick={next} className="flex-1 py-4 px-4 rounded-2xl bg-sky-600 text-white font-black text-[10px] uppercase hover:bg-sky-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-900/40 tracking-widest">
            {currentStep === steps.length - 1 ? (language === 'ru' ? 'В Бой' : 'Start') : (language === 'ru' ? 'Далее' : 'Next')} 
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
