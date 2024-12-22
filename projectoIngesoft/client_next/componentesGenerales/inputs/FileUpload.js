"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";

const FileUpload = ({
  width,
  name,
  onChange,
  file,
  isEditing,
  convocatoriaId,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("Seleccione o arrastre el archivo");
  const [isDragging, setIsDragging] = useState(false);

  // Si estamos en modo edición y hay un archivo, actualizar el estado fileName
  useEffect(() => {
    if (file) {
      const fileName = file?.name || "Requisitos"; // Use a default name if no name available
      setFileName(fileName);
    }
  }, [file]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result.split(",")[1]; // Eliminar la parte de base64
        setFileName(selectedFile.name);
        onChange({ target: { name, value: base64File } }); // Pasa el archivo al componente principal
      };
      reader.readAsDataURL(selectedFile); // Convierte el archivo a base64
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFileName(droppedFile.name);
      onChange({ target: { name, value: droppedFile } }); // Pasa el archivo al componente principal
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Función para descargar el archivo usando axios
  const handleDownload = async () => {
    try {
      if (convocatoriaId) {
        // Hacemos la solicitud axios para obtener el archivo
        console.log("ID", convocatoriaId);
        const response = await axios.get(
          `http://localhost:8080/procesoDeSeleccion/buscarRequisitos/${convocatoriaId}`,
          {
            responseType: "blob", // Importante para manejar archivos binarios
          }
        );

        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "requisito.pdf"); // Nombre predeterminado del archivo
        document.body.appendChild(link);
        link.click();

        // Limpiar después de la descarga
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      border="1px solid #ccc"
      borderRadius="5px"
      overflow="hidden"
      width={width}
      height="34px"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        transition: "border 0.1s, background-color 0.1s",
        border: isDragging ? "2px solid #3f51b5" : "1px solid #ccc",
        backgroundColor: isDragging ? "#e3f2fd" : "transparent",
      }}
    >
      {!disabled &&(
      <Button
        onClick={handleButtonClick}
        
        sx={{
          backgroundColor: "#363581",
          color: "#fff",
          padding: "6px 16px",
          borderRadius: 0,
          height: "100%",
          "&:hover": {
            backgroundColor: "#303f9f",
          },
        }}
        disabled={disabled}
      >
        Examinar
      </Button>
    )}
      {isEditing && file && (
        <Button
          onClick={handleDownload}
          sx={{
            backgroundColor: "#5D71BC",
            color: "#fff",
            padding: "6px 16px",
            height: "100%",
            "&:hover": {
              backgroundColor: "#303f9f",
            },
            borderLeft: "1px solid #ccc",
          }}
        >
          Descargar
        </Button>
      )}

      <input
        type="file"
        name={name}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Typography
        sx={{
          padding: "0 10px",
          color: "#888",
          lineHeight: 1.2,
          flexGrow: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "410px",
        }}
      >
        {fileName}
      </Typography>
    </Box>
  );
};

export default FileUpload;
