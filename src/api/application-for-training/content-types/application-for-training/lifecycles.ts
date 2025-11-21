import { sendFormEmail } from '../../../../utils/email';

export default {
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info('afterCreate lifecycle сработал', result);

    try {
      await sendFormEmail({
        to: 'info@interimjob.ru',
        subject: 'Новая заявка с формы Обучение INTERIM',
        html: `
          <h2>Новая заявка на обучение</h2>
          <p><strong>Название тренинга:</strong> ${result.trainingTitle}</p>
          <p><strong>Стоимость:</strong> ${result.trainingPrice}</p>
          <p><strong>Имя:</strong> ${result.name}</p> 
          <p><strong>Email:</strong> ${result.email}</p>
          <p><strong>Телефон:</strong> ${result.phone}</p>
          <p><strong>Тариф:</strong> ${result.tariff}</p>
          <p><strong>Комментарий:</strong> ${result.comment}</p>
          <p><strong>Источник:</strong> ${result.source}</p>
        `,
      });

      strapi.log.info('Email отправлен на info@interimjob.ru');
    } catch (err) {
      strapi.log.error('Ошибка отправки email:', err);
    }
  },
};
