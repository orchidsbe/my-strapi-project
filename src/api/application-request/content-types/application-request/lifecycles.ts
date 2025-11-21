import { sendFormEmail } from '../../../../utils/email';

export default {
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info('afterCreate lifecycle сработал', result);

    try {
      await sendFormEmail({
        to: 'info@interimjob.ru', 
        subject: 'Новая заявка с формы "Оставить заявку"',
        html: `
          <h2>Новая заявка</h2>
          <p><strong>Имя:</strong> ${result.name}</p>
          <p><strong>Email:</strong> ${result.email}</p>
          <p><strong>Телефон:</strong> ${result.phone}</p>
          <p><strong>Компания:</strong> ${result.company}</p>
          <p><strong>Должность:</strong> ${result.position}</p>
          <p><strong>Сообщение:</strong> ${JSON.stringify(result.message)}</p>
          <p><strong>Согласие:</strong> ${result.consent ? 'Да' : 'Нет'}</p>
        `,
      });

      strapi.log.info('Email отправлен на info@interimjob.ru');
    } catch (err) {
      strapi.log.error('Ошибка отправки email:', err);
    }
  },
};
