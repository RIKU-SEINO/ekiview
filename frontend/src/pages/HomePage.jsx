import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSearch from "../hook/useSearch";
import { usePlaceSuggestions, usePlaceDetails } from "../hook/Placesearch";
import Header from "../components/Header";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Footer from "../components/Footer";
import useFetchQrData from "../hook/useFetchQrData"; // 作成したカスタムフックをインポート

const HomePage = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentLocationText, setCurrentLocationText] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [hoverIndex, setHoverIndex] = useState(null);
  const [originPanorama, setOriginPanorama] = useState("");
  const { suggestions: currentLocationSuggestions, fetchSuggestions: fetchCurrentLocationSuggestions, resetSuggestions: resetCurrentLocationSuggestions } = usePlaceSuggestions();
  const { suggestions: destinationSuggestions, fetchSuggestions: fetchDestinationSuggestions, resetSuggestions: resetDestinationSuggestions } = usePlaceSuggestions();
  const { originDetails, destinationDetails, fetchPlaceDetails } = usePlaceDetails();
  const { results, error, search } = useSearch();
  const location = useLocation(); // 現在のURL情報を取得
  const navigate = useNavigate(); // useNavigate フックを取得

  // クエリパラメータから qr_id を取得
  const params = new URLSearchParams(location.search);
  const qrId = params.get("qr_id");

  // qr_id に基づいて place_id を取得するカスタムフック
  const placeId = useFetchQrData(qrId);

  // リロード時に、現在のクエリパラメータから place_id を取得して currentLocationText に設定
  useEffect(() => {
    const fetchOriginPlaceDetailsAsync = async () => {
      const currentUrl = new URL(window.location.href);
      const originPlaceId = currentUrl.searchParams.get("origin_place_id");
  
      // originPlaceId があれば details を取得して currentLocationText を設定
      if (originPlaceId) {
        await fetchPlaceDetails({ placeId: originPlaceId, mode: "origin" });
        setCurrentLocationText(originDetails);
      }
    };
  
    fetchOriginPlaceDetailsAsync();
  }, [originDetails]); 

  useEffect(() => {
    const fetchDestinationPlaceDetailsAsync = async () => {
      const currentUrl = new URL(window.location.href);
      const destinationPlaceId = currentUrl.searchParams.get("destination_place_id");
  
      if (destinationPlaceId) {
        await fetchPlaceDetails({ placeId: destinationPlaceId, mode: "destination" });
        setDestinationText(destinationDetails);
      }
    };
  
    fetchDestinationPlaceDetailsAsync();
  }, [destinationDetails]);

  useEffect(() => {
    if (placeId) {
      setCurrentLocation(placeId);

      const fetchOriginPlaceDetailsAsync = async () => {
        const currentUrl = new URL(window.location.href);
        const originPlaceId = currentUrl.searchParams.get("origin_place_id");
    
        // originPlaceId があれば details を取得して currentLocationText を設定
        if (originPlaceId) {
          await fetchPlaceDetails({ placeId: originPlaceId, mode: "origin" });
          setCurrentLocationText(originDetails);
        }
      };
    
      fetchOriginPlaceDetailsAsync();
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

  const handleCurrentLocationInputChange = async (e) => {
    const inputValue = e.target.value;
    setCurrentLocationText(inputValue);
  
    if (inputValue.length >= 3) {
      try{
        await fetchCurrentLocationSuggestions(inputValue);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  }
  };

  const handleDestinationInputChange = async (e) => {
    const inputValue = e.target.value;
    setDestinationText(inputValue);
    if (inputValue.length >= 3) {
      try{
        await fetchDestinationSuggestions(inputValue);
    }catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  }
  };

  const handleCurrentLocationSuggestionSelect = (suggestion) => {
    setCurrentLocationText(suggestion.mainText);
  
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("origin_place_id", suggestion.placeId);
    navigate(`/home?${queryParams.toString()}`);
    resetCurrentLocationSuggestions();
  };

  const handleSuggestionSelect = (suggestion) => {
    setDestinationText(suggestion.mainText);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("destination_place_id", suggestion.placeId);
    navigate(`/home?${queryParams.toString()}`);
    resetDestinationSuggestions();
  };

  const handleScanQRCode = () => {
    // 現在のURLからクエリパラメータを取得
    const queryParams = new URLSearchParams(location.search);
  
    // 新しいURLにクエリパラメータを付加して遷移
    navigate(`/qrcodereader?${queryParams.toString()}`);
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
            value={currentLocationText}
            onChange={handleCurrentLocationInputChange}
          />
          {currentLocationSuggestions.length > 0 && (
    <ul style={styles.suggestionsList}>
      {currentLocationSuggestions.map((suggestion, index) => (
        <li
          key={index}
          style={{
            ...styles.suggestionItem,
            ...(hoverIndex === index ? styles.suggestionItemHover : {}),
          }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => handleCurrentLocationSuggestionSelect(suggestion)}
        >
          <strong>{suggestion.mainText}</strong>
          <br />
          <small>{suggestion.secondaryText}</small>
        </li>
        ))}
      </ul>
    )}
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
            value={destinationText}
            onChange={handleDestinationInputChange}
          />
          {destinationSuggestions.length > 0 && (
        <ul style={styles.suggestionsList}>
            {destinationSuggestions.map((suggestion, index) => (
            <li key={index} style={{
              ...styles.suggestionItem,
              ...(hoverIndex === index ? styles.suggestionItemHover : {}),
            }}
             onMouseEnter={() => setHoverIndex(index)} // ホバー時
             onMouseLeave={() => setHoverIndex(null)}
             onClick={() => handleSuggestionSelect(suggestion)}>
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
    position: "relative"
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
  suggestionsList: {
    listStyleType: "none", // 点を省略
    padding: 0,
    margin: "0px auto",
    maxHeight: "200px", // スクロール領域の高さを指定
    overflowY: "auto",
    position: "absolute",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  suggestionItem: {
    border: "1px solid #ccc", // 枠を追加
    padding: "10px",
    margin: 0,
    backgroundColor: "#fff",
    //textAlign: "center",
    //width: "100%",
    transition: "background-color 0.2s",
  },
  suggestionItemHover: {
    backgroundColor: "#f0f0f0",
  },
};

export default HomePage;
