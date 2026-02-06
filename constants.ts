
import { UnitType, CareerRank, Achievement, Upgrade, LeaderboardEntry } from './types';

export const INITIAL_PROFICIENCY = {
  [UnitType.FIRE]: 10,
  [UnitType.MEDIC]: 10,
  [UnitType.POLICE]: 10,
  [UnitType.GAS]: 10,
  [UnitType.HAZMAT]: 10,
};

export const MAX_PANIC = 100;
export const MAX_REPUTATION = 100;
export const INITIAL_REPUTATION = 80;
export const INITIAL_PANIC = 10;
export const QUIZ_TIMEOUT_SEC = 20;
export const UNIT_COOLDOWN_MS = 12000;

export const UNIT_ICONS: Record<UnitType, string> = {
  [UnitType.FIRE]: '🔥',
  [UnitType.MEDIC]: '🚑',
  [UnitType.POLICE]: '🚓',
  [UnitType.GAS]: '🔧',
  [UnitType.HAZMAT]: '☣️',
};

export const UNIT_NAMES: Record<UnitType, string> = {
  [UnitType.FIRE]: 'Пожарная служба',
  [UnitType.MEDIC]: 'Скорая помощь',
  [UnitType.POLICE]: 'Полиция',
  [UnitType.GAS]: 'Служба газа',
  [UnitType.HAZMAT]: 'Спецотряд РХБЗ',
};

export const RANKS: CareerRank[] = [
  { name: 'Стажер', minXp: 0, perks: ['Начало'], icon: '🔰' },
  { name: 'Младший оператор', minXp: 1000, perks: ['Опыт'], icon: '📞' },
  { name: 'Оператор II класса', minXp: 3000, perks: ['Надежность'], icon: '🎖️' },
  { name: 'Старший оператор', minXp: 6000, perks: ['Мастерство'], icon: '🏅' },
  { name: 'Координатор смены', minXp: 10000, perks: ['Лидерство'], icon: '👑' },
  { name: 'Шеф диспетчеров', minXp: 20000, perks: ['Стратег'], icon: '⭐' },
  { name: 'Комиссар МЧС', minXp: 50000, perks: ['Легенда'], icon: '💠' },
];

