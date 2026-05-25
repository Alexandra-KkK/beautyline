const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'Guest' },
      { name: 'Master' },
      { name: 'Reception' },
      { name: 'Admin' },
    ],
  });

  await prisma.status.createMany({
    data: [
      { name: 'Подтверждена', description: 'Запись согласована с мастером' },
      { name: 'Новая',        description: 'Ожидает подтверждения' },
      { name: 'Завершена',    description: 'Услуга оказана' },
      { name: 'Отменена',     description: 'Отменена клиентом или администратором' },
    ],
  });

  await prisma.paymentMethod.createMany({
    data: [
      { name: 'Наличные',              description: 'Оплата наличными на стойке' },
      { name: 'Банковская карта',      description: 'Оплата картой через терминал' },
      { name: 'Подарочный сертификат', description: 'Оплата сертификатом салона' },
    ],
  });

  await prisma.category.createMany({
    data: [
      { name: 'Парикмахерские услуги', description: 'Стрижки, укладки, окрашивание' },
      { name: 'Ногтевой сервис',       description: 'Маникюр, укрепление, покрытие' },
      { name: 'Брови и ресницы',       description: 'Коррекция, окрашивание, ламинирование' },
      { name: 'Косметология',          description: 'Уходовые процедуры для лица' },
      { name: 'Макияж',                description: 'Дневной, вечерний и свадебный макияж' },
    ],
  });

  const adminPass  = await bcrypt.hash('Admgf53', 10);
  const recepPass  = await bcrypt.hash('Reh75', 10);
  const masterPass = await bcrypt.hash('Master123', 10);

  await prisma.user.createMany({
    data: [
      { login: 'admin',       email: 'admin@beautyline.ru',     password: adminPass,  name: 'Администратор',  roleId: 4 },
      { login: 'reception01', email: 'reception@beautyline.ru', password: recepPass,  name: 'Ресепшн',        roleId: 3 },
      { login: 'hair.master', email: 'stylist@beautyline.ru',   password: masterPass, name: 'Елена Воронова', roleId: 2 },
      { login: 'nail.master', email: 'nails@beautyline.ru',     password: masterPass, name: 'Ксения Громова', roleId: 2 },
    ],
  });

  const hairUser = await prisma.user.findUnique({ where: { login: 'hair.master' } });
  const nailUser = await prisma.user.findUnique({ where: { login: 'nail.master' } });

  await prisma.master.createMany({
    data: [
      { name: 'Елена Воронова',      specialization: 'Парикмахер-стилист',       experience: '5 лет',   userId: hairUser.id },
      { name: 'Анастасия Максимова', specialization: 'Колорист',                 experience: '7 лет' },
      { name: 'Ксения Громова',      specialization: 'Мастер ногтевого сервиса', experience: '4 года',  userId: nailUser.id },
      { name: 'Марина Жукова',       specialization: 'Визажист',                 experience: '6 лет' },
      { name: 'София Данилова',      specialization: 'Бровист, лешмейкер',       experience: '3 года' },
      { name: 'Вероника Круглецова', specialization: 'Косметолог',               experience: '10 лет' },
    ],
  });

  await prisma.service.createMany({
    data: [
      { name: 'Женская стрижка',              categoryId: 1, masterId: 1, price: 2500,  duration: 60  },
      { name: 'Окрашивание волос',            categoryId: 1, masterId: 2, price: 4500,  duration: 120 },
      { name: 'Тонирование волос',            categoryId: 1, masterId: 2, price: 3200,  duration: 90  },
      { name: 'Укладка',                      categoryId: 1, masterId: 1, price: 1800,  duration: 45  },
      { name: 'Маникюр с покрытием гель-лак', categoryId: 2, masterId: 3, price: 2600,  duration: 75  },
      { name: 'Педикюр аппаратный',           categoryId: 2, masterId: 3, price: 3000,  duration: 90  },
      { name: 'Коррекция бровей',             categoryId: 3, masterId: 5, price: 900,   duration: 30  },
      { name: 'Ламинирование ресниц',         categoryId: 3, masterId: 5, price: 2200,  duration: 60  },
      { name: 'Маникюр классический',         categoryId: 2, masterId: 3, price: 2500,  duration: 60  },
      { name: 'Макияж',                       categoryId: 5, masterId: 4, price: 3000,  duration: 60  },
      { name: 'Уходовые процедуры для лица',  categoryId: 4, masterId: 6, price: 10000, duration: 90  },
    ],
  });
  
try {
    await prisma.certificate.createMany({
      data: [
        { code: 'BEAUTY-300',  amount: 300  },
        { code: 'BEAUTY-500',  amount: 500  },
        { code: 'BEAUTY-700',  amount: 700  },
        { code: 'BEAUTY-1000', amount: 1000 },
        { code: 'BEAUTY-1500', amount: 1500 },
        { code: 'BEAUTY-2000', amount: 2000 },
        { code: 'BEAUTY-3000', amount: 3000 },
        { code: 'BEAUTY-5000', amount: 5000 },
      ],
    });
  } catch (e) {
    console.log('⚠️ Сертификаты уже есть, пропускаем');
  }

  console.log('✅ База данных успешно заполнена!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
