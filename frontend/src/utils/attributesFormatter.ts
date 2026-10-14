const labels: Record<string, string> = {
  organic: 'Ekologisk',
  tea_type: 'Teatyp',
  brew_temp: 'Bryggtemperatur',
  brew_time: 'Bryggtid',
  weight_grams: 'Vikt',
  taste_profile: 'Smakprofil',
  variants: 'Varianter',
  material: 'Material',
  volume_ml: 'Volym',
  color: 'Färg'
};

const units: Record<string, string> = {
  weight_grams: 'gram',
  volume_ml: 'ml'
};

export const attributes = (data: Record<string, any> | null) => {
  const result: Record<string, string> = {};
  if (!data) return result;

  for (const [key, label] of Object.entries(labels)) {
    const value = data[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'boolean') {
      result[label] = value ? 'Ja' : 'Nej';
    } else if (Array.isArray(value)) {
      result[label] = value.join(', ');
    } else {
      result[label] = units[key] ? `${value} ${units[key]}` : String(value);
    }
  }
  return result;
};