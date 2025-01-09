// frontend/hooks/useFetchQrData.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useFetchQrData = (qrId) => {
  const [placeId, setPlaceId] = useState(""); // place_id を状態として管理
  const navigate = useNavigate();

  useEffect(() => {
    if (qrId) {
      const fetchQrData = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/qrcodes/${qrId}`);
          if (response.data && response.data.place_id && response.data.panorama_id) {
            // place_id と panorama_id を取得し、新しい URL にリダイレクト
            navigate(`/home?qr_id=${qrId}&origin_place_id=${response.data.place_id}&origin_panorama_id=${response.data.panorama_id}`);
            setPlaceId(response.data.place_id); // place_id を保存
          } else {
            console.error("Invalid data from server:", response.data);
          }
        } catch (error) {
          console.error("Error fetching QR data:", error);
        }
      };

      fetchQrData();
    }
  }, [qrId, navigate]);

  return placeId; // place_id を返す
};

export default useFetchQrData;
