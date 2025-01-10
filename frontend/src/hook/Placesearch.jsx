import { useState } from "react";
import axios from '../axiosConfig';

const usePlaceSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (input) => {
    try {
      const response = await axios.get(`/api/placesearch/placesearch?input=${input}`);
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

export default usePlaceSuggestions;