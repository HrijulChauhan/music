import React from "react";
import { AudioProvider } from "./AudioContext"; // Adjust the path as necessary
import SharedLayout from "./SharedLayout"; // Your existing component

function App() {
  return (
    <AudioProvider>
      <SharedLayout />
    </AudioProvider>
  );
}

export default App;
