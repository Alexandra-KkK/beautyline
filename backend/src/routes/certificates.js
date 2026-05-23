const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

router.post('/check', authMiddleware, async (req, res) => {
  const { code } = req.body;
  try {
    const cert = await prisma.certificate.findUnique({ where: { code } });
    if (!cert) return res.status(404).json({ error: 'Сертификат не найден' });
    if (cert.isUsed) return res.status(400).json({ error: 'Сертификат уже использован' });
    res.json({ valid: true, amount: cert.amount });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка проверки сертификата' });
  }
});

module.exports = router;
