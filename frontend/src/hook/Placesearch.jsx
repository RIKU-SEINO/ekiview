import { useState } from "react";
import axios from '../axiosConfig';

export const usePlaceSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (input, language) => {
    try {
      const response = await axios.get(`/api/placesearch/autocomplete?input=${input}&language=${language}`);
      const predictions = response.data.autocompleteSuggestions.predictions || [];
      const data = predictions.map((place) => ({
        placeId: place.place_id,
        mainText: place.structured_formatting.main_text,
        secondaryText: place.structured_formatting.secondary_text,
      }));
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch place suggestions:", err);
      setError(err);
      setSuggestions([]); // 候補リストをクリア
      }
  };
  const resetSuggestions = () => {
    setSuggestions([]);
  };

  return { suggestions, error, fetchSuggestions, resetSuggestions };
};

export const usePlaceDetails = () => {
  const [originDetails, setOriginDetails] = useState("");
  const [destinationDetails, setDestinationDetails] = useState("");
  const [error, setError] = useState(null);

  const fetchPlaceDetails = async ({placeId, mode, language}) => {
    try {
      const response = await axios.get(`/api/placesearch/details?place_id=${placeId}&language=${language}`);
      if (mode === "origin") {
        setOriginDetails(response.data.placeDetails.result.name);
      } else {
        setDestinationDetails(response.data.placeDetails.result.name);
      }
    } catch (err) {
      console.error("Failed to fetch place details:", err);
      setError(err);
      setDetails(null);
    }
  };

  return { originDetails, destinationDetails, error, fetchPlaceDetails };
};