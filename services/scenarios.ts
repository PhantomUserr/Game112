
import { UnitType } from '../types';

export const STATIC_SCENARIOS = {
  ru: [
    // --- DIFFICULTY 1: BASIC ---
    { 
      id: "s1", 
      difficulty: 1, 
      title: "Запах газа в подъезде", 
      description: "Я зашла в подъезд и почувствовала резкий запах тухлых яиц. Сильно воняет на первом этаже.", 
      location: "ул. Ленина, 45", 
      emercomFact: "Газ тяжелее воздуха и скапливается внизу.", 
      headlines: {
        success: "Бдительный диспетчер спас жилой дом от взрыва газа",
        failure: "Взрыв в жилом секторе: халатность службы 112 привела к обрушению"
      },
      instructionQuiz: { 
        question: "Первое действие?", 
        options: [
          { id: "1", text: "Проверить конфорки у соседей", isCorrect: false, explanation: "НЕЛЬЗЯ: Входить в загазованные помещения смертельно опасно. ПРАВИЛЬНО: Немедленно покиньте опасную зону и оповестите окружающих." },
          { id: "2", text: "Открыть окна и выйти на улицу", isCorrect: true, explanation: "ПРАВИЛЬНО: Проветривание снижает концентрацию газа, а выход из здания спасает жизнь в случае взрыва." },
          { id: "3", text: "Включить свет для осмотра", isCorrect: false, explanation: "НЕЛЬЗЯ: Искра при включении света приведет к моментальному взрыву. ПРАВИЛЬНО: Не пользуйтесь электроприборами и открытым огнем." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Служба газа", unitType: UnitType.GAS, isCorrect: true }, { id: "d2", text: "Пожарные", unitType: UnitType.FIRE, isCorrect: false }] 
    },
    { 
      id: "s2", 
      difficulty: 1, 
      title: "ДТП: Столкновение", 
      description: "Две машины столкнулись на светофоре. Один водитель ударился головой, он в сознании, но дезориентирован.", 
      location: "пр. Мира", 
      emercomFact: "Сотрясение мозга требует покоя.", 
      headlines: {
        success: "Помощь пришла вовремя: пострадавший в ДТП спасен благодаря четким инструкциям 112",
        failure: "Инвалидность из-за ошибки: диспетчер дал неверные указания раненому водителю"
      },
      instructionQuiz: { 
        question: "Что сказать водителю?", 
        options: [
          { id: "1", text: "Выйти из машины подышать", isCorrect: false, explanation: "НЕЛЬЗЯ: При травме головы лишние движения опасны. ПРАВИЛЬНО: Обеспечьте пострадавшему покой до осмотра врачом." },
          { id: "2", text: "Оставаться в кресле неподвижно", isCorrect: true, explanation: "ПРАВИЛЬНО: Это минимизирует риск осложнений при скрытых травмах позвоночника и головы." },
          { id: "3", text: "Запить травму водой", isCorrect: false, explanation: "НЕЛЬЗЯ: При потере сознания или дезориентации вода может попасть в дыхательные пути. ПРАВИЛЬНО: Не давайте пить до приезда медиков." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Скорая помощь", unitType: UnitType.MEDIC, isCorrect: true }, { id: "d2", text: "Полиция", unitType: UnitType.POLICE, isCorrect: false }] 
    },
    { 
      id: "s3", 
      difficulty: 1, 
      title: "Дым из мусоропровода", 
      description: "В подъезде едкий запах горелого пластика, дым идет из мусороприемника на 3 этаже.", 
      location: "ул. Чехова, 10", 
      emercomFact: "Горение пластика выделяет диоксины.", 
      headlines: {
        success: "Пожар в многоэтажке локализован: жильцы спаслись благодаря диспетчеру",
        failure: "Массовое отравление дымом: паника в подъезде из-за неверных действий 112"
      },
      instructionQuiz: { 
        question: "Инструкция жильцам?", 
        options: [
          { id: "1", text: "Поливать мусоропровод водой", isCorrect: false, explanation: "НЕЛЬЗЯ: Открывая люк, вы впускаете кислород, усиливая огонь. ПРАВИЛЬНО: Изолируйте очаг дыма." },
          { id: "2", text: "Закрыть двери, уплотнить щели тканью", isCorrect: true, explanation: "ПРАВИЛЬНО: Это предотвратит попадание токсичного дыма в квартиры. Ждите спасателей дома." },
          { id: "3", text: "Пытаться выбежать через дым", isCorrect: false, explanation: "НЕЛЬЗЯ: 2-3 вдоха едкого дыма могут привести к потере сознания. ПРАВИЛЬНО: Если в подъезде дым — оставайтесь в квартире." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Пожарные", unitType: UnitType.FIRE, isCorrect: true }, { id: "d2", text: "ЖКХ", unitType: UnitType.GAS, isCorrect: false }] 
    },
    { 
      id: "s20", 
      difficulty: 2, 
      title: "Пожар на кухне", 
      description: "Вспыхнуло масло на сковородке! Огонь уже перекинулся на занавески!", 
      location: "ул. Космонавтов, 14", 
      emercomFact: "Масло нельзя тушить водой — будет взрыв пара.", 
      headlines: {
        success: "Кухня спасена: хладнокровие диспетчера предотвратило большой пожар",
        failure: "Квартира выгорела дотла: роковая ошибка при тушении масла"
      },
      instructionQuiz: { 
        question: "Чем накрыть сковороду?", 
        options: [
          { id: "1", text: "Полить водой из-под крана", isCorrect: false, explanation: "ОПАСНО: Вода мгновенно превратится в пар, разбрызгивая горящее масло на метры вокруг. ПРАВИЛЬНО: Изолируйте доступ кислорода." },
          { id: "2", text: "Металлической крышкой или противнем", isCorrect: true, explanation: "ПРАВИЛЬНО: Перекрытие доступа воздуха — самый быстрый и безопасный способ потушить горящее масло." },
          { id: "3", text: "Попробовать вынести сковороду на балкон", isCorrect: false, explanation: "НЕЛЬЗЯ: На ходу огонь раздуется воздухом, вы получите тяжелые ожоги. ПРАВИЛЬНО: Тушите на месте, накрыв крышкой." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Пожарный расчет", unitType: UnitType.FIRE, isCorrect: true }, { id: "d2", text: "Служба газа", unitType: UnitType.GAS, isCorrect: false }] 
    },
    { 
      id: "s31", 
      difficulty: 3, 
      title: "Утечка аммиака", 
      description: "На хладокомбинате разгерметизация емкости, облако газа идет на жилой массив.", 
      location: "Хладокомбинат №2", 
      emercomFact: "Аммиак легче воздуха. Идите вверх.", 
      headlines: {
        success: "Химическая атака предотвращена: оперативная эвакуация спасла тысячи жизней",
        failure: "Экологическая катастрофа: сотни пострадавших от аммиака из-за задержки 112"
      },
      instructionQuiz: { 
        question: "Куда эвакуировать людей?", 
        options: [
          { id: "1", text: "В подвалы и бомбоубежища", isCorrect: false, explanation: "ОШИБКА: Аммиак легче воздуха и стремится вверх, но в подвалах он может скапливаться при высокой влажности. ПРАВИЛЬНО: Для аммиака — верхние этажи." },
          { id: "2", text: "На верхние этажи капитальных зданий", isCorrect: true, explanation: "ПРАВИЛЬНО: Аммиак поднимается вверх, но рассеивается быстрее. Герметизация верхних этажей — лучший выбор." },
          { id: "3", text: "Бежать по ветру от облака", isCorrect: false, explanation: "НЕЛЬЗЯ: Бежать по ветру значит оставаться внутри облака. ПРАВИЛЬНО: Двигайтесь перпендикулярно направлению ветра." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Отряд РХБЗ", unitType: UnitType.HAZMAT, isCorrect: true }, { id: "d2", text: "Пожарные", unitType: UnitType.FIRE, isCorrect: false }] 
    },
    { 
      id: "s40", 
      difficulty: 4, 
      title: "Взрыв на нефтебазе", 
      description: "Горит резервуар с бензином, пламя достигает 50 метров, есть угроза взрыва соседних емкостей.", 
      location: "Нефтебаза 'Ойл'", 
      emercomFact: "Тушение нефтепродуктов требует пенной атаки.", 
      headlines: {
        success: "Адское пламя укрощено: слаженная работа 112 спасла нефтебазу",
        failure: "Огненный апокалипсис в промзоне: Метрополис содрогнулся от взрывов"
      },
      instructionQuiz: { 
        question: "Зона оцепления?", 
        options: [
          { id: "1", text: "100 метров", isCorrect: false, explanation: "НЕПРАВИЛЬНО: При взрыве нефтепродуктов радиус поражения обломками и жаром гораздо выше. ПРАВИЛЬНО: 1000 метров." },
          { id: "2", text: "1000 метров", isCorrect: true, explanation: "ПРАВИЛЬНО: Безопасная дистанция при риске детонации крупных резервуаров — 1 км." },
          { id: "3", text: "500 метров", isCorrect: false, explanation: "НЕДОСТАТОЧНО: Жар от горящего бензина может вызвать ожоги даже на таком расстоянии. ПРАВИЛЬНО: Минимум 1 км." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Пожарные гарнизоны", unitType: UnitType.FIRE, isCorrect: true }, { id: "d2", text: "РХБЗ", unitType: UnitType.HAZMAT, isCorrect: false }] 
    },

    // --- GENERATED VARIATIONS (With logic to pick generic headlines if missing) ---
    ...Array.from({ length: 47 }, (_, i) => {
      const types = [UnitType.FIRE, UnitType.MEDIC, UnitType.POLICE, UnitType.GAS, UnitType.HAZMAT];
      const type = types[i % types.length];
      const difficulty = (i % 5) + 1;
      return {
        id: `gen-${i}`,
        difficulty,
        title: `Экстренный случай №${i + 60}`,
        description: `Поступил анонимный сигнал об угрозе в секторе ${i}. Требуется немедленная проверка.`,
        location: `Сектор ${i * 7}`,
        emercomFact: "Бдительность граждан — залог безопасности города.",
        headlines: {
          success: `Угроза в секторе ${i} ликвидирована: диспетчер сработал на отлично`,
          failure: `ЧП в секторе ${i}: нерасторопность 112 привела к печальным последствиям`
        },
        instructionQuiz: {
          question: "Стандартный протокол?",
          options: [
            { id: "1", text: "Игнорировать", isCorrect: false, explanation: "ОШИБКА: Диспетчер обязан реагировать на любые угрозы. ПРАВИЛЬНО: Оцепите зону для проверки." },
            { id: "2", text: "Оцепить зону и проверить", isCorrect: true, explanation: "ПРАВИЛЬНО: Безопасность превыше всего. Лучше ложный вызов, чем пропущенная катастрофа." },
            { id: "3", text: "Выслать стажера без снаряжения", isCorrect: false, explanation: "ОПАСНО: Не подвергайте необученных людей риску. ПРАВИЛЬНО: Направляйте профильные службы." }
          ]
        },
        dispatchOptions: [
          { id: "d1", text: `Бригада ${type}`, unitType: type, isCorrect: true },
          { id: "d2", text: "Не та служба", unitType: types[(i + 1) % types.length], isCorrect: false }
        ]
      };
    })
  ],
  en: [
    { 
      id: "e1", 
      difficulty: 1, 
      title: "Gas Smell", 
      description: "Rotten eggs smell in the hallway. Very strong on the first floor.", 
      location: "45 Lenin St", 
      emercomFact: "Gas is heavier than air.", 
      headlines: {
        success: "Hero Dispatcher Saves Building from Gas Explosion",
        failure: "Residential Blast: 112 Negligence Leads to Structural Collapse"
      },
      instructionQuiz: { 
        question: "First action?", 
        options: [
          { id: "1", text: "Check stove", isCorrect: false, explanation: "DANGEROUS: Do not enter gas-filled rooms. CORRECT: Leave the building immediately." }, 
          { id: "2", text: "Open windows and exit", isCorrect: true, explanation: "CORRECT: Ventilation lowers gas concentration and leaving saves lives." }, 
          { id: "3", text: "Turn on light", isCorrect: false, explanation: "DANGEROUS: Sparks from switches cause explosions. CORRECT: Do not use electricity." }
        ] 
      }, 
      dispatchOptions: [{ id: "d1", text: "Gas Service", unitType: UnitType.GAS, isCorrect: true }, { id: "d2", text: "Fire Dept", unitType: UnitType.FIRE, isCorrect: false }] 
    }
  ]
};
