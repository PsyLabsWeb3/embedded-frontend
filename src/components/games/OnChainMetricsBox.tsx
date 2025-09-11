import React from "react";
import "./OnChainMetricsBox.css";

const metrics = [
  { label: "Total Matches", value: "Lorem Ipsum" },
  { label: "Unique wallets", value: "Lorem Ipsum" },
  { label: "Most active player", value: "Lorem Ipsum" },
  { label: "Global win rate", value: "Lorem Ipsum" },
  { label: "Total rewards", value: "Lorem Ipsum" },
];

const OnChainMetricsBox: React.FC = () => (
  <div className="onchain-metrics-box">
    <h3 className="onchain-metrics-title">On-Chain Metrics</h3>
    <div className="onchain-metrics-list">
      {metrics.map((item, idx) => (
        <div className="onchain-metrics-row" key={idx}>
          <span className="onchain-metrics-label">{item.label}</span>
          <span className="onchain-metrics-value">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default OnChainMetricsBox;
