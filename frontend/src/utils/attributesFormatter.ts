import type { AccessoriesAttributes, TeaAttributes } from "../types/attributesTypes";

const teaCategory = (data: TeaAttributes) => ({
  ekologiskt: data.organic ? 'Ja' : 'Nej',
  tetyp: data.tea_type,
  bryggtemperatur: data.brew_temp,
  bryggtid: data.brew_time,
  vikt: `${data.weight_grams} gram`,
  smakprofil: data.taste_profile,
  kategori: data.category
});

const accessoriesCategory = (data: AccessoriesAttributes) => ({
  material: data.material,
  volym: `${data.volume_ml} ml`,
  färg: data.color,
  kategori: data.category
});

export const formatAttributes = (data: AccessoriesAttributes | TeaAttributes) => {
  if (data.category === 'Tillbehör') {
    return accessoriesCategory(data);
  } else if (data.category === 'Te') {
    return teaCategory(data);
  }
}