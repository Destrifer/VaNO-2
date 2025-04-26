import nodemailer from "nodemailer";
import formidable from "formidable";

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
      user: "info@centralprint.ru",
      pass: "yerltcmuhqckagiy",
    },
  });

  let itemsHtml = "";
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

    // Собираем параметры (options)
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

    items.push({
      title,
      price,
      simpleDesign,
      photoRedraw,
      comment,
      options,
      index: i,
    });
  });

  itemsHtml = items
    .map(
      (item) => `
      <li style="margin-bottom:15px;">
        <strong>${item.title}</strong> — ${item.price} ₽<br/>
        ${
          item.options.length
            ? `<div style="margin-top:5px;"><em>Параметры:</em><ul style="margin:5px 0 5px 20px;">
              ${item.options
                .map((opt) => `<li>${opt.key}: ${opt.value}</li>`)
                .join("")}
              </ul></div>`
            : ""
        }
        ${
          item.simpleDesign || item.photoRedraw
            ? `<div style="margin-top:5px;"><em>Дополнительные услуги:</em> ${[
                item.simpleDesign ? "Простой дизайн" : "",
                item.photoRedraw ? "Отрисовка по фото" : "",
              ]
                .filter(Boolean)
                .join(", ")}</div>`
            : ""
        }
        ${
          item.comment
            ? `<div style="margin-top:5px;"><em>Комментарий к макету:</em> ${item.comment}</div>`
            : ""
        }
      </li>
    `
    )
    .join("");

  const attachments = [];
  let fileCounter = 1;

  for (const key in files) {
    if (key.startsWith("items[")) {
      const fileData = files[key];

      if (Array.isArray(fileData)) {
        fileData.forEach((f) => {
          attachments.push({
            filename: `Заказ-${orderId}-Файл${fileCounter++}-${
              f.originalFilename
            }`,
            path: f.filepath,
          });
        });
      } else {
        attachments.push({
          filename: `Заказ-${orderId}-Файл${fileCounter++}-${
            fileData.originalFilename
          }`,
          path: fileData.filepath,
        });
      }
    }
  }

  const message = {
    from: "Мой сайт <info@centralprint.ru>",
    to: ["info@centralprint.ru", fields.email],
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
