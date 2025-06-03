export function useProductCalculatorBooklet(settings) {
  const getTierPrice = (tiers, value) =>
    tiers.find((t) => value <= t.to)?.price ?? tiers.at(-1)?.price ?? 0;

  return function calculatePrice(config) {
    const {
      width,
      height,
      views,
      materialKey, // для обложки
      materialBlockKey, // для блока
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

    const sheet = settings.sheet;

    const spreadWidth = height + sheet.margin * 2;
    const spreadHeight = width + sheet.margin * 2;

    const fitNormal =
      Math.floor(sheet.width / spreadWidth) *
      Math.floor(sheet.height / spreadHeight);
    const fitRotated =
      Math.floor(sheet.width / spreadHeight) *
      Math.floor(sheet.height / spreadWidth);

    const spreadsPerSheet = Math.max(fitNormal, fitRotated);
    if (!spreadsPerSheet || spreadsPerSheet === 0) return { total: 0 };

    // === 📘 Блок (внутренний) ===
    const blockSpreadsPerBooklet = Math.ceil(pages / 2); // 2 стр на разворот
    const blockTotalSpreads = adjustedTirazh * blockSpreadsPerBooklet;
    const blockSheetsNeeded = Math.ceil(blockTotalSpreads / spreadsPerSheet);

    const blockMaterial = settings.materials[materialBlockKey] ?? 0;
    const blockPrintPerSheet = getTierPrice(
      settings.print_price["4+4"],
      blockSheetsNeeded
    );

    const blockPrintTotal = blockPrintPerSheet * blockSheetsNeeded;
    const blockMaterialTotal = blockMaterial * blockSheetsNeeded;
    const blockSubtotal = blockPrintTotal + blockMaterialTotal;

    // === 📕 Обложка ===
    const coverSpreadsTotal = adjustedTirazh; // один разворот на брошюру
    const coverSheetsNeeded = Math.ceil(coverSpreadsTotal / spreadsPerSheet);

    const coverMaterial = settings.materials[materialKey] ?? 0;
    const coverLamination = useLamination
      ? settings.lamination[laminationKey] ?? 0
      : 0;
    const coverLaminationSetup = useLamination
      ? settings.lamination_setup_cost
      : 0;

    const coverPrintPerSheet = getTierPrice(
      settings.print_price[printMode],
      coverSheetsNeeded
    );

    const coverPrintTotal = coverPrintPerSheet * coverSheetsNeeded;
    const coverMaterialTotal = coverMaterial * coverSheetsNeeded;
    const coverLaminationTotal = coverLamination * coverSheetsNeeded;

    const coverSubtotal =
      coverPrintTotal + coverMaterialTotal + coverLaminationTotal;

    // === ✂ Общие доп. затраты
    const subtotal = blockSubtotal + coverSubtotal;
    const cutting = subtotal * (settings.cutting_percentage / 100);

    let extras = coverLaminationSetup;

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
      block: {
        spreadsTotal: blockTotalSpreads,
        sheetsNeeded: blockSheetsNeeded,
        printTotal: blockPrintTotal,
        materialTotal: blockMaterialTotal,
        subtotal: blockSubtotal,
      },
      cover: {
        spreadsTotal: coverSpreadsTotal,
        sheetsNeeded: coverSheetsNeeded,
        printTotal: coverPrintTotal,
        materialTotal: coverMaterialTotal,
        laminationTotal: coverLaminationTotal,
        subtotal: coverSubtotal,
      },
      cutting,
      extras,
      total,
    };
  };
}
