import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: "m28173@yandex.ru", // ⚠️ замени на свой
      pass: "ptrdliawdhfbjjkc",
    },
  });

  const message = {
    from: "Мой сайт <m28173@yandex.ru>",
    to: ["destrifer@yandex.ru", body.email],
    subject: "Новый заказ с сайта",
    html: `
      <h2>Новый заказ</h2>
      <p><strong>Имя:</strong> ${body.name}</p>
      <p><strong>Телефон:</strong> ${body.phone}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <h3>Товары:</h3>
      <ul>
        ${body.items
          .map(
            (item) => `
          <li>
            <strong>${item.title}</strong> — ${item.price} ₽<br/>
            ${Object.entries(item.options)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}
          </li>
        `
          )
          .join("")}
      </ul>
    `,
  };

  try {
    await transporter.sendMail(message);
    return { ok: true };
  } catch (e) {
    console.error("Ошибка при отправке письма:", e);
    return { ok: false, error: e.message };
  }
});
