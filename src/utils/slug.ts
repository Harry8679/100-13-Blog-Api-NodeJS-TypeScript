export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')                        // décompose les accents
    .replace(/[\u0300-\u036f]/g, '')         // supprime les accents
    .replace(/[^a-z0-9\s-]/g, '')           // garde lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, '-')                   // espaces → tirets
    .replace(/-+/g, '-');                   // tirets multiples → un seul
};

export const generateUniqueSlug = (
  text: string,
  existingSlugs: string[]
): string => {
  const baseSlug = generateSlug(text);

  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  // Ajoute un suffixe numérique si le slug existe déjà
  let counter = 2;
  let slug    = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

// Calcule le temps de lecture estimé
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words          = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};