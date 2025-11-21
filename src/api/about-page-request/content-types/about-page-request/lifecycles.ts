import { sendFormEmail } from '../../../../utils/email';

export default {
  async afterCreate(event: any) {
    const { result } = event;

    const html = `
      <h2>Новая заявка с страницы "О нас"</h2>
      <p><strong>Имя:</strong> ${result.name}</p>
      <p><strong>Email:</strong> ${result.email}</p>
      <p><strong>Телефон:</strong> ${result.phone}</p>
      <p><strong>Компания:</strong> ${result.company}</p>
      <p><strong>Сообщение:</strong> ${result.message}</p>
    `;

    try {
      await sendFormEmail({
        to: 'info@interimjob.ru', 
        subject: 'Новая заявка с страницы "О нас"',
        html,
      });
      strapi.log.info(`Email успешно отправлен на info@interimjob.ru`);
    } catch (err) {
      strapi.log.error('Ошибка отправки email:', err);
    }
  },
};
