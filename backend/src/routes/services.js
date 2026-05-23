const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const { categoryId } = req.query;
  try {
    const services = await prisma.service.findMany({
      where: categoryId ? { categoryId: parseInt(categoryId) } : {},
      include: { category: true, master: true },
      orderBy: { name: 'asc' },
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения услуг' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, master: true },
    });
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения услуги' });
  }
});

router.post('/', authMiddleware, roleMiddleware(4), async (req, res) => {
  const { name, description, price, duration, categoryId, masterId } = req.body;
  try {
    const service = await prisma.service.create({
      data: { name, description, price: parseFloat(price), duration: parseInt(duration), categoryId: parseInt(categoryId), masterId: masterId ? parseInt(masterId) : null },
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания услуги' });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(4), async (req, res) => {
  const { name, description, price, duration, categoryId, masterId } = req.body;
  try {
    const service = await prisma.service.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price: parseFloat(price), duration: parseInt(duration), categoryId: parseInt(categoryId), masterId: masterId ? parseInt(masterId) : null },
    });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления услуги' });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(4), async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Услуга удалена' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления услуги' });
  }
});

module.exports = router;
