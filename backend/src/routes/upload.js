const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'beautyline',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/master/:id', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const photoUrl = req.file.path;
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
    const photoUrl = req.file.path;
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
