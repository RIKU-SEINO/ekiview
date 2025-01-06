import React, { useState, useEffect, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSearch from "../hook/useSearch";
import usePlaceSuggestions from "../hook/Placesearch";
import Header from "../components/Header";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom"; // React Router の useNavigate をインポート
import useFetchQrData from "../hooks/useFetchQrData"; // 作成したカスタムフックをインポート

const HomePage = () => {
  const [currentLocation, setCurrentLocation] = useState(""); // 現在地の状態
  const [destination, setDestination] = useState(""); // 目的地の状態
  const [isLocationDisabled, setIsLocationDisabled] = useState(false); // 入力フィールドの無効化状態
  const [originPanorama, setOriginPanorama] = useState("");
  const { suggestions, fetchSuggestions } = usePlaceSuggestions();
  const { results, error, search } = useSearch();

  const location = useLocation(); // 現在のURL情報を取得
  const navigate = useNavigate(); // useNavigate フックを取得

  // クエリパラメータから qr_id を取得
  const params = new URLSearchParams(location.search);
  const qrId = params.get("qr_id");

  // qr_id に基づいて place_id を取得するカスタムフック
  const placeId = useFetchQrData(qrId);

  // place_id がある場合、currentLocation に特定のテキストを設定し、入力フィールドを無効化
  useEffect(() => {
    if (placeId) {
      setCurrentLocation("QRコードで指定された場所"); // place_id があればこのテキストに変更
      setIsLocationDisabled(true); // 入力フィールドを無効化
    }
  }, [placeId]);

  useEffect(() => {
    if (currentLocation && destination) {
      search(currentLocation, destination);
    }
  }, [currentLocation, destination]);

  useEffect(() => {
    if (error) {
      alert("Failed to search route. Please try again.");
    } else if (results.length !== 0) {
      navigate('/route', {
        state: {
          results,
          originPanorama,
        },
      });
    }
  }, [results, error]);

  const handleDestinationInputChange = async (e) => {
    const inputValue = e.target.value;
    setDestination(inputValue);
    //console.log("User Input:", inputValue);
    if (inputValue.length >= 3) {
      await fetchSuggestions(inputValue); // 3文字以上でサジェスト取得
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setDestination(suggestion.mainText);
    navigate(`/home?destination_place_id=${suggestion.placeId}`);
    //setSuggestions([]);
  };

  const handleScanQRCode = () => {
    navigate("/qrcodereader"); // ./QrcodeReader へのページ遷移を実行
  };

  const handleSearchRoute = () => {
    //クエリパラメータから値を取得
    const queryParams = new URLSearchParams(location.search);
    const originPlaceId = queryParams.get("origin_place_id");
    const destinationPlaceId = queryParams.get("destination_place_id");
    const originPanoramaId = queryParams.get("origin_panorama_id");

    if (!originPlaceId || !destinationPlaceId || !originPanoramaId) {
      alert("Please enter your current location and destination.");
      return;
    };
    setCurrentLocation(originPlaceId);
    setDestination(destinationPlaceId);
    setOriginPanorama(originPanoramaId);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="EkiView - Home" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        
        {/* Current Location */}
        <div style={styles.subContent}>
          <div style={styles.descriptionField}>
            <h4>1. Find Current Location</h4>
          </div>
          <small style={styles.hintText}>Type name of facility near your current location</small>
          <InputField
            placeholder="Enter Current Location"
            value={currentLocation} // currentLocation に設定された値を表示
            onChange={(e) => setCurrentLocation(e.target.value)}
            disabled={isLocationDisabled} // `place_id` があれば入力不可にする
          />
          <small style={styles.hintText}>Or Scan QR Code to find your current location</small>
          <Button text="Scan QR Code" onClick={handleScanQRCode} style={styles.qrButton} />
        </div>

        {/* Destination */}
        <div style={styles.subContent}>
          <div style={styles.descriptionField}>
            <h4>2. Search Destination</h4>
          </div>
          <small style={styles.hintText}>Type text to search your destination</small>
          <InputField
            placeholder="Enter Your Destination"
            value={destination}
            onChange={handleDestinationInputChange}
          />
          {suggestions.length > 0 && (
        <ul>
            {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionSelect(suggestion)}>
              <strong>{suggestion.mainText}</strong>
              <br/>
              <small>{suggestion.secondaryText}</small>
            </li>
            ))}
        </ul>
          )}
        </div>

        {/* Search Button */}
        <div style={styles.subContent}>
          <Button text="Search Route" onClick={handleSearchRoute} style={styles.searchButton} />
        </div>
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
  subContent: {
    marginBottom: "30px",
    margin: "0 auto",
    width: "80%",
    textAlign: "left",
  },
  descriptionField: {
    marginBottom: "-20px",
  },
  qrButton: {
    display: "block",
    margin: "10px auto",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchButton: {
    display: "block",
    margin: "10px auto",
    marginTop: "50px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  hintText: {
    color: "gray",
    fontSize: "12px",
  },
};

export default HomePage;
