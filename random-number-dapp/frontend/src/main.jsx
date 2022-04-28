import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import "./index.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  return library;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);
