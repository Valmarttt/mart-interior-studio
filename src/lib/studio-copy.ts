import type { Locale } from "@/lib/i18n";

export type StudioCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  demoBadge: string;
  upload: { title: string; body: string; browse: string; example: string; formats: string; replace: string; remove: string };
  settings: string;
  room: string;
  style: string;
  palette: string;
  intensity: string;
  elements: string;
  preserve: string;
  preserveLayout: string;
  preserveOpenings: string;
  preserveFurniture: string;
  prompt: string;
  promptPlaceholder: string;
  create: string;
  creating: string;
  reset: string;
  preview: string;
  previewHint: string;
  emptyPreview: string;
  emptyPreviewBody: string;
  demoReady: string;
  demoReadyBody: string;
  liveReady: string;
  liveReadyBody: string;
  before: string;
  after: string;
  liveAfter: string;
  mockNotice: string;
  mockNoticeBody: string;
  liveNotice: string;
  liveNoticeBody: string;
  download: string;
  downloadImage: string;
  suggestionsTitle: string;
  suggestionsBody: string;
  suggestionsUse: string;
  suggestions: Array<{ id: string; title: string; description: string; style: string; palette: string; intensity: string; elements: string[]; prompt: string }>;
  save: string;
  saving: string;
  saved: string;
  saveComplete: string;
  saveError: string;
  errors: { file: string; required: string };
  roomTypes: Array<{ id: string; label: string }>;
  styles: Array<{ id: string; label: string; description: string }>;
  palettes: Array<{ id: string; label: string; color: string }>;
  intensities: Array<{ id: string; label: string }>;
  elementsList: Array<{ id: string; label: string }>;
};

