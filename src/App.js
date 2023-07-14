import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import Pejmurde from "./scenes/Pejmurde";
import Issue from "./scenes/Sayilar";
import "./style.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pejmurde />} />
          <Route path="/dergi/:sayiid" element={<Issue />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
