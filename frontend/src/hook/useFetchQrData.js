import { useEffect, useState } from "react";
import axios from './axiosConfig';
import { useNavigate, useLocation } from "react-router-dom";

const useFetchQrData = (qrId) => {
  const [placeId, setPlaceId] = useState(""); // place_id を状態として管理
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (qrId) {
      const fetchQrData = async () => {
        try {
          const response = await axios.get(`/api/qrcodes/${qrId}`);
          if (response.data && response.data.place_id && response.data.panorama_id) {
            // 現在のクエリパラメータを取得
            const queryParams = new URLSearchParams(location.search);

            // 新しいパラメータを追加
            queryParams.set("qr_id", qrId);
            queryParams.set("origin_place_id", response.data.place_id);
            queryParams.set("origin_panorama_id", response.data.panorama_id);

            // 新しいURLにリダイレクト
            navigate(`/home?${queryParams.toString()}`);
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
  }, [qrId, navigate, location]);

  return placeId; // place_id を返す
};

export default useFetchQrData;
