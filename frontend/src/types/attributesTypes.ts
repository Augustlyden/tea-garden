export interface TeaAttributes {
  organic: boolean;
  tea_type: string;
  brew_temp: string;
  brew_time: string;
  weight_grams: string;
  taste_profile: string;
  category?: 'Te';
}

export interface AccessoriesAttributes {
  material: string;
  volume_ml: string;
  color: string;
  category?: 'Tillbehör';
}

export const isTea = (obj: Record<string, any>): obj is TeaAttributes => (
  obj.category === 'Te' && 
  typeof obj.organic === 'boolean' &&
  typeof obj.tea_type === 'string' &&
  typeof obj.brew_temp === 'string' &&
  typeof obj.brew_time === 'string' &&
  typeof obj.weight_grams === 'string' &&
  typeof obj.taste_profile === 'string'
);


export const isAccessory = (obj: Record<string, any>): obj is AccessoriesAttributes => (
  obj.category === 'Tillbehör' &&
  typeof obj.material === 'string' &&
  typeof obj.volume_ml === 'string' &&
  typeof obj.color === 'string'
);