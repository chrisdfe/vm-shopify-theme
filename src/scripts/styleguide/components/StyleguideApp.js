import React from "react";

import Banner from "./app/Banner";

import { HashRouter, Routes, Route } from "react-router-dom";

import StyleguideLayout from "./app/Layout/Layout";

import TypographyPage from "./pages/Typography";
import OverviewPage from "./pages/Overview";
import ColorsPage from "./pages/Colors";

import "./styleguide.scss";

function StyleguideApp() {
  return (
    <HashRouter hashType="slash">
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/typography" element={<TypographyPage />} />
        <Route path="/colors" element={<ColorsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default StyleguideApp;
