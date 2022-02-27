import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily: "sans-serif",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>ARE YOU WONDERING OFF?</h1>
      <h2>PATH NOT FOUND</h2>
      <Link to="/">Back to home page</Link>
    </div>
  );
}
