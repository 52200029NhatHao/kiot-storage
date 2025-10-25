import React from "react";

const CircularProgressBar = ({
  progress,
  radius = 30,
  strokeWidth = 5,
  trackColor = "#e5e7eb",
  progressColor = "#3b82f6",
}) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
      <circle
        cx={radius + strokeWidth / 2}
        cy={radius + strokeWidth / 2}
        r={radius}
        fill="transparent"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={radius + strokeWidth / 2}
        cy={radius + strokeWidth / 2}
        r={radius}
        fill="transparent"
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius + strokeWidth / 2} ${
          radius + strokeWidth / 2
        })`}
        style={{
          transition: "stroke-dashoffset 0.1s linear",
        }}
      />
    </svg>
  );
};

export default CircularProgressBar;
