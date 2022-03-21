export const calculoMeses = (inicio, final) => {
  let meses = final.getMonth() - inicio.getMonth();
  meses -= inicio.getMonth();
  meses += final.getMonth();
  return meses <= 0 ? 0 : meses;
};
