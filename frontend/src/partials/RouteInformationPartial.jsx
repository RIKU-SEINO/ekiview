import React from 'react';

const RouteInformationPartial = ({ results }) => {
  const routeCandidates = results.routes;
  const route = routeCandidates[0];

  console.log("↓ルート情報のJSON")
  console.log(route);

  return (
    <div>
      <h2>Route Information</h2>
      <div>
        <p>Distance: {route.legs[0].distance.text}</p>
        <p>Duration: {route.legs[0].duration.text}</p>
      </div>
    </div>
  );
};

export default RouteInformationPartial;