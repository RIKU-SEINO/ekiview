import { useState } from "react";
import axios from '../axiosConfig';

const useSearch = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const search = async (currentLocation, destination, currentPanoramaId) => {
    try {
      const response = await axios.get(`/api/routes/search?origin=${currentLocation}&destination=${destination}&currentPanoramaId=${currentPanoramaId}`);
      setResults(response.data);
    } catch (error) {
      setError(error);
    }
  };

  return { results, error, search };
};

export default useSearch;