export const studioCopy: Record<Locale, StudioCopy> = {
  en: {
    eyebrow: "The visual studio",
    title: "Shape a room around the way you live.",
    subtitle: "Bring a photo, set a direction and explore a considered starting point for your next space.",
    demoBadge: "Demo mode",
    upload: { title: "Bring a room into focus", body: "Drop a photo here or choose one from your device.", browse: "Choose photo", example: "Use example photo", formats: "JPG, PNG or WebP · up to 10 MB", replace: "Replace photo", remove: "Remove" },
    settings: "Set the mood",
    room: "Room type",
    style: "Interior language",
    palette: "Palette",
    intensity: "Scale of change",
    elements: "What should shift?",
    preserve: "Keep in view",
    preserveLayout: "Preserve the layout",
    preserveOpenings: "Keep windows and doors",
    preserveFurniture: "Keep existing furniture",
    prompt: "A few more words",
    promptPlaceholder: "Natural oak, soft evening light, a little more breathing room…",
    create: "Create demo direction",
    creating: "Preparing demo…",
    reset: "Start over",
    preview: "Your direction",
    previewHint: "The preview will appear here",
    emptyPreview: "Your room will live here",
    emptyPreviewBody: "Upload a photo to see the starting point and create a clearly labelled demo direction.",
    demoReady: "A demo direction is ready",
    demoReadyBody: "This is a prepared edit for the built-in example. It is not a live AI edit of an arbitrary upload.",
    liveReady: "Your direction is ready",
    liveReadyBody: "This image was edited by the configured AI provider from your uploaded room photo.",
    before: "Before",
    after: "Demo after",
    liveAfter: "After",
    mockNotice: "You are exploring Demo mode",
    mockNoticeBody: "For the built-in example, Demo after is a prepared edit of the sample room. Other uploads stay clearly labelled as mock until the real provider is enabled.",
    liveNotice: "Live AI result",
    liveNoticeBody: "This is a real generated image returned by the configured provider. Review it as a design direction before saving.",
    download: "Download demo",
    downloadImage: "Download image",
    suggestionsTitle: "Start with a direction",
    suggestionsBody: "Based on a room before renovation, choose a starting point and adjust it below.",
    suggestionsUse: "Use this direction",
    suggestions: [
      { id: "japandi-warm", title: "Warm Japandi", description: "Natural oak, linen textures and quiet, balanced lighting.", style: "japandi", palette: "warm_neutral", intensity: "moderate", elements: ["furniture", "lighting", "decor"], prompt: "Keep the room calm and functional with natural oak, warm linen, soft texture and restrained decor." },
      { id: "scandi-light", title: "Light Scandinavian", description: "Airy surfaces, pale wood and a brighter everyday feeling.", style: "scandinavian", palette: "light", intensity: "minimal", elements: ["furniture", "lighting", "decor"], prompt: "Make the room feel brighter and more open with pale wood, soft neutral upholstery and practical Scandinavian details." },
      { id: "modern-warm", title: "Modern warm", description: "Clean lines, warmer contrast and a more architectural focus.", style: "modern", palette: "neutral", intensity: "full", elements: ["furniture", "walls", "lighting"], prompt: "Create a warm modern room with clean lines, considered contrast, layered lighting and a refined architectural feel." },
    ],
    save: "Save project",
    saving: "Saving…",
    saved: "Saved",
    saveComplete: "Project and original photo saved.",
    saveError: "The project could not be saved.",
    errors: { file: "Please choose a JPG, PNG or WebP image up to 10 MB.", required: "Add a room photo before creating a direction." },
    roomTypes: [{ id: "living_room", label: "Living room" }, { id: "bedroom", label: "Bedroom" }, { id: "kitchen", label: "Kitchen" }, { id: "bathroom", label: "Bathroom" }, { id: "home_office", label: "Home office" }, { id: "other", label: "Other" }],
    styles: [{ id: "japandi", label: "Japandi", description: "Soft restraint" }, { id: "scandinavian", label: "Scandinavian", description: "Light and lived-in" }, { id: "industrial", label: "Industrial Loft", description: "Honest materials" }, { id: "modern", label: "Modern", description: "Warm clarity" }, { id: "classic", label: "Classic", description: "Timeless proportion" }, { id: "minimalist", label: "Minimalist", description: "Room to breathe" }],
    palettes: [{ id: "light", label: "Light", color: "#E9E3D9" }, { id: "warm_neutral", label: "Warm neutral", color: "#C7AE94" }, { id: "dark", label: "Dark", color: "#4D4A46" }, { id: "neutral", label: "Neutral", color: "#B7B3AB" }],
    intensities: [{ id: "minimal", label: "Minimal" }, { id: "moderate", label: "Moderate" }, { id: "full", label: "Full" }],
    elementsList: [{ id: "furniture", label: "Furniture" }, { id: "walls", label: "Walls" }, { id: "floor", label: "Floor" }, { id: "lighting", label: "Lighting" }, { id: "decor", label: "Decor" }],
  },
  ru: {
    eyebrow: "Визуальная студия",
    title: "Создайте комнату под свой образ жизни.",
    subtitle: "Добавьте фотографию, задайте направление и исследуйте продуманный вариант следующего пространства.",
    demoBadge: "Демо-режим",
    upload: { title: "Добавьте комнату", body: "Перетащите фотографию сюда или выберите её на устройстве.", browse: "Выбрать фото", example: "Взять пример фото", formats: "JPG, PNG или WebP · до 10 МБ", replace: "Заменить фото", remove: "Удалить" },
    settings: "Настройте настроение",
    room: "Тип комнаты",
    style: "Язык интерьера",
    palette: "Палитра",
    intensity: "Масштаб изменений",
    elements: "Что изменить?",
    preserve: "Оставить в фокусе",
    preserveLayout: "Сохранить планировку",
    preserveOpenings: "Сохранить окна и двери",
    preserveFurniture: "Сохранить мебель",
    prompt: "Ещё несколько слов",
    promptPlaceholder: "Натуральный дуб, мягкий вечерний свет, немного больше воздуха…",
    create: "Создать демо-вариант",
    creating: "Готовим демо…",
    reset: "Начать заново",
    preview: "Ваше направление",
    previewHint: "Здесь появится предпросмотр",
    emptyPreview: "Здесь будет ваша комната",
    emptyPreviewBody: "Загрузите фотографию, чтобы увидеть исходное пространство и создать честно обозначенный демо-вариант.",
    demoReady: "Демо-вариант готов",
    demoReadyBody: "Это подготовленное редактирование встроенного примера. Для произвольной загруженной фотографии это ещё не live AI-редактор.",
    liveReady: "Ваш вариант готов",
    liveReadyBody: "Это изображение отредактировано подключённым AI-провайдером на основе загруженной фотографии комнаты.",
    before: "До",
    after: "Демо после",
    liveAfter: "После",
    mockNotice: "Вы исследуете демо-режим",
    mockNoticeBody: "Для встроенного примера справа показана подготовленная версия этой же комнаты. Для других загрузок пока остаётся честно обозначенный mock до подключения реального провайдера.",
    liveNotice: "Результат live AI",
    liveNoticeBody: "Это настоящее сгенерированное изображение от подключённого провайдера. Проверьте его как дизайн-направление перед сохранением.",
    download: "Скачать демо",
    downloadImage: "Скачать изображение",
    suggestionsTitle: "Выберите направление",
    suggestionsBody: "Для комнаты до ремонта выберите исходную идею, затем при необходимости уточните её ниже.",
    suggestionsUse: "Выбрать направление",
    suggestions: [
      { id: "japandi-warm", title: "Тёплый Japandi", description: "Натуральный дуб, лён, мягкие фактуры и спокойный свет.", style: "japandi", palette: "warm_neutral", intensity: "moderate", elements: ["furniture", "lighting", "decor"], prompt: "Сохранить спокойствие и функциональность комнаты: натуральный дуб, тёплый лён, мягкие фактуры и сдержанный декор." },
      { id: "scandi-light", title: "Светлый Scandinavian", description: "Воздух, светлое дерево и лёгкое ощущение повседневного уюта.", style: "scandinavian", palette: "light", intensity: "minimal", elements: ["furniture", "lighting", "decor"], prompt: "Сделать комнату светлее и просторнее: светлое дерево, нейтральная обивка и практичные скандинавские детали." },
      { id: "modern-warm", title: "Тёплый Modern", description: "Чистые линии, выразительный контраст и архитектурный акцент.", style: "modern", palette: "neutral", intensity: "full", elements: ["furniture", "walls", "lighting"], prompt: "Создать тёплый современный интерьер с чистыми линиями, умеренным контрастом, многоуровневым светом и архитектурной выразительностью." },
    ],
    save: "Сохранить проект",
    saving: "Сохранение…",
    saved: "Сохранено",
    saveComplete: "Проект и исходное фото сохранены.",
    saveError: "Проект не удалось сохранить.",
    errors: { file: "Выберите изображение JPG, PNG или WebP размером до 10 МБ.", required: "Добавьте фотографию комнаты перед созданием варианта." },
    roomTypes: [{ id: "living_room", label: "Гостиная" }, { id: "bedroom", label: "Спальня" }, { id: "kitchen", label: "Кухня" }, { id: "bathroom", label: "Ванная" }, { id: "home_office", label: "Кабинет" }, { id: "other", label: "Другое" }],
    styles: [{ id: "japandi", label: "Japandi", description: "Мягкая сдержанность" }, { id: "scandinavian", label: "Scandinavian", description: "Светло и удобно" }, { id: "industrial", label: "Industrial Loft", description: "Честные материалы" }, { id: "modern", label: "Modern", description: "Тёплая ясность" }, { id: "classic", label: "Classic", description: "Вневременные пропорции" }, { id: "minimalist", label: "Minimalist", description: "Больше воздуха" }],
    palettes: [{ id: "light", label: "Светлая", color: "#E9E3D9" }, { id: "warm_neutral", label: "Тёплая", color: "#C7AE94" }, { id: "dark", label: "Тёмная", color: "#4D4A46" }, { id: "neutral", label: "Нейтральная", color: "#B7B3AB" }],
    intensities: [{ id: "minimal", label: "Минимальные" }, { id: "moderate", label: "Умеренные" }, { id: "full", label: "Полные" }],
    elementsList: [{ id: "furniture", label: "Мебель" }, { id: "walls", label: "Стены" }, { id: "floor", label: "Пол" }, { id: "lighting", label: "Свет" }, { id: "decor", label: "Декор" }],
  },
};
