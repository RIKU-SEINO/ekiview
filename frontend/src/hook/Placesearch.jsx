import { useState } from "react";
import axios from '../axiosConfig';

const usePlaceSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (input) => {
    try {
      const response = await axios.get(`/api/placesearch/placesearch?input=${input}`);
      //console.log(response.data.autocompleteSuggestions.predictions);
      const data = response.data.autocompleteSuggestions.predictions.map((place) => ({
        placeId: place.place_id,
        mainText: place.structured_formatting.main_text,
        secondaryText: place.structured_formatting.secondary_text,
      }));
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch place suggestions:", err);
      setError(err);
      setSuggestions([]); // エラー時にはサジェストをリセット
    }
  };

  return { suggestions, error, fetchSuggestions };
};

export default usePlaceSuggestions;