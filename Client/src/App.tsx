import "./global.css";

import { Routes, Route, useLocation } from "react-router-dom";

import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar"; // adjust path if different
import HomePage from "./pages/Homepage";  // adjust path if different

import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import { useEffect } from "react";
import {Toaster} from 'react-hot-toast'

export default function App() {

  const{pathname} = useLocation()

  useEffect(()=>{
    window.scrollTo(0,0)
  },[pathname])
  return (
    <>
      <Toaster/>
      <LenisScroll />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generate/:id" element={<Generate />} />
        <Route path="/my-generation" element={<MyGeneration />} />
        <Route path="/preview" element={<YtPreview />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
  