import React from "react";

const StreetViewPartial = ({ results, originPanorama }) => {
  return (
    <div>
      <h2>Street View</h2>
      <div>
        <iframe
          width="98%"
          height="310px"
          title="Street View"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default StreetViewPartial;
