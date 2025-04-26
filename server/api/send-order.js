import nodemailer from "nodemailer";
import formidable from "formidable";
import path from "path";

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: true });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  // Генерация номера заказа
  const orderId = `${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: "info@centralprint.ru", // замени на свой
      pass: "yerltcmuhqckagiy", // замени на свой
    },
  });

  // Подготовка данных товаров
  const items = [];
  const itemIndexes = new Set();

  for (const key in fields) {
    const match = key.match(/^items\[(\d+)]/);
    if (match) {
      itemIndexes.add(match[1]);
    }
  }

  itemIndexes.forEach((i) => {
    const title = fields[`items[${i}][title]`] || "";
    const price = fields[`items[${i}][price]`] || "";
    const simpleDesign = fields[`items[${i}][simpleDesign]`] === "true";
    const photoRedraw = fields[`items[${i}][photoRedraw]`] === "true";
    const comment = fields[`items[${i}][comment]`] || "";

    const options = [];
    for (const key in fields) {
      const optMatch = key.match(
        new RegExp(`^items\\[${i}]\\[options]\\[(.+)]$`)
      );
      if (optMatch) {
        const optName = optMatch[1];
        const optValue = fields[key];
        options.push({ key: optName, value: optValue });
      }
    }

    // Сбор файлов, относящихся к конкретной позиции
    const relatedFiles = [];
    for (const fKey in files) {
      if (fKey.startsWith(`items[${i}][files]`)) {
        const fileData = files[fKey];
        if (Array.isArray(fileData)) {
          fileData.forEach((f) => relatedFiles.push(f));
        } else {
          relatedFiles.push(fileData);
        }
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

  // Генерация HTML письма
  const itemsHtml = items
    .map(
      (item, idx) => `
      <li style="margin-bottom:20px;">
        <strong>${item.title}</strong> — ${item.price} ₽<br/>
        ${
          item.options.length
            ? `
          <div style="margin-top:5px;">
            <em>Параметры:</em>
            <ul style="margin:5px 0 5px 20px;">
              ${item.options
                .map((opt) => `<li>${opt.key}: ${opt.value}</li>`)
                .join("")}
            </ul>
          </div>`
            : ""
        }
        ${
          item.simpleDesign || item.photoRedraw
            ? `
          <div style="margin-top:5px;">
            <em>Дополнительные услуги:</em> 
            ${[
              item.simpleDesign ? "Простой дизайн" : "",
              item.photoRedraw ? "Отрисовка по фото" : "",
            ]
              .filter(Boolean)
              .join(", ")}
          </div>`
            : ""
        }
        ${
          item.comment
            ? `<div style="margin-top:5px;"><em>Комментарий к макету:</em> ${item.comment}</div>`
            : ""
        }
        ${
          item.files.length
            ? `
          <div style="margin-top:5px;">
            <em>Прикрепленные файлы:</em>
            <ul style="margin:5px 0 5px 20px;">
              ${item.files
                .map(
                  (file, i) =>
                    `<li>${path.basename(file.originalFilename)}</li>`
                )
                .join("")}
            </ul>
          </div>`
            : ""
        }
      </li>
    `
    )
    .join("");

  // Сбор всех вложений
  const attachments = [];
  let fileCounter = 1;
  items.forEach((item, idx) => {
    item.files.forEach((f) => {
      attachments.push({
        filename: `Заказ-${orderId}-Товар${idx + 1}-Файл${fileCounter++}-${
          f.originalFilename
        }`,
        path: f.filepath,
      });
    });
  });

  const message = {
    from: "Мой сайт <info@centralprint.ru>",
    to: ["destrifer@yandex.ru", fields.email],
    subject: `Новый заказ №${orderId}`,
    html: `
      <h2>Новый заказ №${orderId}</h2>
      <p><strong>Имя:</strong> ${fields.name}</p>
      <p><strong>Телефон:</strong> ${fields.phone}</p>
      <p><strong>Email:</strong> ${fields.email}</p>
      <h3>Товары:</h3>
      <ul>${itemsHtml}</ul>
    `,
    attachments,
  };

  try {
    await transporter.sendMail(message);
    return { ok: true };
  } catch (e) {
    console.error("Ошибка при отправке письма:", e);
    return { ok: false, error: e.message };
  }
});
