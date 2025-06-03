export function useProductCalculatorBooklet(settings) {
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

    const material = settings.materials[materialKey] ?? 0;
    const laminationPerSheet = useLamination
      ? settings.lamination[laminationKey] ?? 0
      : 0;
    const laminationSetup = useLamination ? settings.lamination_setup_cost : 0;

    const printPerSheet = getTierPrice(
      settings.print_price[printMode],
      sheetsNeeded
    );

    const printTotal = printPerSheet * sheetsNeeded;
    const materialTotal = material * sheetsNeeded;
    const laminationTotal = laminationPerSheet * sheetsNeeded;

    const subtotal = printTotal + materialTotal + laminationTotal;

    // ✂ Резка
    const cutting = subtotal * (settings.cutting_percentage / 100);

    // ➕ Доп. опции
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

    const total = subtotal + cutting + extras;

    return {
      itemsPerSheet,
      sheetsNeeded,
      printTotal,
      materialTotal,
      laminationTotal,
      cutting,
      extras,
      total,
    };
  };
}
