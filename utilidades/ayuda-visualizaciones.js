export const calculoDias = (inicio, final) => {
  let meses = (final.getFullYear() - inicio.getFullYear()) * 12;
  meses -= inicio.getMonth();
  meses += final.getMonth();
  return meses <= 0 ? 0 : meses;
};

export const msADias = (ms) => ms / (1000 * 60 * 60 * 24);
