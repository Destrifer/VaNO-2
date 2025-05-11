import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const { name, email, phone, message, to, captcha } = await readBody(event);

  // Проверка капчи через Turnstile
  const captchaSecret = "0x4AAAAAABclCi5KgYDmqd10_ZqGZGjnOAE"; // замени на свой приватный ключ

  const verifyRes = await $fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: captchaSecret,
        response: captcha,
        // optional: add remoteip
        // remoteip: getRequestIP(event)
      }),
    }
  );

  if (!verifyRes.success) {
    console.warn("Проверка капчи не пройдена:", verifyRes);
    return { ok: false, error: "Не пройдена проверка капчи" };
  }

  // --- Подготовка письма
  const subject =
    to === "director"
      ? "Обращение к директору с сайта"
      : "Отзыв пользователя с сайта";

  const html = `
    <h2>${subject}</h2>
    <p><strong>Имя:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone?.trim() ? `<p><strong>Телефон:</strong> ${phone}</p>` : ""}
    <p><strong>Сообщение:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: "info@centralprint.ru",
      pass: "yerltcmuhqckagiy", // Лучше вынести в process.env
    },
  });

  const mailOptions = {
    from: "info@centralprint.ru",
    to: ["info@centralprint.ru"],
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { ok: true };
  } catch (err) {
    console.error("Ошибка при отправке письма:", err);
    return { ok: false, error: err.message };
  }
});
