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
  const [guide, setGuide] = useState("Scan QR code");
  const [redirecting, setRedirecting] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);  // カメラのストリームを保存
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

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
        },
      });

      if (stream) {
        setCameraPermission(true);
        setCameraStream(stream);
        handleQRCodeRead();
      }
    } catch (err) {
      setCameraPermission(false);
    }
  };

  const handleQRCodeRead = async () => {
    const codeReader = new BrowserMultiFormatReader();

    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId =
        videoInputDevices.length > 0 ? videoInputDevices[0].deviceId : null;

      if (!selectedDeviceId) {
        alert(t('No camera devices found.'));
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
      alert(t('Error initializing QR code reader:')+ " " + err.message);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    const videoElement = document.getElementById("video");
    if (videoElement && videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
        },
      });
      setCameraStream(stream);
      setCameraPermission(true);
      handleQRCodeRead();
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
    if (cameraStream) {
      const videoElement = document.getElementById("video");
      if (videoElement) {
        videoElement.srcObject = cameraStream;
      }
    }
  }, [cameraStream]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title={`EkiView - ${t('QR Scan')}`} />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {cameraPermission === null ? ( // 権限チェック中
          <p>{t('Checking camera permissions...')}</p>
        ) : cameraPermission === false ? ( // カメラが許可されていない場合
          <>
            <p style={styles.error}>{t('Camera permission is not granted')}</p>
            <button onClick={requestCameraPermission} style={styles.button}>
              {t('Allow Camera Access')}
            </button>
          </>
        ) : (
          <>
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
    width: "auto",
    maxWidth: "90%",
    margin: "20px auto",
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
