import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";

const FadingHtml = ({ position, children }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <Html
      position={position}
      transform={false}
      style={{
        position: "absolute",
        top: "10px",
        left: "-210px",
        color: "white",
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        whiteSpace: "nowrap",
        width: "auto",
        padding: "5px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "4px",
        pointerEvents: "none",
        opacity: opacity,
        transition: "opacity 2s ease-in-out",
      }}
    >
      {children}
    </Html>
  );
};

export default FadingHtml;
