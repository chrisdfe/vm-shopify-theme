import React from "react";

import { HashRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./utils/ScrollToTop";

import TypographyPage from "./pages/Typography";
import OverviewPage from "./pages/Overview";
import ColorsPage from "./pages/Colors";
import ComponentsPage from "./pages/Components";

import "./new-styles.scss";

function StyleguideApp() {
  return (
    <HashRouter hashType="slash">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/typography" element={<TypographyPage />} />
        <Route path="/colors" element={<ColorsPage />} />
        <Route path="/components" element={<ComponentsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default StyleguideApp;
