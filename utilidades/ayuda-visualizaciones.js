export const calculoMeses = (inicio, final) => {
  let meses = (final.getFullYear() - inicio.getFullYear()) * 12;
  meses -= inicio.getMonth();
  meses += final.getMonth();
  return meses <= 0 ? 0 : meses;
};
