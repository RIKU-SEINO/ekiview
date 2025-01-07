import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QRCodeReader = () => {
  const [scannedResult, setScannedResult] = useState(null);
  const [error, setError] = useState("Scan QR Code");
  const [redirecting, setRedirecting] = useState(false); // Redirectingメッセージ用のステート

  useEffect(() => {
    // ページが開いたらカメラを自動起動
    handleQRCodeRead();

    // クリーンアップでカメラを停止
    return () => {
      const videoElement = document.getElementById("video");
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleQRCodeRead = async () => {
    const codeReader = new BrowserMultiFormatReader();

    try {
      // デバイスのカメラをリストアップ
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId =
        videoInputDevices.length > 0 ? videoInputDevices[0].deviceId : null;

      if (!selectedDeviceId) {
        setError("No camera devices found.");
        return;
      }

      // カメラを起動してQRコードを読み取る
      codeReader.decodeFromVideoDevice(selectedDeviceId, "video", (result, err) => {
        if (result) {
          const resultText = result.getText();
          setScannedResult(resultText);

          // URLチェック
          if (isValidUrl(resultText)) {
            setRedirecting(true); // Redirectingメッセージを表示
            setTimeout(() => {
              window.location.href = resultText; // URLにリダイレクト
            }, 1000); // 1秒待ってリダイレクト
          }
        } else if (err) {
          setError("Scan QR Code"); // エラー時には「Scan QR Code」を表示
        }
      });
    } catch (err) {
      setError("Error initializing QR code reader: " + err.message);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div style={styles.container}>
      <h2>QR Code Reader</h2>
      <video id="video" style={styles.video}></video>
      {redirecting ? ( // Redirectingメッセージの表示
        <p style={styles.redirecting}>Redirecting...</p>
      ) : (
        <>
          <p style={styles.error}>{error}</p>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  video: {
    width: "100%",
    maxWidth: "600px",
    height: "auto",
    margin: "20px auto",
    border: "1px solid #ccc",
  },
  error: {
    color: "red",
    fontSize: "32px",
  },
  redirecting: {
    color: "green",
    fontSize: "32px",
    fontWeight: "bold",
  },
};

export default QRCodeReader;
