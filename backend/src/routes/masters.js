const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const masters = await prisma.master.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(masters);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения мастеров' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const master = await prisma.master.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { services: true },
    });
    if (!master) return res.status(404).json({ error: 'Мастер не найден' });
    res.json(master);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения мастера' });
  }
});

router.post('/create', authMiddleware, roleMiddleware(4), async (req, res) => {
  const { name, specialization, experience, login, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        name,
        roleId: 2,
      },
    });
    const master = await prisma.master.create({
      data: {
        name,
        specialization,
        experience,
        userId: user.id,
      },
    });
    res.status(201).json({ user, master });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания мастера' });
  }
});

module.exports = router;
