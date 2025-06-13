import FormData from "form-data";
import axios from "axios";
import formidable from "formidable";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: true });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const formData = new FormData();

  // Добавляем обычные поля
  for (const key in fields) {
    const value = fields[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  }

  // Добавляем файлы
  for (const key in files) {
    const file = files[key];
    const fileArray = Array.isArray(file) ? file : [file];
    for (const f of fileArray) {
      formData.append(key, fs.createReadStream(f.filepath), f.originalFilename);
    }
  }

  // Отправка на вебхук n8n
  try {
    const response = await axios.post(
      "https://n8n.tagprint.ru/webhook/upload-test",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return { ok: true, result: response.data };
  } catch (error) {
    console.error("Ошибка отправки в n8n:", error);
    return { ok: false, error: error.message };
  }
});
