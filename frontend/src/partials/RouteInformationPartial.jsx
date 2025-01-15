import React from 'react';

const RouteInformationPartial = ({ results }) => {
  const routeCandidates = results.routes;
  const route = routeCandidates[0];
  const steps = route.legs[0].steps;

  return (
    <div>
      <div style={{
        overflowY: "scroll",
      }}
      >
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
                <span>
                  {step.html_instructions.replace(/<\/?b>/g, "")}
                </span>
              </li>
              {index < steps.length - 1 && <hr style={{ border: "1px solid #ccc" }} />}
              {index >= steps.length - 1 && <li style={{ textAlign: "left", marginBottom: "8px", fontSize: "18px", height: "50px"}}><span>&nbsp;</span></li>}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteInformationPartial;
