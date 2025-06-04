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
      bindingType,
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

    // === 📎 Скрепление ===
    const bindingTable = settings.binding_prices?.[bindingType] ?? [];
    const bindingUnitPrice = getTierPrice(bindingTable, totalTirazh);
    const bindingPrice = bindingUnitPrice * totalTirazh;

    // === ✂ Общие доп. затраты
    const subtotal = blockSubtotal + coverSubtotal + bindingPrice;
    const cutting = subtotal * (settings.cutting_percentage / 100);

    const extras = coverLaminationSetup;

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
      binding: bindingPrice,
      cutting,
      extras,
      total,
    };
  };
}
