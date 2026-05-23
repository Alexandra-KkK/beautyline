const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.id },
      include: { service: true, master: true, status: true, paymentMethod: true },
      orderBy: { dateTime: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения записей' });
  }
});

router.get('/master', authMiddleware, async (req, res) => {
  try {
    const master = await prisma.master.findFirst({
      where: { userId: req.user.id }
    });

    if (!master) {
      return res.json([]);
    }

    const appointments = await prisma.appointment.findMany({
      where: { masterId: master.id },
      include: { user: true, service: true, master: true, status: true },
      orderBy: { dateTime: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    console.error('Ошибка мастера:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, roleMiddleware(3, 4), async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { user: true, service: true, master: true, status: true, paymentMethod: true },
      orderBy: { dateTime: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения записей' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { serviceId, masterId, dateTime, paymentMethodId } = req.body;

  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.id,
        serviceId: parseInt(serviceId),
        masterId: parseInt(masterId),
        statusId: 2,
        paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : null,
        amount: service.price,
        dateTime: new Date(dateTime),
      },
      include: { service: true, master: true, status: true },
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания записи' });
  }
});

router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data: { statusId: 4 },
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка отмены записи' });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  const { statusId } = req.body;
  try {
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data: { statusId: parseInt(statusId) },
      include: { service: true, master: true, status: true },
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
});
router.get('/slots', authMiddleware, async (req, res) => {
  const { masterId, date, duration } = req.query;
  if (!masterId || !date || !duration) {
    return res.status(400).json({ error: 'Нужны masterId, date, duration' });
  }

  try {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    const end = new Date(date);
    end.setHours(21, 0, 0, 0);

    const existing = await prisma.appointment.findMany({
      where: {
        masterId: parseInt(masterId),
        dateTime: { gte: start, lt: end },
        status: { name: { not: 'Отменена' } },
      },
      include: { service: true },
    });

    const dur = parseInt(duration);
    const slots = [];
    const current = new Date(start);

    while (current.getTime() + dur * 60000 <= end.getTime()) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + dur * 60000);

      const busy = existing.some(a => {
        const aStart = new Date(a.dateTime);
        const aEnd = new Date(aStart.getTime() + a.service.duration * 60000);
        return slotStart < aEnd && slotEnd > aStart;
      });

      if (!busy) {
        slots.push(slotStart.toISOString());
      }

      current.setMinutes(current.getMinutes() + 30);
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения слотов' });
  }
});

module.exports = router;
