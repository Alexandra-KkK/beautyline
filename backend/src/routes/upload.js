const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo-${req.params.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Только изображения'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/master/:id', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const photoUrl = `/uploads/${req.file.filename}`;
    const master = await prisma.master.update({
      where: { id: parseInt(req.params.id) },
      data: { photo: photoUrl },
    });
    res.json({ photo: photoUrl, master });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки фото' });
  }
});

router.post('/service/:id', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const photoUrl = `/uploads/${req.file.filename}`;
    const service = await prisma.service.update({
      where: { id: parseInt(req.params.id) },
      data: { photo: photoUrl },
    });
    res.json({ photo: photoUrl, service });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки фото' });
  }
});

module.exports = router;