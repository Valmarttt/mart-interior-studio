export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];

export type Dictionary = {
  header: {
    studio: string;
    projects: string;
    pricing: string;
    signIn: string;
    cta: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    note: string;
    trusted: string;
  };
  studioPreview: {
    label: string;
    title: string;
    room: string;
    style: string;
    palette: string;
    before: string;
    after: string;
  };
  how: {
    eyebrow: string;
    title: string;
    body: string;
    steps: Array<{ number: string; title: string; body: string }>;
  };
  styles: {
    eyebrow: string;
    title: string;
    body: string;
    explore: string;
    items: Array<{ name: string; description: string; tone: string }>;
  };
  bottom: { title: string; body: string; cta: string };
  footer: { tagline: string; product: string; company: string; legal: string; rights: string };
};

export const dictionaries = {
  en: {
    header: { studio: "Studio", projects: "Projects", pricing: "Pricing", signIn: "Sign in", cta: "Create design", language: "Language" },
    hero: {
      eyebrow: "Your room, reimagined",
      title: "Make space for a better way of living.",
      body: "Upload a photo of your room and explore considered interiors shaped around how you live, not just how they look.",
      primary: "Start designing",
      secondary: "See how it works",
      note: "No design experience needed",
      trusted: "A thoughtful starting point for your next space",
    },
    studioPreview: { label: "Studio preview", title: "A warmer, quieter living room", room: "Living room", style: "Japandi", palette: "Warm neutral", before: "Before", after: "After" },
    how: {
      eyebrow: "A simple ritual",
      title: "From first idea to a room that feels like you.",
      body: "A focused workflow keeps the creative part open and the decisions easy.",
      steps: [
        { number: "01", title: "Bring your room", body: "Start with a photo of the space you already have." },
        { number: "02", title: "Set the mood", body: "Choose a style, palette and the details worth changing." },
        { number: "03", title: "Explore what fits", body: "Compare directions, save the ones that feel right and keep going." },
      ],
    },
    styles: {
      eyebrow: "Find your language",
      title: "Six ways to start seeing the room differently.",
      body: "Each direction is a starting point, not a box. Your space stays the main character.",
      explore: "Explore styles",
      items: [
        { name: "Japandi", description: "Soft restraint and natural texture.", tone: "sand" },
        { name: "Scandinavian", description: "Light, lived-in and quietly practical.", tone: "mist" },
        { name: "Industrial Loft", description: "Honest materials with an urban edge.", tone: "charcoal" },
        { name: "Modern", description: "Clean lines, warm contrast and clarity.", tone: "clay" },
        { name: "Classic", description: "Proportion, craft and lasting details.", tone: "olive" },
        { name: "Minimalist", description: "Less noise, more room to breathe.", tone: "chalk" },
      ],
    },
    bottom: { title: "Your next room can start with one photograph.", body: "Make a little space for possibility.", cta: "Open the studio" },
    footer: { tagline: "Interior ideas with a human point of view.", product: "Product", company: "Company", legal: "Legal", rights: "© 2026 Atelier AI. Built for thoughtful spaces." },
  },
  ru: {
    header: { studio: "Студия", projects: "Проекты", pricing: "Тарифы", signIn: "Войти", cta: "Создать дизайн", language: "Язык" },
    hero: {
      eyebrow: "Ваша комната — заново",
      title: "Больше пространства для жизни.",
      body: "Загрузите фотографию комнаты и исследуйте интерьер, созданный вокруг вашего образа жизни, а не только красивой картинки.",
      primary: "Начать дизайн",
      secondary: "Как это работает",
      note: "Опыт в дизайне не нужен",
      trusted: "Вдумчивое начало для следующего пространства",
    },
    studioPreview: { label: "Пример студии", title: "Более тёплая и спокойная гостиная", room: "Гостиная", style: "Japandi", palette: "Тёплый нейтральный", before: "До", after: "После" },
    how: {
      eyebrow: "Простой ритуал",
      title: "От первой идеи к комнате, в которой узнаёшь себя.",
      body: "Собранный процесс оставляет простор для творчества и упрощает выбор.",
      steps: [
        { number: "01", title: "Добавьте комнату", body: "Начните с фотографии пространства, которое уже есть." },
        { number: "02", title: "Настройте настроение", body: "Выберите стиль, палитру и детали, которые хотите изменить." },
        { number: "03", title: "Найдите своё", body: "Сравнивайте варианты, сохраняйте удачные и двигайтесь дальше." },
      ],
    },
    styles: {
      eyebrow: "Найдите свой язык",
      title: "Шесть способов увидеть комнату по-новому.",
      body: "Каждый стиль — отправная точка, а не рамка. Главное место всегда остаётся за вашим пространством.",
      explore: "Исследовать стили",
      items: [
        { name: "Japandi", description: "Спокойная сдержанность и натуральные фактуры.", tone: "sand" },
        { name: "Scandinavian", description: "Светло, удобно и по-домашнему практично.", tone: "mist" },
        { name: "Industrial Loft", description: "Честные материалы с городским характером.", tone: "charcoal" },
        { name: "Modern", description: "Чёткие линии, тёплый контраст и ясность.", tone: "clay" },
        { name: "Classic", description: "Пропорции, мастерство и детали вне времени.", tone: "olive" },
        { name: "Minimalist", description: "Меньше шума, больше воздуха.", tone: "chalk" },
      ],
    },
    bottom: { title: "Следующая комната может начаться с одной фотографии.", body: "Оставьте немного места для возможностей.", cta: "Открыть студию" },
    footer: { tagline: "Идеи для интерьера с человеческим взглядом.", product: "Продукт", company: "Компания", legal: "Правовая информация", rights: "© 2026 Atelier AI. Для пространств, в которых хочется жить." },
  },
} satisfies Record<Locale, Dictionary>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
