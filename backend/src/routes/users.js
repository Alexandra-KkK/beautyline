const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { role: true },
    });
    res.json({
      id: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, phone },
    });
    res.json({ id: user.id, login: user.login, email: user.email, name: user.name, phone: user.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    const result = users.map(u => ({
      id: u.id,
      login: u.login,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
});

module.exports = router;

