//"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
import { useRouter, usePathname } from "next/navigation";
import { useParams } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function DelegatePage(idHorario, idDocente) {
  
  return(
    <Box
      sx={{
        padding: '20px',
      }}>
      
      <hr style={{ border: 'none', height: '2px', backgroundColor: '#39298b', margin: '20px 0' }} />

      {/* Pregunta 2 */}
      <h3>Pregunta #2:</h3>
      <p>Comentarios sobre el jefe de práctica:</p>
      <textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder="Escriba sus comentarios aquí..."
        style={{
          width: '100%',
          height: '100px',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: '#f8f8f8',
        }}
      />
    </Box>
    
  );
};