import React, { useState } from "react";
import { useZxing } from "react-zxing";

function QrcodeReader() {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onResult(result) {
      setResult(result.getText());
    },
  });
  
  return (
    <div>
      <video ref={ref} />
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </div>
  );
}

export default QrcodeReader;
