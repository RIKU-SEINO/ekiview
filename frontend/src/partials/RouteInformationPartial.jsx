import React from 'react';

const RouteInformationPartial = ({ results }) => {
  const routeCandidates = results.routes;
  const route = routeCandidates[0];
  const steps = route.legs[0].steps;

  console.log("↓ルート情報のJSON");
  console.log(route);

  return (
    <div>
      <div>
        <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <li
                style={{
                  textAlign: "left",
                  marginBottom: "8px",
                  fontSize: "18px",
                }}
              >
                <strong>Step {index + 1}:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: step.html_instructions }}></span>
              </li>
              {index < steps.length - 1 && <hr style={{ border: "1px solid #ccc" }} />}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteInformationPartial;
