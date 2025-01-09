import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const QRCodeReader = () => {
  const [scannedResult, setScannedResult] = useState(null);
  const [error, setError] = useState("Scan QR Code");
  const [redirecting, setRedirecting] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null); // カメラの権限ステート

  const location = useLocation(); // 現在のURL情報を取得

  useEffect(() => {
    // ページが開いたらカメラを自動起動
    checkCameraPermission();

    // ページ遷移時や戻るボタンの検知でカメラを停止
    const handleBeforeUnload = () => {
      stopCamera();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);

    // クリーンアップ処理
    return () => {
      stopCamera();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setCameraPermission(true);
        handleQRCodeRead();
      }
    } catch (err) {
      setCameraPermission(false);
    }
  };

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

            // 現在のクエリパラメータを取得
            const currentParams = new URLSearchParams(location.search);

            // QRコードのURLに現在のクエリパラメータを追加
            const url = new URL(resultText);
            currentParams.forEach((value, key) => {
              url.searchParams.set(key, value);
            });

            // 最終的なリダイレクトURL
            const redirectUrl = url.toString();

            // リダイレクト
            setTimeout(() => {
              window.location.href = redirectUrl; // クエリを追加したURLにリダイレクト
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

  const stopCamera = () => {
    const videoElement = document.getElementById("video");
    if (videoElement && videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      handleQRCodeRead();
    } catch (err) {
      setError("Camera permission denied.");
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
    {/* Header */}
    <Header title="EkiView - QRcode Scanner" />

    {/* Main Content */}
    <div style={styles.mainContent}>
      {cameraPermission === null ? ( // 権限チェック中
        <p>Checking camera permissions...</p>
      ) : cameraPermission === false ? ( // カメラが許可されていない場合
        <>
          <p style={styles.error}>Camera permission is not granted.</p>
          <button onClick={requestCameraPermission} style={styles.button}>
            Allow Camera Access
          </button>
        </>
      ) : (
        <>
          <video id="video" style={styles.video}></video>
          {redirecting ? (
            <p style={styles.redirecting}>Redirecting...</p>
          ) : (
            <p style={styles.error}>{error}</p>
          )}
        </>
      )}
    </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  video: {
    width: "auto",
    maxWidth: "500px",
    height: "360px",
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
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default QRCodeReader;
