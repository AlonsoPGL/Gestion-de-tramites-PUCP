"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <ArrowForwardIos
            className={className}
            style={{ 
            //...style, 
            //display: "block", 
            color: "black", 
            //fontSize: "30px",  // Tamaño del ícono
            //right: "10px",     // Posición desde el borde derecho
            }}
            onClick={onClick}
        />
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <ArrowBackIos
        className={className}
        style={{ 
          //...style, 
          //display: "block", 
          color: "black", 
          //fontSize: "30px",  // Tamaño del ícono
          //left: "10px",      // Posición desde el borde izquierdo
          //zIndex: 1         // Asegura que la flecha izquierda esté por encima de la diapositiva
        }}
        onClick={onClick}
      />
    );
  };

function CarouselHome() {
  const settings = {
    dots: true,            // Muestra puntos de navegación
    fade: true,
    infinite: true,        // Hacer que el carrusel sea infinito
    speed: 600,            // Velocidad de la transición en milisegundos
    slidesToShow: 1,       // Cuántas diapositivas mostrar a la vez
    slidesToScroll: 1,     // Cuántas diapositivas avanzar por vez
    autoplay: true,        // Habilita el cambio automático de diapositivas
    autoplaySpeed: 3000,   // Velocidad del cambio automático
    nextArrow: <NextArrow />,  // Flecha derecha personalizada
    prevArrow: <PrevArrow />,  // Flecha izquierda personalizada
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Slider {...settings}>
        <div>
          <img src="https://files.pucp.education/puntoedu/wp-content/uploads/2021/03/31184656/campus-pucp-cia-letras-2020_03-1920x1080-1.jpg" alt="Imagen 1" style={{ width: "100%" }} />
        </div>
        <div>
          <img src="https://files.pucp.education/puntoedu/wp-content/uploads/2021/07/15124053/10-pucp-rankink-the-n1nologo.jpg" alt="Imagen 2" style={{ width: "100%" }} />
        </div>
        <div>
          <img src="https://files.pucp.education/puntoedu/wp-content/uploads/2021/02/23005117/campus-aerea.jpg" alt="Imagen 3" style={{ width: "100%" }} />
        </div>
      </Slider>
    </div>
  );
}

export default CarouselHome;