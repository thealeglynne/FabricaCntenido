import React from "react";
import "../components/Header.css"; // asegúrate de tener este archivo junto al componente

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          {/* Reemplaza el src por el logo real cuando lo tengas */}
          <img src="../" alt="Logo" className="logo-img" />
        </div>
        {/* Título o nombre del panel */}
        <div className="header-title">

        </div>
        {/* Espacio para posibles botones a la derecha */}
        <div className="header-right">
          {/* Aquí puedes agregar botones de usuario, tema, etc */}
        </div>
      </div>
    </header>
  );
}
