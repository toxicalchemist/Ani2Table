// Utility to filter categories shown in UI
const NON_RICE = new Set(['vegetables','vegetable','fruits','fruit','fruits & vegetables','fruits & veg','fruit & veg','produce','meat','dairy']);

export const isRiceCategory = (category) => {
  if (!category) return false;
  const normalized = category.toString().toLowerCase().trim();
  // If category explicitly mentions rice or grain-ish terms, keep it
  if (normalized.includes('rice') || normalized.includes('sinandomeng') || normalized.includes('jasmine') || normalized.includes('dinorado') || normalized.includes('grain') || normalized.includes('grains')) {
    return true;
  }
  // If category matches known non-rice terms, filter out
  if (NON_RICE.has(normalized)) return false;
  // Fallback: if category is a single word and not in NON_RICE, allow it
  // but be conservative: treat unknowns as rice (so we don't hide legitimate rice varieties)
  return true;
};

export const filterCategories = (categories) => {
  return categories.filter(cat => {
    const name = (cat.name || cat.label || cat.key || cat).toString();
    return isRiceCategory(name);
  });
};
