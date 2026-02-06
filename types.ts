
export enum UnitType {
  FIRE = 'FIRE',
  MEDIC = 'MEDIC',
  POLICE = 'POLICE',
  GAS = 'GAS',
  HAZMAT = 'HAZMAT'
}

export type IncidentStep = 'CALL' | 'INSTRUCTION' | 'DISPATCH' | 'FEEDBACK' | 'RESOLVED';

export interface UnitProtocol {
  id: string;
  label: string;
  isCorrect: boolean;
  description: string;
  educationalFeedback: string;
  costMultiplier: number;
  timeBonus: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface IncidentQuiz {
  question: string;
  options: QuizOption[];
  feedback: {
    success: string;
    failure: string;
  };
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: number;
  quiz: IncidentQuiz;
  dispatchQuiz: {
    question: string;
    options: {
      id: string;
      text: string;
      unitType: UnitType;
      protocol: UnitProtocol;
      isCorrect: boolean;
    }[];
  };
  emercomFact: string;
  quizStatus: 'pending' | 'solved' | 'failed';
  step: IncidentStep;
  lastFeedback?: {
    isCorrect: boolean;
    text: string;
    actionNeeded: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  secret?: boolean;
  condition: (state: GameState) => boolean;
}

export interface Upgrade {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  level: number;
  maxLevel: number;
}

export interface CareerRank {
  name: string;
  minXp: number;
  perks: string[];
  icon: string;
}

export interface UserStats {
  totalCallsHandled: number;
  totalMoneyEarned: number;
  totalTimeOnDuty: number;
  highestStreak: number;
  averageAccuracy: number;
}

export interface UserProfile {
  username: string;
  id: string;
  password?: string; // Stored for local account simulation
  accessKey: string;
  joinedDate: number;
  stats: UserStats;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  totalResolved: number;
  perfectResolves: number;
  isCurrentUser?: boolean;
  isLegendary?: boolean;
}

export interface HandledIncident {
  incident: Incident;
  wasPerfect: boolean;
  wasFailed: boolean;
  timestamp: number;
}

export interface GameState {
  user: UserProfile | null;
  reputation: number;
  panic: number;
  proficiency: Record<UnitType, number>;
  cooldowns: { type: UnitType; returnsAt: number }[];
  currentIncident: Incident | null;
  shiftHistory: HandledIncident[];
  usedIncidentIds: string[];
  score: number;
  xp: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  totalResolved: number;
  perfectResolves: number;
  streak: number; 
  money: number;
  language: 'ru' | 'en';
  musicEnabled: boolean;
  sfxEnabled: boolean;
  upgrades: Upgrade[];
  achievements: Achievement[];
  quizTimeLeft: number;
}

export interface AccountRegistry {
  [username: string]: {
    password: string;
    saveData: Omit<GameState, 'currentIncident' | 'isPaused' | 'isGameOver' | 'cooldowns' | 'quizTimeLeft' | 'shiftHistory'>;
  }
}
