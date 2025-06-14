import formidable from "formidable";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// Хелпер: извлекает первое значение из массива, либо само значение
function getFirst(val) {
  return Array.isArray(val) ? val[0] : val || "";
}

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: true });
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const orderId = `${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  const items = [];
  const itemIndexes = new Set();

  for (const key in fields) {
    const match = key.match(/^items\[(\d+)]/);
    if (match) itemIndexes.add(match[1]);
  }

  itemIndexes.forEach((i) => {
    const title = getFirst(fields[`items[${i}][title]`]);
    const price = getFirst(fields[`items[${i}][price]`]);
    const simpleDesign =
      getFirst(fields[`items[${i}][simpleDesign]`]) === "true";
    const photoRedraw = getFirst(fields[`items[${i}][photoRedraw]`]) === "true";
    const comment = getFirst(fields[`items[${i}][comment]`]);

    const options = [];
    for (const key in fields) {
      const optMatch = key.match(
        new RegExp(`^items\\[${i}]\\[options]\\[(.+)]$`)
      );
      if (optMatch)
        options.push({ key: optMatch[1], value: getFirst(fields[key]) });
    }

    const relatedFiles = [];
    for (const fKey in files) {
      if (fKey.startsWith(`items[${i}][files]`)) {
        const fileData = files[fKey];
        if (Array.isArray(fileData)) relatedFiles.push(...fileData);
        else relatedFiles.push(fileData);
      }
    }

    items.push({
      title,
      price,
      simpleDesign,
      photoRedraw,
      comment,
      options,
      files: relatedFiles,
    });
  });

  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("name", getFirst(fields.name));
  formData.append("phone", getFirst(fields.phone));
  formData.append("email", getFirst(fields.email));
  formData.append("delivery", getFirst(fields.delivery));
  formData.append("payment", getFirst(fields.payment));
  formData.append("address", getFirst(fields.address));
  formData.append("orderComment", getFirst(fields.orderComment));

  formData.append(
    "items",
    JSON.stringify(
      items.map((item) => {
        const safeItem = { ...item };
        delete safeItem.files; // Файлы отправим отдельно
        return safeItem;
      })
    )
  );

  // invoiceFile
  if (files.invoiceFile) {
    const inv = Array.isArray(files.invoiceFile)
      ? files.invoiceFile[0]
      : files.invoiceFile;
    formData.append("invoiceFile", fs.createReadStream(inv.filepath), {
      filename: inv.originalFilename,
    });
  }

  // файлы по товарам
  items.forEach((item, idx) => {
    item.files.forEach((file, fIdx) => {
      formData.append(
        `itemFile_${idx}_${fIdx}`,
        fs.createReadStream(file.filepath),
        {
          filename: file.originalFilename,
        }
      );
    });
  });

  try {
    const webhookUrl = "https://n8n.tagprint.ru/webhook/send-order";
    const response = await axios.post(webhookUrl, formData, {
      headers: formData.getHeaders(),
    });

    return { ok: true, orderId, response: response.data };
  } catch (e) {
    console.error("Ошибка при отправке в n8n:", e);
    return { ok: false, error: e.message };
  }
});
