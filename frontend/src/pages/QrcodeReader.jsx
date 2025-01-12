import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useLocation, useNavigate } from "react-router-dom";  
import Header from "../components/Header";
import Footer from "../components/Footer";

const QRCodeReader = () => {
  const [scannedResult, setScannedResult] = useState(null);
  const [error, setError] = useState(null);
  const [guide, setGuide] = useState("Scan QR code");
  const [redirecting, setRedirecting] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);  // カメラのストリームを保存

  const location = useLocation();
  const navigate = useNavigate();

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        setError("No camera devices found.");
        return;
      }

      // カメラを起動してQRコードを読み取る
      codeReader.decodeFromVideoDevice(selectedDeviceId, "video", (result, err) => {
        if (result) {
          const resultText = result.getText();
          setScannedResult(resultText);

          if (isValidUrl(resultText)) {
            setRedirecting(true);

            const url = new URL(resultText);
            const currentQueryParams = new URLSearchParams(location.search);
            const additionalQueryParams = new URLSearchParams(url.search);
            additionalQueryParams.forEach((value, key) => {
              currentQueryParams.set(key, value);
            });

            setTimeout(() => {
              navigate("/home?" + currentQueryParams.toString());
              window.location.reload();
            }, 1000);
          }
        } else if (err) {
          setGuide("Scan QR code");
        }
      });
    } catch (err) {
      setError("Error initializing QR code reader: " + err.message);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);  // ストリームをクリア
    }

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
      <Header title="EkiView - QRcode Scanner" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {cameraPermission === null ? ( // 権限チェック中
          <p>Checking camera permissions...</p>
        ) : cameraPermission === false ? ( // カメラが許可されていない場合
          <>
            <p style={styles.error}>Camera permission is not granted</p>
            <button onClick={requestCameraPermission} style={styles.button}>
              Allow Camera Access
            </button>
          </>
        ) : (
          <>
            <video id="video" style={styles.video}></video>
            {redirecting ? (
              <p style={styles.redirecting}>Scan Success!</p>
            ) : (
              <p style={styles.guide}>{guide}</p>
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
