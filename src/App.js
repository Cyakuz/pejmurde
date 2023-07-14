import React from "react";
import "./style.css";
import { BrowserRouter } from 'react-router-dom';
import {Routes, Route} from "react-router-dom";
import Pejmurde from "./scenes/Pejmurde";


export default function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Pejmurde/>} />
    </Routes>
    </BrowserRouter>
    </>
  );
}
