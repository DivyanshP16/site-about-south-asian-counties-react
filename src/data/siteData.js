export const STORAGE_KEYS = {
  activeUser: 'southAsiaActiveUser',
  registeredUser: 'southAsiaRegisteredUser',
  rememberedLogin: 'southAsiaRememberedLogin',
  feedbackEntries: 'southAsiaFeedbackEntries',
  quizResult: 'southAsiaQuizResult',
  favorites: 'southAsiaFavorites'
};

export class StorageService {
  static read(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  static write(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    window.localStorage.removeItem(key);
  }
}

export class CookieService {
  static read(key, fallback) {
    try {
      const cookie = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${encodeURIComponent(key)}=`));

      if (!cookie) {
        return fallback;
      }

      const value = cookie.slice(cookie.indexOf('=') + 1);
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return fallback;
    }
  }

  static write(key, value, days = 30) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      JSON.stringify(value)
    )}; expires=${expires}; path=/; SameSite=Lax`;
  }

  static remove(key) {
    document.cookie = `${encodeURIComponent(
      key
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  }
}

export class LoginInfo {
  constructor({ username = '', password = '', email = '', gender = '', dob = '' } = {}) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.gender = gender;
    this.dob = dob;
  }

  static from(value) {
    return new LoginInfo(value || {});
  }

  toJSON() {
    return {
      username: this.username,
      password: this.password,
      email: this.email,
      gender: this.gender,
      dob: this.dob
    };
  }
}

export class Country {
  constructor(config) {
    Object.assign(this, config);
  }

  get route() {
    return `/countries/${this.slug}`;
  }

  get touristRoute() {
    return `/countries/${this.slug}/tourist-spots`;
  }

  get visitKey() {
    return `southAsiaVisits_${this.slug}`;
  }

  get lastVisitKey() {
    return `southAsiaLastVisit_${this.slug}`;
  }
}

export class QuizEngine {
  constructor(questions) {
    this.questions = questions;
  }

  static shuffle(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
  }

  createQuestionSet() {
    return QuizEngine.shuffle(this.questions).map((question) => ({
      ...question,
      choices: QuizEngine.shuffle(question.choices)
    }));
  }

  grade(questionSet, answers) {
    const review = questionSet.map((question) => {
      const userAnswer = answers[question.id] || null;
      const isCorrect = userAnswer === question.correct;

      return {
        ...question,
        userAnswer,
        isCorrect
      };
    });

    const score = review.filter((item) => item.isCorrect).length;
    const total = review.length;

    return {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      review,
      submittedAt: new Date().toISOString()
    };
  }
}

const rawCountries = [
  {
    slug: 'india',
    name: 'India',
    capital: 'New Delhi',
    leader: 'Narendra Modi',
    flag: '/assets/images/india-flag.png',
    map: '/assets/images/india-map.jpg',
    heroVideo: 'https://www.youtube.com/embed/35npVaFGHMY',
    anthem: '/assets/audio/india-anthem.mp3',
    shortDescription:
      'India is a country located in South Asia and is known for its rich cultural heritage, historical monuments, and diverse geography.',
    infoCards: [
      {
        title: 'Geography',
        text: 'India has diverse landscapes including the Himalayan mountains, plains, deserts, and coastal regions.'
      },
      {
        title: 'Culture',
        text: 'India is famous for its traditions, festivals, classical dances, music, and ancient civilizations.'
      },
      {
        title: 'Languages',
        text: 'India has multiple languages. Hindi and English are widely used for official purposes.'
      },
      {
        title: 'Economy',
        text: 'India has a mixed economy with agriculture, industry, and a rapidly growing technology sector.'
      }
    ],
    touristSpots: [
      { name: 'Taj Mahal, Agra', image: '/assets/images/india/tajmahal.png' },
      { name: 'Jaipur City', image: '/assets/images/india/jaipur.png' },
      { name: 'Varanasi', image: '/assets/images/india/varanasi.png' },
      { name: 'Goa Beaches', image: '/assets/images/india/goa.png' },
      { name: 'Kerala Backwaters', image: '/assets/images/india/kerala.png' },
      { name: 'Red Fort, Delhi', image: '/assets/images/india/redfort.png' }
    ]
  },
  {
    slug: 'nepal',
    name: 'Nepal',
    capital: 'Kathmandu',
    leader: 'Ram Chandra Poudel',
    flag: '/assets/images/nepal-flag.png',
    map: '/assets/images/nepal-map.png',
    heroVideo: 'https://www.youtube.com/embed/j61j9X4xCnA',
    anthem: '/assets/audio/nepal-anthem.mp3',
    shortDescription: 'Nepal is a landlocked country famous for the Himalayas and Mount Everest.',
    infoCards: [
      { title: 'Geography', text: 'Nepal has mountains, hills, valleys, and rivers.' },
      { title: 'Culture', text: 'Nepalese culture includes temples, festivals, and traditional arts.' },
      { title: 'Language', text: 'Nepali is the official language of Nepal.' },
      { title: 'Economy', text: 'Tourism and agriculture are important to Nepal’s economy.' }
    ],
    touristSpots: [
      { name: 'Mount Everest', image: '/assets/images/nepal/everest.png' },
      { name: 'Pokhara', image: '/assets/images/nepal/pokhara.png' },
      { name: 'Lumbini', image: '/assets/images/nepal/lumbini.png' },
      { name: 'Kathmandu Valley', image: '/assets/images/nepal/kathmandu.png' }
    ]
  },
  {
    slug: 'bhutan',
    name: 'Bhutan',
    capital: 'Thimphu',
    leader: 'Jigme Khesar Namgyel Wangchuck',
    flag: '/assets/images/bhutan-flag.png',
    map: '/assets/images/bhutan-map.png',
    heroVideo: 'https://www.youtube.com/embed/LgTZYwV14aE',
    anthem: '/assets/audio/bhutan-anthem.mp3',
    shortDescription: 'Bhutan is a peaceful Himalayan country known for happiness and natural beauty.',
    infoCards: [
      { title: 'Geography', text: 'Bhutan has mountains, forests, and rivers.' },
      { title: 'Culture', text: 'Bhutan follows traditions, monasteries, and cultural festivals.' },
      { title: 'Language', text: 'Dzongkha is the official language of Bhutan.' },
      { title: 'Economy', text: 'Economy depends on agriculture, hydropower, and tourism.' }
    ],
    touristSpots: [
      { name: 'Paro Taktsang', image: '/assets/images/bhutan/paro.png' },
      { name: 'Thimphu', image: '/assets/images/bhutan/thimphu.png' },
      { name: 'Punakha Dzong', image: '/assets/images/bhutan/punakha.png' }
    ]
  },
  {
    slug: 'bangladesh',
    name: 'Bangladesh',
    capital: 'Dhaka',
    leader: 'Sheikh Hasina',
    flag: '/assets/images/bangladesh-flag.png',
    map: '/assets/images/bangladesh-map.png',
    heroVideo: 'https://www.youtube.com/embed/CMCY2zWgYS0',
    anthem: '/assets/audio/bangladesh-anthem.mp3',
    shortDescription: 'Bangladesh is a river-rich country known for its culture and historical heritage.',
    infoCards: [
      { title: 'Geography', text: 'Bangladesh has rivers, fertile plains, and coastal areas.' },
      { title: 'Culture', text: 'The country has vibrant music, art, and festivals.' },
      { title: 'Language', text: 'Bengali is the official language of Bangladesh.' },
      { title: 'Economy', text: 'Economy includes agriculture, garments, and exports.' }
    ],
    touristSpots: [
      { name: 'Cox’s Bazar', image: '/assets/images/bangladesh/cox.png' },
      { name: 'Sundarbans', image: '/assets/images/bangladesh/sundarbans.png' },
      { name: 'Dhaka City', image: '/assets/images/bangladesh/dhaka.png' }
    ]
  },
  {
    slug: 'srilanka',
    name: 'Sri Lanka',
    capital: 'Sri Jayawardenepura Kotte',
    leader: 'Anura Kumara Dissanayake',
    flag: '/assets/images/srilanka-flag.png',
    map: '/assets/images/srilanka-map.png',
    heroVideo: 'https://www.youtube.com/embed/KCn5Gc38oO4',
    anthem: '/assets/audio/srilanka-anthem.mp3',
    shortDescription: 'Sri Lanka is an island nation known for beaches, temples, and natural beauty.',
    infoCards: [
      { title: 'Geography', text: 'Sri Lanka has coastal plains, hills, and forests.' },
      { title: 'Culture', text: 'Sri Lanka has rich traditions, dances, and festivals.' },
      { title: 'Languages', text: 'Sinhala and Tamil are main languages used.' },
      { title: 'Economy', text: 'Tea, tourism, and trade support the economy.' }
    ],
    touristSpots: [
      { name: 'Sigiriya Rock', image: '/assets/images/srilanka/sigiriya.png' },
      { name: 'Kandy', image: '/assets/images/srilanka/kandy.png' },
      { name: 'Galle Fort', image: '/assets/images/srilanka/galle.png' }
    ]
  }
];

export const countries = rawCountries.map((country) => new Country(country));
export const countriesBySlug = Object.fromEntries(countries.map((country) => [country.slug, country]));
export const countryNames = countries.map((country) => country.name);

export const quizQuestions = [
  { id: 'q1', q: 'What is the capital of India?', choices: ['Mumbai', 'New Delhi', 'Chennai'], correct: 'New Delhi' },
  { id: 'q2', q: "Which country is known as the 'Land of the Thunder Dragon'?", choices: ['Nepal', 'Bhutan', 'Sri Lanka'], correct: 'Bhutan' },
  { id: 'q3', q: 'Which South Asian country is an island nation?', choices: ['Bangladesh', 'Sri Lanka', 'Nepal'], correct: 'Sri Lanka' },
  { id: 'q4', q: 'Which country has Mount Everest?', choices: ['India', 'Nepal', 'Bhutan'], correct: 'Nepal' },
  { id: 'q5', q: 'What is the capital of Bangladesh?', choices: ['Dhaka', 'Karachi', 'Colombo'], correct: 'Dhaka' },
  { id: 'q6', q: 'What is the currency of Nepal?', choices: ['Rupee', 'Nepalese Rupee', 'Taka'], correct: 'Nepalese Rupee' },
  { id: 'q7', q: 'What is the official language of Sri Lanka?', choices: ['Hindi', 'Sinhala', 'Bengali'], correct: 'Sinhala' },
  { id: 'q8', q: 'Which is the largest country by area in South Asia?', choices: ['Pakistan', 'India', 'Bangladesh'], correct: 'India' },
  { id: 'q9', q: 'Which country’s flag features a dragon?', choices: ['Bhutan', 'Nepal', 'Sri Lanka'], correct: 'Bhutan' },
  { id: 'q10', q: 'Which river is considered holy in India?', choices: ['Yamuna', 'Ganges', 'Indus'], correct: 'Ganges' },
  { id: 'q11', q: 'What is the capital of the Maldives?', choices: ['Colombo', 'Malé', 'Thimphu'], correct: 'Malé' },
  { id: 'q12', q: 'What is the name of Bhutan’s currency?', choices: ['Rupee', 'Ngultrum', 'Taka'], correct: 'Ngultrum' },
  { id: 'q13', q: 'Which South Asian country is completely landlocked?', choices: ['Sri Lanka', 'Nepal', 'Bangladesh'], correct: 'Nepal' },
  { id: 'q14', q: "Which country is called the 'Pearl of the Indian Ocean'?", choices: ['Sri Lanka', 'Maldives', 'India'], correct: 'Sri Lanka' },
  { id: 'q15', q: 'Which country shares the longest border with India?', choices: ['Pakistan', 'Bangladesh', 'China'], correct: 'Bangladesh' },
  { id: 'q16', q: 'Which South Asian nation has a monarch (king)?', choices: ['India', 'Bhutan', 'Bangladesh'], correct: 'Bhutan' },
  { id: 'q17', q: 'Which country first introduced the rupee currency?', choices: ['India', 'Pakistan', 'Sri Lanka'], correct: 'India' }
];
