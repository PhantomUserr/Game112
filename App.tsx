import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Phone,
  ShieldCheck,
  TrendingUp,
  Coins,
  Settings,
  Trophy,
  ShoppingCart,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RotateCcw,
  Volume2,
  Languages,
  HelpCircle,
  User,
  ListOrdered,
  Terminal,
  LogOut,
  Target,
  Wifi,
  Activity,
  Radio,
  Key,
  Database,
  CloudCheck,
  UserPlus,
  BookOpen,
  Newspaper,
  History,
  XCircle,
  ChevronRight,
  Award,
  Zap
} from 'lucide-react';

import { 
  UnitType, 
  GameState, 
  QuizOption,
  Incident,
  Upgrade,
  LeaderboardEntry,
  AccountRegistry,
  HandledIncident
} from './types';
import { 
  INITIAL_PROFICIENCY, 
  INITIAL_REPUTATION, 
  INITIAL_PANIC, 
  UNIT_ICONS, 
  UNIT_NAMES, 
  MAX_PANIC,
  UNIT_COOLDOWN_MS,
  QUIZ_TIMEOUT_SEC,
  RANKS,
  ACHIEVEMENTS_LIST,
  UPGRADES_LIST,
  MOCK_LEADERBOARD
} from './constants';
import { getRandomStaticIncident } from './services/gameLogic';
import { TutorialOverlay } from './components/TutorialOverlay';
import { STATIC_SCENARIOS } from './services/scenarios';

// --- Audio Service (Internal) ---
const useAudio = (enabled: boolean) => {
  const playSound = useCallback((type: 'click' | 'success' | 'error' | 'alert' | 'startup' | 'hover' | 'paper') => {
    if (!enabled) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'paper':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'success':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'alert':
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        osc.frequency.setValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case 'startup':
        osc.type = 'sine';
        [200, 300, 400, 600].forEach((f, i) => {
          osc.frequency.setValueAtTime(f, now + i * 0.1);
        });
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'hover':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
    }
  }, [enabled]);

  return { playSound };
};

type ViewMode = 'mission' | 'career' | 'achievements' | 'shop' | 'settings' | 'leaderboard' | 'profile' | 'news';
type SortKey = 'level' | 'totalResolved' | 'perfectResolves';

const translations = {
  ru: {
    reputation: "РЕП",
    panic: "ПАН",
    budget: "БЮДЖЕТ",
    waiting: "ОЖИДАНИЕ СИГНАЛА...",
    acceptCall: "ПРИНЯТЬ ВЫЗОВ",
    phase01: "ИНСТРУКТАЖ",
    phase02: "ДИСПЕТЧЕРИЗАЦИЯ",
    callResolved: "ОБЪЕКТ ПОД КОНТРОЛЕМ",
    next: "СЛЕДУЮЩИЙ",
    close: "ЗАКРЫТЬ",
    achievements: "Достижения",
    unlocked: "Разблокировано",
    shop: "Арсенал",
    career: "Карьера",
    settings: "Конфигурация",
    language: "Язык",
    gameOver: "ТЕРМИНАЛ ЗАБЛОКИРОВАН",
    gameOverSub: "Город погрузился в хаос. Ваша лицензия оперативника аннулирована.",
    newShift: "НОВАЯ СМЕНА",
    fleet: "СТАТУС СЛУЖБ",
    returning: "ОБРАБОТКА",
    upgrade: "Модернизация",
    mission: "Смена",
    options: "Опции",
    xp: "XP",
    syncing: "СИНХРОНИЗАЦИЯ С ЦУП...",
    help: "База знаний",
    reset: "Стереть данные",
    resetDesc: "Все записи и достижения будут удалены из базы данных МЧС.",
    nextIn: "СЛЕДУЮЩИЙ ЧЕРЕЗ",
    correctAction: "ПРОТОКОЛ МЧС:",
    mistake: "НАРУШЕНИЕ",
    excellent: "ОТЛИЧНО",
    buy: "Приобрести",
    maxLevel: "МАКС. УРОВЕНЬ",
    sounds: "Звуковые эффекты",
    music: "Фоновая музыка",
    secretAchievement: "Секретный файл",
    lockedAchievement: "Доступ ограничен",
    startTutorial: "Краткий инструктаж",
    streak: "Серия",
    leaderboard: "Рейтинг",
    rank: "Поз.",
    user: "Оперативник",
    totalChallenges: "Вызовы",
    perfectChallenges: "Профи",
    level: "Ур.",
    createAccount: "Регистрация в системе",
    enterUsername: "Идентификатор",
    enterPassword: "Пароль доступа",
    startService: "Войти в систему",
    register: "Зарегистрировать",
    welcome: "Статус: Онлайн",
    stats: "Статистика",
    onDutySince: "Служба с",
    highestStreak: "Макс. серия",
    moneyEarned: "Всего средств",
    accuracy: "Точность",
    profile: "Профиль",
    logout: "Выход",
    retakeTutorial: "Пройти обучение заново",
    syncReady: "ОБЛАКО: ГОТОВО",
    invalidPass: "ОШИБКА ДОСТУПА: НЕВЕРНЫЙ ПАРОЛЬ",
    userExists: "ОШИБКА: ОПЕРАТИВНИК УЖЕ В БАЗЕ",
    loginTab: "Вход",
    registerTab: "Регистрация",
    newsHeadline: "ГЛАВНЫЕ НОВОСТИ МЕТРОПОЛИСА",
    shiftSummary: "ИТОГИ СМЕНЫ",
    debriefing: "ОТЧЕТ ОБ ОПЕРАЦИЯХ",
    whatHappened: "ЧТО ПРОИЗОШЛО",
    correctProtocols: "ОПТИМАЛЬНЫЙ ПРОТОКОЛ",
    finishShift: "ЗАВЕРШИТЬ СМЕНУ",
    handled: "ОБРАБОТАНО",
    perfect: "ИДЕАЛЬНО",
    failed: "ПРОВАЛЕНО",
    backToDuty: "ВЕРНУТЬСЯ НА ПОСТ",
    morningMetropolis: "УТРО МЕТРОПОЛИСА",
    eveningMetropolis: "ВЕЧЕРНИЙ ГОРОД",
    dailyEcho: "ЕЖЕДНЕВНОЕ ЭХО",
    hintNote: "ПОДСКАЗКА ДЛЯ ОПЕРАТОРА",
    optimalDispatch: "РЕКОМЕНДУЕМЫЕ СЛУЖБЫ"
  },
  en: {
    reputation: "REP",
    panic: "PAN",
    budget: "BUDGET",
    waiting: "WAITING FOR SIGNAL...",
    acceptCall: "ACCEPT CALL",
    phase01: "INSTRUCTIONS",
    phase02: "DISPATCH",
    callResolved: "OBJECTIVE SECURED",
    next: "NEXT",
    close: "CLOSE",
    achievements: "Achievements",
    unlocked: "Unlocked",
    shop: "Arsenal",
    career: "Career",
    settings: "Settings",
    language: "Language",
    gameOver: "TERMINAL LOCKED",
    gameOverSub: "Chaos took the city. Your operator license has been revoked.",
    newShift: "NEW SHIFT",
    fleet: "SERVICE STATUS",
    returning: "PROCESSING",
    upgrade: "Upgrade",
    mission: "Shift",
    options: "Options",
    xp: "XP",
    syncing: "SYNCING WITH HQ...",
    help: "Tutorial",
    reset: "Wipe Data",
    resetDesc: "All records and achievements will be erased from central database.",
    nextIn: "NEXT IN",
    correctAction: "OFFICIAL PROTOCOL:",
    mistake: "VIOLATION",
    excellent: "EXCELLENT",
    buy: "Purchase",
    maxLevel: "MAX LVL",
    sounds: "SFX",
    music: "Music",
    secretAchievement: "Secret File",
    lockedAchievement: "Locked",
    startTutorial: "Start Briefing",
    streak: "Streak",
    leaderboard: "Leaderboard",
    rank: "Pos",
    user: "Operator",
    totalChallenges: "Calls",
    perfectChallenges: "Perfect",
    level: "Lvl",
    createAccount: "System Registration",
    enterUsername: "Operator ID",
    enterPassword: "Access Password",
    startService: "Login",
    register: "Register",
    welcome: "Status: Online",
    stats: "Statistics",
    onDutySince: "Since",
    highestStreak: "Highest Streak",
    moneyEarned: "Total Funds",
    accuracy: "Accuracy",
    profile: "Profile",
    logout: "Logout",
    retakeTutorial: "Retake Tutorial",
    syncReady: "CLOUD: READY",
    invalidPass: "ACCESS DENIED: WRONG PASSWORD",
    userExists: "ERROR: OPERATOR ALREADY IN DB",
    loginTab: "Sign In",
    registerTab: "Sign Up",
    newsHeadline: "METROPOLIS BREAKING NEWS",
    shiftSummary: "SHIFT SUMMARY",
    debriefing: "OPERATIONAL DEBRIEF",
    whatHappened: "WHAT HAPPENED",
    correctProtocols: "OPTIMAL PROTOCOL",
    finishShift: "FINISH SHIFT",
    handled: "HANDLED",
    perfect: "PERFECT",
    failed: "FAILED",
    backToDuty: "BACK TO DUTY",
    morningMetropolis: "METROPOLIS MORNING",
    eveningMetropolis: "CITY EVENING",
    dailyEcho: "DAILY ECHO",
    hintNote: "OPERATOR HINT",
    optimalDispatch: "OPTIMAL DISPATCH"
  }
};

