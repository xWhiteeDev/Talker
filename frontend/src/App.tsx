import { Outlet } from "react-router-dom";
import { useState } from "react";
import style from "./App.module.css";
export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <div
      className={style.appContainer}
      style={{
        backgroundImage: darkMode
          ? "linear-gradient(322deg, rgb(35, 46, 48) 0%, rgba(0, 0, 0, 0.8) 100%)"
          : "linear-gradient(322deg, rgba(187, 245, 254, 1) 0%, rgba(219, 219, 219, 0.61) 100%)",
        color: darkMode ? "#d1d1d1" : "#000000",
      }}
    >
      <Outlet />
    </div>
  );
}
