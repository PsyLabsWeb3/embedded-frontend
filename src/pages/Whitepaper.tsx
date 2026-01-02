import React from "react";

const Whitepaper: React.FC = () => {
  const pdfUrl = "/whitepaper.pdf"; // Place your `whitepaper.pdf` in the project's `public/` folder

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={pdfUrl}
        title="Whitepaper"
        style={{ border: 0, width: "100%", height: "100%" }}
      >
        Your browser does not support PDFs. You can download the file <a href={pdfUrl}>here</a>.
      </iframe>
    </div>
  );
};

export default Whitepaper;
