import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MejaView from "./view/MejaView.tsx";
import MenuView from "./view/MenuView.tsx";
import ReportView from "./view/ReportView.tsx";
import TransaksiView from "./view/TransaksiView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ReportView />,
      },
      {
        path: "meja",
        element: <MejaView />,
      },
      {
        path: "menu",
        element: <MenuView />,
      },
      {
        path: "transaksi",
        element: <TransaksiView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
