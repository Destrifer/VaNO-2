// composables/useProductCalculator.js
export function useProductCalculator(settings) {
  const getTierPrice = (tiers, value) =>
    tiers.find((t) => value <= t.to)?.price ?? tiers.at(-1)?.price ?? 0;

  return function calculatePrice(config) {
    const {
      width,
      height,
      views,
      materialKey,
      laminationKey,
      printMode,
      useLamination,
      useFoil,
      foilColor,
      useBending,
      bendingFolds,
      useRoundCorners,
      cornerCount,
      drillType,
      holeCount,
      enabledOptions = {},
    } = config;

    const totalTirazh = views.reduce(
      (sum, view) => sum + (Number(view.qty) || 0),
      0
    );

    const sheet = settings.sheet;
    const sizeWithMarginX = Number(width) + sheet.margin * 2;
    const sizeWithMarginY = Number(height) + sheet.margin * 2;
    const sizeWithMarginAltX = Number(height) + sheet.margin * 2;
    const sizeWithMarginAltY = Number(width) + sheet.margin * 2;

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
    const laminationSetup = useLamination ? settings.lamination_setup_cost : 0;
    const foil = useFoil ? getTierPrice(settings.foil_price, sheetsNeeded) : 0;

    const unitPrice =
      getTierPrice(settings.print_price[printMode], sheetsNeeded) +
      material +
      laminationPerSheet;

    const subtotal = sheetsNeeded * unitPrice;
    const foilTotal = foil * sheetsNeeded;
    const cutting =
      (subtotal + foilTotal + laminationSetup) *
      (settings.cutting_percentage / 100);

    let extras = laminationSetup;

    if (
      useBending &&
      enabledOptions.bending &&
      settings.options.bending?.enabled
    ) {
      const { base, per_fold } = settings.options.bending;
      extras += base + per_fold * totalTirazh * Math.min(bendingFolds, 2);
    }

    if (
      useRoundCorners &&
      enabledOptions.round_corners &&
      settings.options.round_corners?.enabled
    ) {
      const { base, per_corner } = settings.options.round_corners;
      extras += base + per_corner * totalTirazh * Math.min(cornerCount, 4);
    }

    if (
      drillType === "pikallo" &&
      enabledOptions.pikallo &&
      settings.options.pikallo?.enabled
    ) {
      const { base, per_item } = settings.options.pikallo;
      extras += base + per_item * totalTirazh;
    }

    if (
      drillType === "drilling" &&
      enabledOptions.drilling &&
      settings.options.drilling?.enabled
    ) {
      const { base, per_hole } = settings.options.drilling;
      extras += base + per_hole * totalTirazh * Math.min(holeCount, 4);
    }

    return {
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