// Completely empty mock leaderboard to allow for "actual players" only (local player in this demo)
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  // NORMAL (20)
  { id: 'n1', title: 'Первый контакт', description: 'Решите 1 инцидент', icon: '📞', unlocked: false, condition: s => s.totalResolved >= 1 },
  { id: 'n2', title: 'Боевое крещение', description: 'Решите 10 инцидентов', icon: '🔥', unlocked: false, condition: s => s.totalResolved >= 10 },
  { id: 'n3', title: 'Ветеран связи', description: 'Решите 50 инцидентов', icon: '📜', unlocked: false, condition: s => s.totalResolved >= 50 },
  { id: 'n4', title: 'Мастер МЧС', description: 'Решите 100 инцидентов', icon: '🏛️', unlocked: false, condition: s => s.totalResolved >= 100 },
  { id: 'n5', title: 'Профи-старт', description: 'Достигните 2 уровня', icon: '📈', unlocked: false, condition: s => s.level >= 2 },
  { id: 'n6', title: 'Топ-менеджер', description: 'Достигните 4 уровня', icon: '⭐', unlocked: false, condition: s => s.level >= 4 },
  { id: 'n7', title: 'Комиссар города', description: 'Достигните 6 уровня', icon: '💠', unlocked: false, condition: s => s.level >= 6 },
  { id: 'n8', title: 'Общественное доверие', description: 'Репутация 100%', icon: '❤️', unlocked: false, condition: s => s.reputation >= 100 },
  { id: 'n9', title: 'Спокойствие', description: 'Снизьте панику до 0%', icon: '🧘', unlocked: false, condition: s => s.panic <= 0 },
  { id: 'n10', title: 'Первые деньги', description: 'Заработайте 500 монет', icon: '💰', unlocked: false, condition: s => s.money >= 500 },
  { id: 'n11', title: 'Богач', description: 'Заработайте 2000 монет', icon: '💎', unlocked: false, condition: s => s.money >= 2000 },
  { id: 'n12', title: 'Профессионал огня', description: 'Мастерство пожарных 100%', icon: '🚒', unlocked: false, condition: s => s.proficiency[UnitType.FIRE] >= 100 },
  { id: 'n13', title: 'Ангел-хранитель', description: 'Мастерство медиков 100%', icon: '💉', unlocked: false, condition: s => s.proficiency[UnitType.MEDIC] >= 100 },
  { id: 'n14', title: 'Закон и порядок', description: 'Мастерство полиции 100%', icon: '👮', unlocked: false, condition: s => s.proficiency[UnitType.POLICE] >= 100 },
  { id: 'n15', title: 'Газовая безопасность', description: 'Мастерство газовиков 100%', icon: '🛠️', unlocked: false, condition: s => s.proficiency[UnitType.GAS] >= 100 },
  { id: 'n16', title: 'Хим-защита', description: 'Мастерство РХБЗ 100%', icon: '☣️', unlocked: false, condition: s => s.proficiency[UnitType.HAZMAT] >= 100 },
  { id: 'n17', title: 'Марафонец', description: 'Решите 250 инцидентов', icon: '🏃', unlocked: false, condition: s => s.totalResolved >= 250 },
  { id: 'n18', title: 'Легенда Метрополиса', description: 'Решите 500 инцидентов', icon: '🏙️', unlocked: false, condition: s => s.totalResolved >= 500 },
  { id: 'n19', title: 'Карьерист', description: 'Достигните 10 уровня', icon: '🚀', unlocked: false, condition: s => s.level >= 10 },
  { id: 'n20', title: 'Шопоголик', description: 'Купите 5 любых улучшений', icon: '🛒', unlocked: false, condition: s => s.upgrades.reduce((acc, u) => acc + u.level, 0) >= 5 },

  // SECRET (10)
  { id: 's1', title: 'На волоске', description: 'Решите вызов, когда осталось меньше 2 секунд', icon: '⌛', unlocked: false, secret: true, condition: s => s.currentIncident?.step === 'RESOLVED' && s.quizTimeLeft <= 2 },
  { id: 's2', title: 'Железные нервы', description: 'Серия из 15 идеальных вызовов', icon: '⛓️', unlocked: false, secret: true, condition: s => s.streak >= 15 },
  { id: 's3', title: 'Абсолют', description: 'Серия из 30 идеальных вызовов', icon: '🌀', unlocked: false, secret: true, condition: s => s.streak >= 30 },
  { id: 's4', title: 'Минималист', description: 'Достигните 5 уровня без улучшений', icon: '📉', unlocked: false, secret: true, condition: s => s.level >= 5 && s.upgrades.every(u => u.level === 0) },
  { id: 's5', title: 'Инвестор', description: 'Потратьте 5000 монет в магазине', icon: '🏦', unlocked: false, secret: true, condition: s => s.money <= 0 && s.level > 1 }, // Simplification for logic
  { id: 's6', title: 'Универсальный солдат', description: 'Используйте все 5 служб хотя бы раз', icon: '🧩', unlocked: false, secret: true, condition: s => Object.values(s.proficiency).every(v => v > 15) },
  { id: 's7', title: 'Тень Метрополиса', description: '50 идеальных вызовов за все время', icon: '👤', unlocked: false, secret: true, condition: s => s.perfectResolves >= 50 },
  { id: 's8', title: 'Призрак в системе', description: '100 идеальных вызовов за все время', icon: '👻', unlocked: false, secret: true, condition: s => s.perfectResolves >= 100 },
  { id: 's9', title: 'Магнат модернизаций', description: 'Максимальный уровень 3 любых улучшений', icon: '⚒️', unlocked: false, secret: true, condition: s => s.upgrades.filter(u => u.level === u.maxLevel).length >= 3 },
  { id: 's10', title: 'Бессмертный оператор', description: 'Продержитесь 1 час на смене без GameOver', icon: '🕯️', unlocked: false, secret: true, condition: s => s.totalResolved >= 300 }, // Time logic proxied by resolved count
];

export const UPGRADES_LIST: Upgrade[] = [
  { id: 'call_ai', title: 'ИИ-Ассистент', description: 'Увеличивает время на раздумья (+2с/ур)', cost: 200, icon: '🤖', level: 0, maxLevel: 10 },
  { id: 'training_center', title: 'Учебный центр', description: 'Быстрее растет мастерство служб (+20%)', cost: 400, icon: '🏫', level: 0, maxLevel: 5 },
  { id: 'fast_dispatch', title: 'Спутниковая связь', description: 'Уменьшает время занятости служб (-5%)', cost: 300, icon: '📡', level: 0, maxLevel: 10 },
  { id: 'pr_campaign', title: 'PR-Служба', description: 'Смягчает падение репутации (-10%)', cost: 400, icon: '📢', level: 0, maxLevel: 10 },
  { id: 'mobile_app', title: 'Приложение 112', description: 'Увеличивает получаемый XP (+15%)', cost: 500, icon: '📱', level: 0, maxLevel: 5 },
  { id: 'drone_scout', title: 'Разведка дронами', description: 'Снижает панику при решении инцидентов (-2%)', cost: 600, icon: '🚁', level: 0, maxLevel: 5 },
  { id: 'cyber_security', title: 'Киберщит', description: 'Защита от ложных вызовов (бонус к награде)', cost: 800, icon: '🛡️', level: 0, maxLevel: 5 },
  { id: 'hr_wellness', title: 'Забота о кадрах', description: 'Медленнее падает репутация при ошибках', cost: 700, icon: '🍵', level: 0, maxLevel: 5 },
  { id: 'advanced_ui', title: 'Нейро-интерфейс', description: 'Больше времени на диспетчеризацию (+1с)', cost: 1000, icon: '🧠', level: 0, maxLevel: 5 },
  { id: 'city_grid', title: 'Городская сеть', description: 'Увеличивает доход с каждого вызова (+10%)', cost: 1200, icon: '🌐', level: 0, maxLevel: 5 },
];
