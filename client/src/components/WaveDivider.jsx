import React from "react";
import "./WaveDivider.css";

const WaveDivider = () => {
  return (
    <div className="wave-container">
      <svg className="wave wave1"   preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path
          fill="#a8dadc"
          fillOpacity="1"
          d="M0,160 C360,260 1080,60 1440,160 L1440,320 L0,320 Z"
        ></path>
      </svg>
      <svg className="wave wave2"   preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path
          fill="#457b9d"
          fillOpacity="0.7"
          d="M0,180 C400,100 1040,240 1440,180 L1440,320 L0,320 Z"
        ></path>
      </svg>
      <svg className="wave wave3"  preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path
          fill="#1d3557"
          fillOpacity="0.4"
          d="M0,100 C480,160 960,240 1440,100 L1440,320 L0,320 Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveDivider;
