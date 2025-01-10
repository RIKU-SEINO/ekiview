const { Qrcode } = require('../models'); // モデルをインポート

const getQrcodeById = async (req, res) => {
  const { qr_id } = req.params; // パスパラメータから qr_id を取得
  try {
    // データベースからレコードを検索
    const qrcode = await Qrcode.findOne({
      where: { id: qr_id }, // id に一致するレコードを取得
      attributes: ['place_id', 'panorama_id'], // 必要なカラムのみ取得
    });

    // レコードが存在しない場合のエラーハンドリング
    if (!qrcode) {
      return res.status(404).json({ message: 'QRコードが見つかりません' });
    }

    // レスポンスとしてJSON形式でデータを返す
    res.status(200).json(qrcode);
  } catch (error) {
    // サーバーエラー発生時のレスポンス
    res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
};

module.exports = { getQrcodeById };
