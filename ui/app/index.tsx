import React from "react";
import { render } from "react-dom";
import { debugContextDevtool } from "react-context-devtool";
import "antd/dist/antd.css";

import Router from "./router";
import Layout from "antd/lib/layout/layout";

const mainElement = document.createElement("div");
mainElement.setAttribute("id", "root");
document.body.appendChild(mainElement);
const container = document.getElementById("root");

render(
  <Layout
    style={{ height: "100vh", padding: "50px", backgroundColor: "#F9F9F9" }}
  >
    <Router />
  </Layout>,
  container
);

debugContextDevtool(container, {
  disable: process.env.NODE_ENV !== "development",
});
