import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useLocation, useNavigate } from "react-router-dom";  
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingOverlay from "../components/LoadingOverlay";

const QRCodeReader = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState(t('Scan QR code'));
  const [redirecting, setRedirecting] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [devices, setDevices] = useState([]); // 利用可能なカメラデバイスを保存
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // 選ばれたカメラのID
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${t('QR Scan')} - EkiView`;
  });

  useEffect(() => {
    // ページが開いたらカメラを自動起動
    checkCameraPermission();

    // ページ遷移時や戻るボタンの検知でカメラを停止
    const handleBeforeUnload = () => {
      stopCamera();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);

    return () => {
      stopCamera();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (cameraPermission === true) {
      handleQRCodeRead();
    }
  }, [selectedDeviceId]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setCameraPermission(true);
        listVideoDevices(); // カメラデバイスのリストを取得
      }
    } catch (err) {
      setCameraPermission(false);
      console.error("Camera permission error:", err);
    }
  };

  const listVideoDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === "videoinput");
    setDevices(videoDevices);

    if (videoDevices.length > 0) {
      // デフォルトではリアカメラを選択
      setSelectedDeviceId(videoDevices[videoDevices.length - 1].deviceId);
    }
  };

  const handleQRCodeRead = async () => {
    const codeReader = new BrowserMultiFormatReader();

    try {
      if (!selectedDeviceId) {
        alert(t('No camera selected.'));
        return;
      }

      // カメラを起動してQRコードを読み取る
      codeReader.decodeFromVideoDevice(selectedDeviceId, "video", (result, err) => {
        if (result) {
          const resultText = result.getText();

          if (isValidUrl(resultText)) {
            setRedirecting(true);
            setLoading(true);

            const url = new URL(resultText);
            const currentQueryParams = new URLSearchParams(location.search);
            const additionalQueryParams = new URLSearchParams(url.search);
            additionalQueryParams.forEach((value, key) => {
              currentQueryParams.set(key, value);
            });

            setTimeout(() => {
              navigate("/home?"+ currentQueryParams.toString());
              window.location.reload();
              setLoading(false);
            }, 1000);
          }
        } else if (err) {
          setGuide(t('Scan QR code'));
        }
      });
    } catch (err) {
      alert(t('Error initializing QR code reader:') + " " + err.message);
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
      listVideoDevices(); // カメラリストを取得
    } catch (err) {
      alert(t('Camera permission denied.'));
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

  useEffect(() => {
    if (selectedDeviceId) {
      const videoElement = document.getElementById("video");
      if (videoElement) {
        videoElement.srcObject = null; // 以前のカメラを停止
        navigator.mediaDevices
          .getUserMedia({ video: { deviceId: selectedDeviceId } })
          .then((stream) => {
            videoElement.srcObject = stream;
          });
      }
    }
  }, [selectedDeviceId]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title={`EkiView - ${t('QR Scan')}`} />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {cameraPermission === null ? (
          <p>{t('Checking camera permissions...')}</p>
        ) : cameraPermission === false ? (
          <>
            <p style={styles.error}>{t('Camera permission is not granted')}</p>
            <button onClick={requestCameraPermission} style={styles.button}>
              {t('Allow Camera Access')}
            </button>
          </>
        ) : (
          <>
            {/* カメラ選択リスト */}
            {devices.length > 0 && (
              <div style={styles.selectWrapper}>
                <select
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  value={selectedDeviceId}
                  style={styles.select}
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || t('Unnamed device')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* QRコードリーダー */}
            <video id="video" style={styles.video}></video>
            {redirecting ? (
              <p style={styles.redirecting}>{t('Scan Success!')}</p>
            ) : (
              <p style={styles.guide}>{guide}</p>
            )}
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}

      {/* Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    textAlign: "center",
    marginTop: "60px",
  },
  video: {
    width: "100%",
    maxWidth: "300px",
    margin: "20px auto",
    marginBottom: "0px",
    borderRadius: "10px",  // 動画の角を丸くする
  },
  selectWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    width: "90%",  // 幅を80%に設定
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    fontSize: "20px",
  },
  redirecting: {
    color: "green",
    fontSize: "20px",
  },
  guide: {
    color: "gray",
    fontSize: "20px",
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
