
import { Incident, UnitType, IncidentStep, IncidentQuiz, UnitProtocol } from '../types';
import { STATIC_SCENARIOS } from './scenarios';
import { QUIZ_TIMEOUT_SEC } from '../constants';

export const generateIncidentId = () => Math.random().toString(36).substr(2, 9);

const PROTOCOLS: Record<UnitType, UnitProtocol[]> = {
  [UnitType.FIRE]: [{ id: 'f1', label: "Борьба с огнем", isCorrect: true, description: "Тушение.", educationalFeedback: "МЧС: Покиньте задымленное здание ползком.", costMultiplier: 1, timeBonus: 0 }],
  [UnitType.MEDIC]: [{ id: 'm1', label: "Реанимация", isCorrect: true, description: "Помощь пострадавшим.", educationalFeedback: "МЧС: Золотой час — время, когда помощь наиболее эффективна.", costMultiplier: 1, timeBonus: 0 }],
  [UnitType.POLICE]: [{ id: 'p1', label: "Охрана порядка", isCorrect: true, description: "Оцепление.", educationalFeedback: "МЧС: Соблюдайте спокойствие.", costMultiplier: 1, timeBonus: 0 }],
  [UnitType.GAS]: [{ id: 'g1', label: "Проверка газа", isCorrect: true, description: "Устранение утечки.", educationalFeedback: "МЧС: Не включайте свет при запахе газа.", costMultiplier: 1, timeBonus: 0 }],
  [UnitType.HAZMAT]: [{ id: 'h1', label: "Защита", isCorrect: true, description: "Дезактивация.", educationalFeedback: "МЧС: Двигайтесь перпендикулярно ветру.", costMultiplier: 1, timeBonus: 0 }],
};

export const getRandomStaticIncident = (language: 'ru' | 'en', usedIds: string[], playerLevel: number): { incident: Incident, timeLeft: number } => {
  const pool = STATIC_SCENARIOS[language] || STATIC_SCENARIOS.en;
  
  // Filter by used IDs
  let available = pool.filter(s => !usedIds.includes(s.id));
  
  // If all used, reset pool logic
  if (available.length === 0) {
    available = pool;
  }

  // Refined difficulty scaling
  let targetDifficulty = 1;
  if (playerLevel < 3) targetDifficulty = 1;
  else if (playerLevel < 6) targetDifficulty = 2;
  else if (playerLevel < 10) targetDifficulty = 3;
  else if (playerLevel < 15) targetDifficulty = 4;
  else targetDifficulty = 5;
  
  // Try to find an incident near target difficulty
  let filtered = available.filter(s => s.difficulty === targetDifficulty);
  if (filtered.length === 0) filtered = available.filter(s => s.difficulty <= targetDifficulty);
  if (filtered.length === 0) filtered = available; // Fallback to any available

  const raw = filtered[Math.floor(Math.random() * filtered.length)];
  
  // Complexity scaling: less time for harder incidents
  const difficultyPenalty = (raw.difficulty - 1) * 2;
  const baseTime = QUIZ_TIMEOUT_SEC - difficultyPenalty;
  
  const incident: Incident = {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    location: raw.location,
    difficulty: raw.difficulty,
    emercomFact: raw.emercomFact,
    step: 'CALL',
    quiz: {
      ...raw.instructionQuiz,
      feedback: { success: "Инструкция принята", failure: "Ошибка в инструкции" }
    },
    quizStatus: 'pending',
    dispatchQuiz: {
      question: "Какую службу направить?",
      options: raw.dispatchOptions.map((opt: any) => ({
        ...opt,
        protocol: PROTOCOLS[opt.unitType as UnitType][0]
      }))
    }
  };

  return { incident, timeLeft: Math.max(7, baseTime) };
};
