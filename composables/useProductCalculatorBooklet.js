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
      pages = 0,
    } = config;

    const totalTirazh = views.reduce(
      (sum, view) => sum + (Number(view.qty) || 0),
      0
    );

    const adjustedTirazh =
      totalTirazh + Math.max(2, Math.ceil(totalTirazh * 0.05));

    const totalPages = adjustedTirazh * pages;

    const sheet = settings.sheet;

    // Размер брошюры в развернутом виде (ширина и высота меняются местами)
    const spreadWidth = height + sheet.margin * 2;
    const spreadHeight = width + sheet.margin * 2;

    // Сколько разворотов помещается на один печатный лист
    const fitNormal =
      Math.floor(sheet.width / spreadWidth) *
      Math.floor(sheet.height / spreadHeight);
    const fitRotated =
      Math.floor(sheet.width / spreadHeight) *
      Math.floor(sheet.height / spreadWidth);

    const spreadsPerSheet = Math.max(fitNormal, fitRotated);

    if (!spreadsPerSheet || spreadsPerSheet === 0) return { total: 0 };

    // Разворотов на всю партию
    const spreadsTotal = Math.ceil(totalPages / 2); // 1 разворот = 2 страницы
    const sheetsNeeded = Math.ceil(spreadsTotal / spreadsPerSheet);

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
    const cutting = subtotal * (settings.cutting_percentage / 100);

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
      spreadsPerSheet,
      spreadsTotal,
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
