const express = require('express');
const router = express.Router();
const qrcodeController = require('../controllers/qrcodeController');

// qr_id に基づきplace_idとpanorama_idを取得するエンドポイント
router.get('/qrcodes/:qr_id', qrcodeController.getQrcodeById);

module.exports = router;