const App = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const currentSession = localStorage.getItem('dispatch_active_user');
    if (currentSession) {
      const dbRaw = localStorage.getItem('dispatch_accounts_db');
      if (dbRaw) {
        try {
          const db: AccountRegistry = JSON.parse(dbRaw);
          const userData = db[currentSession];
          if (userData) {
            return {
              ...userData.saveData,
              currentIncident: null,
              shiftHistory: [],
              usedIncidentIds: userData.saveData.usedIncidentIds || [],
              isGameOver: false,
              isPaused: false,
              cooldowns: [],
              quizTimeLeft: QUIZ_TIMEOUT_SEC,
              achievements: ACHIEVEMENTS_LIST.map(a => {
                const found = userData.saveData.achievements?.find((pa: any) => pa.id === a.id);
                return found ? { ...a, unlocked: found.unlocked } : a;
              })
            } as GameState;
          }
        } catch (e) { console.error(e); }
      }
    }
    return {
      user: null,
      reputation: INITIAL_REPUTATION,
      panic: INITIAL_PANIC,
      proficiency: { ...INITIAL_PROFICIENCY },
      cooldowns: [],
      currentIncident: null,
      shiftHistory: [],
      usedIncidentIds: [],
      score: 0,
      xp: 0,
      level: 0,
      streak: 0,
      isGameOver: false,
      isPaused: false,
      totalResolved: 0,
      perfectResolves: 0,
      quizTimeLeft: QUIZ_TIMEOUT_SEC,
      achievements: [...ACHIEVEMENTS_LIST],
      upgrades: [...UPGRADES_LIST],
      language: 'ru',
      musicEnabled: true,
      sfxEnabled: true
    };
  });

  const { playSound } = useAudio(gameState.sfxEnabled);
  const [activeTab, setActiveTab] = useState<ViewMode>('mission');
  const [isVisualLoading, setIsVisualLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !localStorage.getItem('tutorial_completed'));
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [leaderboardSort, setLeaderboardSort] = useState<SortKey>('level');

  const t = (key: keyof typeof translations['ru']) => translations[gameState.language][key];

  const progressToNextRank = useMemo(() => {
    const currentRank = RANKS[gameState.level];
    const nextRank = RANKS[gameState.level + 1];
    if (!nextRank) return 100;
    const range = nextRank.minXp - currentRank.minXp;
    const progress = gameState.xp - currentRank.minXp;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }, [gameState.xp, gameState.level]);

  useEffect(() => {
    if (gameState.user) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        const dbRaw = localStorage.getItem('dispatch_accounts_db');
        let db: AccountRegistry = dbRaw ? JSON.parse(dbRaw) : {};
        const { currentIncident, isPaused, isGameOver, cooldowns, quizTimeLeft, shiftHistory, ...persistentState } = gameState;
        if (db[gameState.user!.username]) {
          db[gameState.user!.username].saveData = persistentState;
          localStorage.setItem('dispatch_accounts_db', JSON.stringify(db));
          localStorage.setItem('dispatch_active_user', gameState.user!.username);
        }
        setIsSyncing(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.xp, gameState.level, gameState.money, gameState.totalResolved, gameState.perfectResolves, gameState.streak, gameState.upgrades, gameState.achievements, gameState.usedIncidentIds]);

  useEffect(() => {
    if (gameState.isGameOver || !gameState.user) return;
    setGameState(prev => {
      let updated = false;
      const nextRank = RANKS[prev.level + 1];
      const levelUp = nextRank && prev.xp >= nextRank.minXp;
      const newAchievements = prev.achievements.map(ach => {
        if (!ach.unlocked && ach.condition(prev)) {
          updated = true;
          playSound('success');
          return { ...ach, unlocked: true };
        }
        return ach;
      });
      if (levelUp || updated) return { ...prev, level: levelUp ? prev.level + 1 : prev.level, achievements: newAchievements };
      return prev;
    });
  }, [gameState.xp, gameState.totalResolved, gameState.money, gameState.streak, gameState.user, playSound]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused || isVisualLoading || showTutorial || !gameState.user || activeTab === 'news') return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      setGameState(prev => {
        const activeCooldowns = prev.cooldowns.filter(c => c.returnsAt > now);
        let quizTimeLeft = prev.quizTimeLeft;
        let nextIncident = prev.currentIncident;
        let reputation = prev.reputation;
        let panic = prev.panic;
        let isGameOver = prev.isGameOver;

        if (prev.currentIncident && (prev.currentIncident.step === 'CALL' || prev.currentIncident.step === 'DISPATCH')) {
          quizTimeLeft -= 1;
          if (quizTimeLeft <= 3 && quizTimeLeft > 0) playSound('click');
          if (quizTimeLeft <= 0) {
            playSound('error');
            reputation = Math.max(0, prev.reputation - 15);
            panic = Math.min(MAX_PANIC, prev.panic + 10);
            
            // Log failed incident to history on timeout
            const historyItem: HandledIncident = {
              incident: { ...prev.currentIncident, quizStatus: 'failed', step: 'FEEDBACK' },
              wasPerfect: false,
              wasFailed: true,
              timestamp: Date.now()
            };
            
            return { 
              ...prev, 
              cooldowns: activeCooldowns, 
              quizTimeLeft: QUIZ_TIMEOUT_SEC, 
              currentIncident: null, 
              reputation, 
              panic, 
              isGameOver: reputation <= 0 || panic >= MAX_PANIC,
              shiftHistory: [...prev.shiftHistory, historyItem]
            };
          }
        }
        
        const gameOverNow = reputation <= 0 || panic >= MAX_PANIC;
        if (gameOverNow && !isGameOver) {
          setActiveTab('news');
        }

        return { 
          ...prev, 
          cooldowns: activeCooldowns, 
          quizTimeLeft, 
          currentIncident: nextIncident, 
          reputation, 
          panic, 
          isGameOver: gameOverNow 
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.isGameOver, gameState.isPaused, gameState.currentIncident?.step, isVisualLoading, showTutorial, gameState.user, playSound, activeTab]);

  const startNewCall = () => {
    playSound('alert');
    setIsVisualLoading(true);
    setTimeout(() => {
      const { incident, timeLeft } = getRandomStaticIncident(gameState.language, gameState.usedIncidentIds, gameState.level);
      const aiBonus = (gameState.upgrades.find(u => u.id === 'call_ai')?.level || 0) * 2;
      setGameState(prev => ({ 
        ...prev, 
        currentIncident: incident, 
        usedIncidentIds: [...prev.usedIncidentIds, incident.id],
        quizTimeLeft: timeLeft + aiBonus 
      }));
      setIsVisualLoading(false);
    }, 600);
  };

  const handleInstruction = (option: QuizOption) => {
    if (!gameState.currentIncident) return;
    const incident = { ...gameState.currentIncident };
    let { reputation, panic, xp, money, streak } = gameState;
    const xpMod = 1 + (gameState.upgrades.find(u => u.id === 'mobile_app')?.level || 0) * 0.15;

    if (option.isCorrect) {
      playSound('success');
      reputation = Math.min(100, reputation + 5);
      xp += 50 * xpMod;
      money += 20;
      incident.quizStatus = 'solved';
      incident.step = 'DISPATCH';
      setGameState(prev => ({ ...prev, currentIncident: incident, reputation, panic, xp, money }));
    } else {
      playSound('error');
      reputation = Math.max(0, reputation - 10);
      panic = Math.min(100, panic + 10);
      streak = 0;
      incident.quizStatus = 'failed';
      incident.step = 'FEEDBACK';
      incident.lastFeedback = {
        isCorrect: false,
        text: t('mistake'),
        actionNeeded: option.explanation || incident.quiz.options.find(o => o.isCorrect)?.explanation || incident.emercomFact
      };
      setGameState(prev => ({ ...prev, currentIncident: incident, reputation, panic, streak }));
      // Transition to dispatch after feedback delay
      setTimeout(() => setGameState(p => p.currentIncident ? ({ ...p, currentIncident: { ...p.currentIncident, step: 'DISPATCH' } }) : p), 6000);
    }
  };

  const handleDispatch = (option: any) => {
    if (!gameState.currentIncident) return;
    if (gameState.cooldowns.some(c => c.type === option.unitType)) return;

    const cooldownBase = UNIT_COOLDOWN_MS;
    const speedMod = 1 - (gameState.upgrades.find(u => u.id === 'fast_dispatch')?.level || 0) * 0.05;
    const masteryMod = 1 - (gameState.proficiency[option.unitType as UnitType] / 200);
    const xpMod = 1 + (gameState.upgrades.find(u => u.id === 'mobile_app')?.level || 0) * 0.15;
    
    const incident = { ...gameState.currentIncident };
    let { reputation, panic, xp, money, perfectResolves, totalResolved, streak, shiftHistory } = gameState;

    if (option.isCorrect) {
      playSound('success');
      reputation = Math.min(100, reputation + 5);
      panic = Math.max(0, panic - 5);
      xp += 100 * xpMod;
      money += 50;
      streak += 1;
      const wasPerfect = incident.quizStatus === 'solved';
      if (wasPerfect) perfectResolves += 1;
      totalResolved += 1;

      const historyItem: HandledIncident = {
        incident: { ...incident, step: 'RESOLVED' },
        wasPerfect,
        wasFailed: false,
        timestamp: Date.now()
      };

      setGameState(prev => {
        const newProf = { ...prev.proficiency };
        newProf[option.unitType as UnitType] = Math.min(100, newProf[option.unitType as UnitType] + 5);
        const newCooldowns = [...prev.cooldowns, { type: option.unitType as UnitType, returnsAt: Date.now() + (cooldownBase * speedMod * masteryMod) }];
        const newUser = prev.user ? { ...prev.user, stats: { ...prev.user.stats, totalCallsHandled: totalResolved, totalMoneyEarned: prev.user.stats.totalMoneyEarned + 50, highestStreak: Math.max(prev.user.stats.highestStreak, streak) } } : null;
        return { 
          ...prev, 
          user: newUser, 
          proficiency: newProf, 
          cooldowns: newCooldowns, 
          currentIncident: { ...incident, step: 'RESOLVED' }, 
          reputation, 
          panic, 
          xp, 
          money, 
          perfectResolves, 
          totalResolved, 
          streak,
          shiftHistory: [...prev.shiftHistory, historyItem]
        };
      });
      setTimeout(() => setGameState(prev => ({ ...prev, currentIncident: null })), 3000);
    } else {
      playSound('error');
      const failedIncident = { ...incident, step: 'FEEDBACK', quizStatus: 'failed' as const, lastFeedback: { isCorrect: false, text: t('mistake'), actionNeeded: t('correctAction') + " " + (incident.dispatchQuiz.options.find(o => o.isCorrect)?.text || "") } };
      
      const historyItem: HandledIncident = {
        incident: failedIncident,
        wasPerfect: false,
        wasFailed: true,
        timestamp: Date.now()
      };

      setGameState(prev => ({ 
        ...prev, 
        reputation: Math.max(0, prev.reputation - 15), 
        panic: Math.min(100, prev.panic + 15), 
        streak: 0, 
        currentIncident: failedIncident,
        shiftHistory: [...prev.shiftHistory, historyItem]
      }));
      setTimeout(() => setGameState(prev => ({ ...prev, currentIncident: null })), 5000);
    }
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (gameState.money < upgrade.cost || upgrade.level >= upgrade.maxLevel) return;
    playSound('success');
    setGameState(prev => ({ ...prev, upgrades: prev.upgrades.map(u => u.id === upgrade.id ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.5) } : u), money: prev.money - upgrade.cost }));
  };

  const changeTab = (tab: ViewMode) => {
    playSound('click');
    setActiveTab(tab);
  };

  const logout = () => {
    playSound('alert');
    localStorage.removeItem('dispatch_active_user');
    window.location.reload();
  };

  const resetShift = () => {
    playSound('startup');
    setGameState(prev => ({
      ...prev,
      reputation: INITIAL_REPUTATION,
      panic: INITIAL_PANIC,
      currentIncident: null,
      shiftHistory: [],
      streak: 0,
      isGameOver: false,
      isPaused: false,
      cooldowns: [],
      quizTimeLeft: QUIZ_TIMEOUT_SEC
    }));
    setActiveTab('mission');
  };

  const getLeaderboard = (): LeaderboardEntry[] => {
    if (!gameState.user) return [];
    return [{ 
      id: gameState.user.id, 
      username: gameState.user.username, 
      level: gameState.level, 
      totalResolved: gameState.totalResolved, 
      perfectResolves: gameState.perfectResolves, 
      isCurrentUser: true 
    }];
  };

  if (!gameState.user) return <LoginOverlay onLoginSuccess={(state: GameState) => { playSound('startup'); setGameState(state); }} t={t} />;

  return (
    <div className="fixed inset-0 bg-[#020617] text-slate-200 font-sans flex flex-col overflow-hidden select-none">
      {showTutorial && <TutorialOverlay language={gameState.language} onClose={() => { playSound('click'); setShowTutorial(false); localStorage.setItem('tutorial_completed', 'true'); }} />}
      
      <header className="bg-[#0b1221]/80 backdrop-blur-md border-b border-sky-500/20 p-3 sm:px-8 flex justify-between items-center z-50 shrink-0 h-20 sm:h-24 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
        <div className="flex items-center gap-3 sm:gap-6 cursor-pointer group" onClick={() => changeTab('profile')}>
          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-sky-500/10 border-2 ${activeTab === 'profile' ? 'border-sky-400 shadow-[0_0_20px_#38bdf8]' : 'border-slate-800'} flex items-center justify-center text-sky-400 font-black text-xs sm:text-base transition-all group-hover:scale-110`}>
            {gameState.user.username.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white tracking-widest uppercase truncate max-w-[80px] sm:max-w-none glow-text">{gameState.user.username}</span>
            <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
               <div className="h-full bg-sky-500 transition-all duration-500 shadow-[0_0_10px_#38bdf8]" style={{ width: `${progressToNextRank}%` }} />
            </div>
          </div>
        </div>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-4 overflow-x-auto px-4">
           {['mission', 'shop', 'achievements', 'leaderboard', 'settings'].map((tab) => (
             <HeaderNavBtn key={tab} active={activeTab === tab} onClick={() => changeTab(tab as ViewMode)} label={t(tab as any).split(' ')[0]} />
           ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden lg:flex gap-4">
            <div className="flex flex-col items-end">
              <span className={`text-[8px] font-black uppercase transition-colors duration-500 ${isSyncing ? 'text-amber-500' : 'text-emerald-500'}`}>
                {isSyncing ? 'SYNCING...' : t('syncReady')}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= 3 ? (isSyncing ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_5px_currentColor]') : 'bg-slate-800'}`} />)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <StatDisplay label={t('reputation')} value={gameState.reputation} color="bg-blue-600" />
              <StatDisplay label={t('panic')} value={gameState.panic} color="bg-red-600" isBad />
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm sm:text-lg bg-emerald-900/10 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
             <Coins size={14} className="sm:size-16" /> {Math.floor(gameState.money)}
          </div>
        </div>
      </header>

      {/* Atmospheric Terminal Overlay Elements */}
      <div className="absolute top-28 left-8 hidden lg:block z-10 pointer-events-none opacity-40">
        <div className="flex items-center gap-2 text-[10px] font-black text-red-500">
           <div className="w-2 h-2 rounded-full bg-red-500" /> REC: SIGNAL_CORE_LIVE
        </div>
        <div className="text-[8px] font-mono text-slate-500 mt-2 space-y-1">
           <div>SYS.LOG: INBOUND_DATA_ENCRYPTED</div>
           <div>METROPOLIS_GRID: STABLE</div>
           <div>USER_ID: {gameState.user.id}</div>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
        <section className={`flex-1 h-full overflow-hidden ${activeTab === 'mission' ? 'flex' : 'hidden'}`}>
           <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-10 overflow-y-auto">
              {!gameState.currentIncident ? (
                <div className="text-center animate-in fade-in duration-700 w-full max-w-lg">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 bg-sky-950/20 rounded-3xl flex items-center justify-center text-sky-400 border border-sky-500/10 mx-auto mb-10 relative">
                    <Radio size={40} className="sm:size-48 opacity-20" />
                    <div className="absolute inset-0 border-2 border-sky-500/20 rounded-3xl opacity-20" />
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-widest mb-12 italic glow-text">{t('waiting')}</h2>
                  <div className="space-y-4">
                    <button onClick={startNewCall} disabled={isVisualLoading} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 text-lg uppercase tracking-widest border border-white/10 group">
                      {isVisualLoading ? <Loader2 size={24} className="animate-spin mx-auto" /> : (
                        <span className="flex items-center justify-center gap-3">
                          <Phone /> {t('acceptCall')}
                        </span>
                      )}
                    </button>
                    {gameState.shiftHistory.length > 0 && (
                      <button onClick={() => { playSound('paper'); setActiveTab('news'); }} className="w-full bg-slate-800/40 hover:bg-slate-800/60 text-slate-400 font-bold py-3 rounded-xl border border-white/5 uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2">
                        <Newspaper size={16} /> {t('finishShift')}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-10 duration-500 pb-20 sm:pb-0">
                   <div className="bg-[#0c1322]/80 backdrop-blur-md border border-sky-500/20 rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <Terminal size={150} />
                      </div>
                      <div className="flex justify-between items-start mb-6 gap-3 z-10 relative">
                         <div className="flex-1">
                            <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2 italic glow-text">{gameState.currentIncident.title}</h2>
                            <p className="text-[10px] text-sky-500/70 flex items-center gap-2 font-mono uppercase tracking-widest"><Target size={12} className="opacity-50" /> {gameState.currentIncident.location}</p>
                            <div className="flex gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`h-1 w-4 rounded-full ${i < (gameState.currentIncident?.difficulty || 1) ? 'bg-orange-500 shadow-[0_0_5px_#f97316]' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                         </div>
                         {(gameState.currentIncident.step === 'CALL' || gameState.currentIncident.step === 'DISPATCH') && (
                           <div className={`px-4 py-2 rounded-full border font-black font-mono text-xl shadow-lg transition-all ${gameState.quizTimeLeft <= 5 ? 'bg-red-950/40 border-red-500 text-red-500' : 'bg-sky-950/20 border-sky-500/20 text-sky-400'}`}>
                              {Math.floor(gameState.quizTimeLeft)}S
                           </div>
                         )}
                      </div>
                      <div className="bg-[#050a16] rounded-2xl border border-sky-500/10 p-5 sm:p-8 mb-8 italic text-slate-300 text-sm sm:text-xl leading-relaxed shadow-inner">
                        <span className="text-sky-500 font-black mr-2">AUDIO_STREAM:</span>
                        "{gameState.currentIncident.description}"
                      </div>

                      {gameState.currentIncident.step === 'CALL' && (
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> {t('phase01')}</h4>
                           <p className="text-lg sm:text-2xl font-bold text-white leading-tight">{gameState.currentIncident.quiz.question}</p>
                           <div className="grid gap-3">
                              {gameState.currentIncident.quiz.options.map(opt => (
                                <button key={opt.id} onClick={() => handleInstruction(opt)} onMouseEnter={() => playSound('hover')} className="w-full text-left p-4 sm:p-6 rounded-2xl bg-[#080d1a] border-2 border-slate-800 hover:border-sky-500/40 hover:bg-[#0b1221] transition-all text-sm sm:text-lg font-bold leading-snug group">
                                  <span className="text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity mr-2">>></span>
                                  {opt.text}
                                </button>
                              ))}
                           </div>
                        </div>
                      )}

                      {gameState.currentIncident.step === 'DISPATCH' && (
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2"><Wifi size={14} /> {t('phase02')}</h4>
                           <p className="text-lg sm:text-2xl font-bold text-white leading-tight">{gameState.currentIncident.dispatchQuiz.question}</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {gameState.currentIncident.dispatchQuiz.options.map(opt => {
                                const isBusy = gameState.cooldowns.some(c => c.type === opt.unitType);
                                return (
                                  <button key={opt.id} onClick={() => handleDispatch(opt)} onMouseEnter={() => !isBusy && playSound('hover')} disabled={isBusy} className={`p-4 sm:p-8 rounded-2xl bg-[#080d1a] border-2 flex items-center gap-4 transition-all ${isBusy ? 'opacity-30 border-transparent cursor-not-allowed' : 'border-slate-800 hover:border-orange-500/40 hover:bg-[#0b1221]'}`}>
                                    <span className="text-3xl sm:text-4xl">{UNIT_ICONS[opt.unitType as UnitType]}</span>
                                    <div className="text-left overflow-hidden">
                                      <span className="block text-sm sm:text-base font-black uppercase text-white truncate">{opt.text}</span>
                                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{UNIT_NAMES[opt.unitType as UnitType]}</span>
                                    </div>
                                  </button>
                                );
                              })}
                           </div>
                        </div>
                      )}

                      {gameState.currentIncident.step === 'FEEDBACK' && gameState.currentIncident.lastFeedback && (
                        <div className="space-y-6 animate-in zoom-in duration-300">
                           <div className="p-6 sm:p-8 rounded-[2rem] border-2 bg-red-950/20 border-red-500/40 flex flex-col gap-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                              <div className="flex items-center gap-4 text-red-500 font-black uppercase tracking-widest text-lg sm:text-2xl">
                                <AlertTriangle size={32} /> {gameState.currentIncident.lastFeedback.text}
                              </div>
                              <div className="bg-black/60 p-6 sm:p-8 rounded-3xl border border-red-500/20 text-slate-200 text-base sm:text-xl font-bold leading-relaxed relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                <div className="flex items-start gap-4">
                                  <BookOpen className="text-red-500 shrink-0 mt-1" size={24} />
                                  <div>
                                    <span className="block text-[10px] font-black text-red-400 mb-2 uppercase tracking-[0.2em]">{t('correctAction')}</span>
                                    <p className="italic text-slate-100">{gameState.currentIncident.lastFeedback.actionNeeded}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-center">
                                <Loader2 className="animate-spin text-red-500/50" size={24} />
                              </div>
                           </div>
                        </div>
                      )}

                      {gameState.currentIncident.step === 'RESOLVED' && (
                        <div className="text-center py-16 sm:py-24 space-y-8 animate-in zoom-in duration-500">
                           <h3 className="text-3xl sm:text-6xl font-black text-[#50e3c2] uppercase italic tracking-tighter glow-text">{t('callResolved')}</h3>
                           <div className="relative inline-block">
                             <ShieldCheck size={80} className="text-emerald-500" />
                             <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>
        </section>

        {/* NEWS & RESULTS VIEW */}
        {activeTab === 'news' && (
          <section className="flex-1 overflow-auto bg-[#020617] p-4 sm:p-12 pb-24 animate-in fade-in">
             <div className="max-w-4xl mx-auto space-y-12">
                <div className="relative p-1 bg-[#fdfdf7] shadow-2xl rounded-sm transform rotate-1 animate-in zoom-in duration-700">
                   <div className="bg-[#fdfdf7] text-black p-8 sm:p-16 space-y-8 font-serif border-4 border-black border-double">
                      <div className="flex justify-between items-center border-b-4 border-black pb-4">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">{t('dailyEcho')}</span>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">VOL. {gameState.totalResolved}</span>
                      </div>
                      
                      <div className="text-center space-y-4">
                         <h1 className="text-4xl sm:text-7xl font-black uppercase leading-[0.9] tracking-tighter border-y-2 border-black py-6">
                            {gameState.reputation > 50 
                              ? (gameState.language === 'ru' ? "ПОДВИГ ДИСПЕТЧЕРА: ГОРОД СПАСЕН" : "DISPATCHER HERO: CITY SAVED")
                              : (gameState.language === 'ru' ? "КРИЗИС СЛУЖБЫ 112: МЕТРОПОЛИС В ХАОСЕ" : "112 SERVICE CRISIS: METROPOLIS IN CHAOS")
                            }
                         </h1>
                         <p className="text-xl sm:text-2xl font-bold italic leading-tight">
                            {gameState.reputation > 50
                              ? (gameState.language === 'ru' ? "Благодаря мастерству оператора, Метрополис пережил одну из самых спокойных смен." : "Thanks to the skill of the operator, Metropolis survived one of its smoothest shifts.")
                              : (gameState.language === 'ru' ? "Жители требуют расследования после серии фатальных ошибок диспетчерской службы." : "Residents demand investigation after a series of fatal dispatch service errors.")
                            }
                         </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t-4 border-black pt-8">
                         <div className="space-y-6">
                            {gameState.shiftHistory.slice(0, 3).map((h, i) => {
                               // Find headlines in static scenarios
                               const scenario = (STATIC_SCENARIOS[gameState.language] || STATIC_SCENARIOS.en).find(s => s.id === h.incident.id);
                               const headline = h.wasFailed ? scenario?.headlines?.failure : scenario?.headlines?.success;
                               return (
                                 <div key={i} className="space-y-2 border-b border-black/20 pb-4 last:border-0">
                                    <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none hover:underline cursor-pointer">
                                       {headline || (h.wasFailed ? h.incident.title + ": Трагедия" : h.incident.title + ": Спасение")}
                                    </h4>
                                    <p className="text-sm font-serif leading-tight text-slate-700 line-clamp-3">
                                       {h.wasFailed ? "Трагический инцидент произошел по адресу " + h.incident.location + ". Несмотря на вызов спасателей, драгоценное время было упущено из-за неверных инструкций диспетчера." : "Слаженные действия всех подразделений позволили избежать жертв. Жильцы выражают огромную благодарность диспетчеру смены."}
                                    </p>
                                 </div>
                               )
                            })}
                         </div>
                         <div className="space-y-6">
                            <div className="bg-black/5 p-6 border-l-8 border-black space-y-4">
                               <h3 className="font-black text-xl uppercase tracking-tighter">{t('shiftSummary')}</h3>
                               <div className="space-y-3 font-mono text-sm font-bold uppercase">
                                  <div className="flex justify-between border-b border-black/10 pb-1"><span>{t('handled')}:</span> <span>{gameState.shiftHistory.length}</span></div>
                                  <div className="flex justify-between text-emerald-800 border-b border-black/10 pb-1"><span>{t('perfect')}:</span> <span>{gameState.shiftHistory.filter(h => h.wasPerfect).length}</span></div>
                                  <div className="flex justify-between text-red-800"><span>{t('failed')}:</span> <span>{gameState.shiftHistory.filter(h => h.wasFailed).length}</span></div>
                               </div>
                               <div className="pt-4 flex items-center gap-3">
                                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">112</div>
                                  <span className="text-[10px] font-bold italic leading-tight">Протокол МЧС соблюден на {Math.round((gameState.perfectResolves / Math.max(1, gameState.totalResolved)) * 100)}%</span>
                                </div>
                            </div>
                            <div className="p-4 border-2 border-black border-dashed space-y-2">
                               <p className="text-[10px] uppercase font-bold text-center">Новости дня: Метрополис вводит новые стандарты безопасности для ИИ-диспетчеров</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   {/* Newspaper texture */}
                   <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                </div>

                {/* HINTS & DEBRIEFING SECTION */}
                <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000 delay-300">
                   <div className="flex items-center gap-4 border-b border-sky-500/20 pb-4">
                      <History className="text-sky-400" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-widest italic glow-text">{t('debriefing')}</h2>
                   </div>
                   
                   <div className="space-y-6">
                      {gameState.shiftHistory.map((item, idx) => (
                        <div key={idx} className={`p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group ${item.wasFailed ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                           {/* Status Badge */}
                           <div className="absolute top-6 right-6 flex items-center gap-2">
                              {item.wasFailed ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full text-[10px] font-black uppercase text-white shadow-lg">
                                   <XCircle size={14} /> {t('failed')}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-full text-[10px] font-black uppercase text-white shadow-lg">
                                   <CheckCircle2 size={14} /> {t('perfect')}
                                </div>
                              )}
                           </div>

                           <div className="mb-8 max-w-[80%]">
                              <h4 className="font-black text-2xl text-white uppercase italic mb-2 tracking-tight leading-tight glow-text">{item.incident.title}</h4>
                              <p className="text-[10px] font-mono text-sky-500/60 uppercase tracking-widest">{item.incident.location}</p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                                 <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"><Zap size={14} /> {t('whatHappened')}</span>
                                 <p className="text-sm text-slate-300 italic leading-relaxed">"{item.incident.description}"</p>
                              </div>
                              
                              <div className={`p-6 rounded-3xl border space-y-4 ${item.wasFailed ? 'bg-sky-950/20 border-sky-500/20' : 'bg-emerald-950/10 border-emerald-500/10'}`}>
                                 <span className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]"><BookOpen size={14} /> {t('hintNote')}</span>
                                 <p className="text-sm text-slate-100 font-bold leading-relaxed">
                                    {item.incident.quiz.options.find(o => o.isCorrect)?.explanation || item.incident.emercomFact}
                                 </p>
                                 <div className="pt-4 border-t border-sky-500/10 flex flex-col gap-2">
                                    <span className="text-[8px] font-black text-sky-500/60 uppercase">{t('optimalDispatch')}</span>
                                    <div className="flex items-center gap-3">
                                       <span className="text-2xl">{UNIT_ICONS[item.incident.dispatchQuiz.options.find(o => o.isCorrect)!.unitType]}</span>
                                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.incident.dispatchQuiz.options.find(o => o.isCorrect)?.text}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex justify-center pt-8 pb-32">
                   <button onClick={resetShift} className="px-16 py-8 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(56,189,248,0.4)] transition-all active:scale-95 uppercase tracking-[0.2em] flex items-center gap-4 group text-xl">
                      <RotateCcw className="group-hover:rotate-180 transition-transform duration-700" size={28} />
                      {gameState.isGameOver ? t('newShift') : t('backToDuty')}
                      <ChevronRight size={28} />
                   </button>
                </div>
             </div>
          </section>
        )}

        {/* SHOP */}
        {activeTab === 'shop' && (
          <section className="flex-1 overflow-auto bg-[#020617] p-4 sm:p-12 pb-24 animate-in fade-in">
             <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex items-center gap-4">
                   <ShoppingCart className="text-sky-400 size-8" />
                   <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest italic glow-text">{t('shop')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                   {gameState.upgrades.map(upgrade => (
                     <div key={upgrade.id} className="bg-[#0b1221]/60 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 group hover:border-sky-500/30 hover:bg-[#0c1322] transition-all shadow-lg">
                        <div className="flex justify-between items-start">
                           <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">{upgrade.icon}</div>
                           <div className="text-right">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lvl {upgrade.level}/{upgrade.maxLevel}</span>
                              <div className="flex gap-1 mt-2">
                                 {[...Array(upgrade.maxLevel)].map((_, i) => (
                                   <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < upgrade.level ? 'bg-sky-500 shadow-[0_0_8px_#38bdf8]' : 'bg-slate-800'}`} />
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-white uppercase mb-1 tracking-tight glow-text">{upgrade.title}</h3>
                           <p className="text-[10px] text-slate-400 leading-relaxed h-10 overflow-hidden">{upgrade.description}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-800/50 flex justify-between items-center">
                           <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold"><Coins size={14} /> {upgrade.level >= upgrade.maxLevel ? '-' : upgrade.cost}</div>
                           <button onClick={() => buyUpgrade(upgrade)} onMouseEnter={() => playSound('hover')} disabled={gameState.money < upgrade.cost || upgrade.level >= upgrade.maxLevel} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${upgrade.level >= upgrade.maxLevel ? 'bg-slate-800 text-slate-600' : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xl active:scale-95 disabled:opacity-50 grayscale'}`}>
                              {upgrade.level >= upgrade.maxLevel ? t('maxLevel') : t('buy')}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <section className="flex-1 overflow-auto bg-[#020617] p-4 sm:p-12 pb-24 animate-in fade-in">
             <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex items-center gap-4">
                   <Trophy className="text-sky-400 size-8" />
                   <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest italic glow-text">{t('achievements')}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                   {gameState.achievements.map(ach => (
                     <div key={ach.id} onMouseEnter={() => ach.unlocked && playSound('hover')} className={`p-4 sm:p-6 rounded-3xl border text-center transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${ach.unlocked ? 'bg-sky-500/10 border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'bg-slate-900/40 border-slate-800 grayscale opacity-60'}`}>
                        {ach.unlocked && <div className="absolute top-2 right-2"><CheckCircle2 size={12} className="text-sky-400" /></div>}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${ach.unlocked ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                           {ach.secret && !ach.unlocked ? <Lock size={20} /> : ach.icon}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-[10px] font-black text-white uppercase leading-tight tracking-tighter truncate w-full">
                             {ach.secret && !ach.unlocked ? t('secretAchievement') : ach.title}
                          </h3>
                          <p className="text-[8px] text-slate-500 uppercase font-bold leading-tight h-4">
                            {ach.unlocked ? ach.description : (ach.secret ? '???' : ach.description)}
                          </p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <section className="flex-1 overflow-auto bg-[#020617] p-4 sm:p-12 pb-24 animate-in fade-in">
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <ListOrdered className="text-purple-500 size-8" />
                      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest italic glow-text">{t('leaderboard')}</h2>
                   </div>
                   <div className="text-[10px] font-black text-slate-500 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 uppercase italic flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500" /> LIVE_SYNC
                   </div>
                </div>
                <div className="bg-[#0b1221]/80 backdrop-blur-sm border border-sky-500/10 rounded-3xl overflow-hidden shadow-2xl">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left min-w-[500px]">
                        <thead className="bg-slate-900/50 border-b border-slate-800">
                          <tr>
                             <th className="p-6 text-[10px] font-black uppercase text-slate-500">{t('rank')}</th>
                             <th className="p-6 text-[10px] font-black uppercase text-slate-500">{t('user')}</th>
                             <th className="p-6 text-[10px] font-black uppercase text-slate-500 cursor-pointer" onClick={() => { playSound('click'); setLeaderboardSort('level'); }}>{t('level')}</th>
                             <th className="p-6 text-[10px] font-black uppercase text-slate-500 cursor-pointer" onClick={() => { playSound('click'); setLeaderboardSort('totalResolved'); }}>{t('totalChallenges')}</th>
                             <th className="p-6 text-[10px] font-black uppercase text-slate-500 cursor-pointer" onClick={() => { playSound('click'); setLeaderboardSort('perfectResolves'); }}>{t('perfectChallenges')}</th>
                          </tr>
                        </thead>
                        <tbody>
                           {getLeaderboard().length > 0 ? getLeaderboard().map((entry, idx) => (
                             <tr key={entry.id} className={`border-b border-slate-800/40 bg-sky-500/5 group hover:bg-sky-500/10 transition-colors`}>
                                <td className="p-6 font-mono font-bold text-slate-400 text-sm">#{idx + 1}</td>
                                <td className="p-6">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black bg-sky-500 text-white shadow-[0_0_10px_#38bdf8] group-hover:scale-110 transition-transform`}>{entry.username.charAt(0)}</div>
                                      <div className="flex flex-col">
                                        <span className={`font-bold text-sm text-sky-400 glow-text`}>{entry.username}</span>
                                        <span className="text-[8px] font-black text-sky-500/60 uppercase">ONLINE</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="p-6 font-mono font-bold text-sky-500 text-lg">{entry.level}</td>
                                <td className="p-6 font-mono text-slate-300">{entry.totalResolved}</td>
                                <td className="p-6 font-mono text-emerald-500">{entry.perfectResolves}</td>
                             </tr>
                           )) : (
                             <tr>
                               <td colSpan={5} className="p-20 text-center text-slate-600 font-black uppercase tracking-widest italic">Нет активных оперативников в сети</td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                   </div>
                </div>
             </div>
          </section>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <section className="flex-1 overflow-auto bg-[#020617] p-4 sm:p-12 pb-24 animate-in fade-in">
            <div className="max-w-2xl mx-auto space-y-10">
               <div className="flex items-center gap-4">
                  <Settings className="text-slate-400 size-8" />
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest italic glow-text">{t('settings')}</h2>
               </div>
               <div className="bg-[#0b1221]/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <Languages size={18} className="text-sky-400" />
                        <span className="font-bold text-white uppercase text-xs tracking-widest">{t('language')}</span>
                     </div>
                     <button onClick={() => { playSound('click'); setGameState(p => ({ ...p, language: p.language === 'ru' ? 'en' : 'ru' })); }} className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-inner">
                        {gameState.language.toUpperCase()}
                     </button>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <Volume2 size={18} className="text-sky-400" />
                        <span className="font-bold text-white uppercase text-xs tracking-widest">{t('sounds')}</span>
                     </div>
                     <button onClick={() => { setGameState(p => ({ ...p, sfxEnabled: !p.sfxEnabled })); playSound('click'); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg ${gameState.sfxEnabled ? 'bg-sky-600 text-white shadow-sky-900/40' : 'bg-slate-800 text-slate-500'}`}>
                        {gameState.sfxEnabled ? 'ON' : 'OFF'}
                     </button>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                    <button onClick={() => { playSound('click'); setShowTutorial(true); }} className="w-full bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 font-black py-4 rounded-xl border border-sky-400/20 uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                       <HelpCircle size={16} /> {t('retakeTutorial')}
                    </button>
                    <button onClick={() => { playSound('error'); if(confirm(t('resetDesc'))) { localStorage.clear(); window.location.reload(); } }} className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 font-black py-4 rounded-xl border border-red-500/20 uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                       <RotateCcw size={16} /> {t('reset')}
                    </button>
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <section className="flex-1 overflow-auto bg-[#020617] p-4 sm:p-12 pb-24 animate-in fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="bg-[#0b1221]/80 backdrop-blur-sm p-8 sm:p-12 rounded-[2.5rem] border border-sky-500/10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><User size={200} /></div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-sky-500/5 border-2 border-sky-500/20 flex items-center justify-center text-sky-400 text-5xl font-black italic shadow-xl group-hover:shadow-sky-500/20 transition-all">{gameState.user.username.charAt(0)}</div>
                  <div className="flex-1 text-center sm:text-left z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 glow-text">{gameState.user.username}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-mono font-bold text-slate-500">
                      <span className="bg-slate-900 px-3 py-1 rounded-full border border-white/5">ID: {gameState.user.id}</span>
                      <span className="bg-slate-900 px-3 py-1 rounded-full border border-white/5 uppercase">{t('onDutySince')} {new Date(gameState.user.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label={t('totalChallenges')} value={gameState.totalResolved} icon={<ShieldCheck />} />
                  <StatCard label={t('highestStreak')} value={gameState.user.stats.highestStreak} icon={<TrendingUp />} color="text-yellow-500" />
                  <StatCard label={t('moneyEarned')} value={Math.floor(gameState.user.stats.totalMoneyEarned)} icon={<Coins />} color="text-emerald-500" />
                  <StatCard label={t('accuracy')} value={`${gameState.perfectResolves}/${gameState.totalResolved}`} icon={<CheckCircle2 />} color="text-sky-400" />
               </div>
               <button onClick={logout} className="w-full p-4 rounded-2xl bg-red-950/20 text-red-500 border border-red-500/20 text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-red-950/40 transition-all shadow-lg">
                  <LogOut size={16} /> {t('logout')}
               </button>
            </div>
          </section>
        )}
      </main>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0c1322]/95 backdrop-blur-xl border-t border-sky-500/10 flex items-center justify-around z-50 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
         <NavBtn active={activeTab === 'mission'} onClick={() => changeTab('mission')} icon={<Phone size={20} />} />
         <NavBtn active={activeTab === 'shop'} onClick={() => changeTab('shop')} icon={<ShoppingCart size={20} />} />
         <NavBtn active={activeTab === 'leaderboard'} onClick={() => changeTab('leaderboard')} icon={<ListOrdered size={20} />} />
         <NavBtn active={activeTab === 'profile'} onClick={() => changeTab('profile')} icon={<User size={20} />} />
         <NavBtn active={activeTab === 'settings'} onClick={() => changeTab('settings')} icon={<Settings size={20} />} />
      </nav>
    </div>
  );
};

const StatCard = ({ label, value, icon, color = "text-sky-400" }: any) => (
  <div className="bg-[#0b1221]/60 p-6 rounded-3xl border border-slate-800 flex flex-col gap-2 shadow-inner hover:border-sky-500/20 transition-all group">
    <div className={`${color} opacity-40 mb-1 group-hover:scale-110 transition-transform`}>{React.cloneElement(icon, { size: 18 })}</div>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-xl font-black text-white italic glow-text">{value}</span>
  </div>
);

const LoginOverlay = ({ onLoginSuccess, t }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  const handleAction = () => {
    setError('');
    const dbRaw = localStorage.getItem('dispatch_accounts_db');
    let db: AccountRegistry = dbRaw ? JSON.parse(dbRaw) : {};

    if (mode === 'register') {
      if (db[username.toUpperCase()]) {
        setError(t('userExists'));
        return;
      }
      // @ts-ignore
      const newState: Omit<GameState, 'currentIncident' | 'isPaused' | 'isGameOver' | 'cooldowns' | 'quizTimeLeft' | 'shiftHistory'> = {
        user: {
          username: username.toUpperCase(),
          id: 'OP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          accessKey: 'ACCESS_LEVEL_1',
          joinedDate: Date.now(),
          stats: { totalCallsHandled: 0, totalMoneyEarned: 100, totalTimeOnDuty: 0, highestStreak: 0, averageAccuracy: 0 }
        },
        reputation: INITIAL_REPUTATION,
        panic: INITIAL_PANIC,
        proficiency: { ...INITIAL_PROFICIENCY },
        score: 0,
        xp: 0,
        level: 0,
        streak: 0,
        totalResolved: 0,
        perfectResolves: 0,
        usedIncidentIds: [],
        money: 100,
        language: 'ru',
        musicEnabled: true,
        sfxEnabled: true,
        upgrades: [...UPGRADES_LIST],
        achievements: [...ACHIEVEMENTS_LIST]
      };
      
      db[username.toUpperCase()] = { password, saveData: newState };
      localStorage.setItem('dispatch_accounts_db', JSON.stringify(db));
      localStorage.setItem('dispatch_active_user', username.toUpperCase());
      onLoginSuccess({
        ...newState,
        currentIncident: null,
        shiftHistory: [],
        isGameOver: false,
        isPaused: false,
        cooldowns: [],
        quizTimeLeft: QUIZ_TIMEOUT_SEC
      });
    } else {
      const account = db[username.toUpperCase()];
      if (!account || account.password !== password) {
        setError(t('invalidPass'));
        return;
      }
      localStorage.setItem('dispatch_active_user', username.toUpperCase());
      onLoginSuccess({
        ...account.saveData,
        currentIncident: null,
        shiftHistory: [],
        usedIncidentIds: account.saveData.usedIncidentIds || [],
        isGameOver: false,
        isPaused: false,
        cooldowns: [],
        quizTimeLeft: QUIZ_TIMEOUT_SEC,
        achievements: ACHIEVEMENTS_LIST.map(a => {
            const found = account.saveData.achievements?.find((pa: any) => pa.id === a.id);
            return found ? { ...a, unlocked: found.unlocked } : a;
        }),
        upgrades: account.saveData.upgrades?.length ? account.saveData.upgrades : UPGRADES_LIST
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020617] flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-[#0b1221] border border-sky-500/30 rounded-[3rem] p-10 text-center shadow-[0_0_50px_rgba(56,189,248,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
          
          <div className="flex gap-4 mb-10 justify-center">
             <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mode === 'login' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                <Key size={14} /> {t('loginTab')}
             </button>
             <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mode === 'register' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                <UserPlus size={14} /> {t('registerTab')}
             </button>
          </div>

          <div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center text-sky-400 mx-auto mb-8 border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
             <Database size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-8 italic leading-tight glow-text">ДИСПЕТЧЕР 112</h2>
          
          <div className="space-y-4 mb-10">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('enterUsername')} className="w-full bg-[#050a16] border-2 border-slate-800 rounded-2xl p-4 pl-12 text-sm font-black text-white focus:border-sky-500/50 transition-all tracking-[0.1em] placeholder:opacity-20 uppercase shadow-inner" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('enterPassword')} className="w-full bg-[#050a16] border-2 border-slate-800 rounded-2xl p-4 pl-12 text-sm font-black text-white focus:border-sky-500/50 transition-all tracking-[0.1em] placeholder:opacity-20 uppercase shadow-inner" />
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest animate-bounce">{error}</p>}
          </div>

          <button onClick={handleAction} disabled={!username.trim() || !password.trim()} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(56,189,248,0.3)] active:scale-95 text-lg uppercase tracking-[0.2em] disabled:opacity-50 shadow-sky-600/20 group">
             <span className="group-hover:tracking-[0.3em] transition-all flex items-center justify-center gap-3">
               <CloudCheck size={20} />
               {mode === 'login' ? t('startService') : t('register')}
             </span>
          </button>
       </div>
    </div>
  );
};

const HeaderNavBtn = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`px-5 py-2 rounded-full transition-all border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${active ? 'bg-sky-600/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
     {label}
  </button>
);

const NavBtn = ({ active, onClick, icon }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all p-3 rounded-xl ${active ? 'text-sky-400 bg-sky-400/5 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
     {icon}
  </button>
);

const StatDisplay = ({ label, value, color, isBad }: any) => (
  <div className="flex flex-col min-w-[70px]">
    <div className="flex justify-between text-[9px] font-black text-slate-500 mb-1 uppercase">
      <span>{label} {Math.floor(value)}%</span>
    </div>
    <div className="h-1 bg-slate-800 rounded-full overflow-hidden border border-white/5 w-16 shadow-inner">
      <div className={`h-full transition-all duration-700 ${color} shadow-[0_0_8px_currentColor]`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  </div>
);

export default App;