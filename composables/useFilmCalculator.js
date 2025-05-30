export function useFilmCalculator(settings) {
  const getTierPrice = (tiers, value) =>
    tiers.find((t) => value <= t.to)?.price ?? tiers.at(-1)?.price ?? 0;

  return function calculatePrice(config) {
    const {
      diameter,
      width,
      height,
      views,
      materialKey,
      laminationKey,
      printMode,
      useLamination,
      useFoil,
      foilColor,
      cuttingType = "standard", // стандартная (с надсечкой) по умолчанию
    } = config;

    const totalTirazh = views.reduce(
      (sum, view) => sum + (Number(view.qty) || 0),
      0
    );

    const usePlotter = true;
    const sheet = usePlotter ? settings.plotter_sheet : settings.sheet;

    const w = diameter || width;
    const h = diameter || height;

    const sizeWithMarginX = Number(w) + sheet.margin * 2;
    const sizeWithMarginY = Number(h) + sheet.margin * 2;
    const sizeWithMarginAltX = Number(h) + sheet.margin * 2;
    const sizeWithMarginAltY = Number(w) + sheet.margin * 2;

    const fitNormal =
      Math.floor(sheet.width / sizeWithMarginX) *
      Math.floor(sheet.height / sizeWithMarginY);
    const fitRotated =
      Math.floor(sheet.width / sizeWithMarginAltX) *
      Math.floor(sheet.height / sizeWithMarginAltY);

    const itemsPerSheet = Math.max(fitNormal, fitRotated);

    if (!itemsPerSheet || itemsPerSheet === 0) return { total: 0 };

    const sheetsNeeded = Math.ceil(totalTirazh / itemsPerSheet);

    const material = settings.materials[materialKey];
    const laminationPerSheet = useLamination
      ? settings.lamination[laminationKey]
      : 0;
    const foil = useFoil ? getTierPrice(settings.foil_price, sheetsNeeded) : 0;

    const unitPrice =
      getTierPrice(settings.print_price[printMode], sheetsNeeded) +
      material +
      laminationPerSheet;

    const subtotal = sheetsNeeded * unitPrice;
    const foilTotal = foil * sheetsNeeded;

    let cutting =
      getTierPrice(settings.plotter_cutting_price, sheetsNeeded) * sheetsNeeded;

    if (cuttingType === "individual") {
      cutting *= 1.5;
    }

    const extras = 0;

    return {
      usePlotter,
      itemsPerSheet,
      sheetsNeeded,
      unitPrice,
      subtotal,
      foilTotal,
      cutting,
      extras,
      total: subtotal + cutting + foilTotal + extras,
    };
  };
}
