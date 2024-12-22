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
      
      {/* Pregunta 1 */}
      <h3>Pregunta #1:</h3>
      <p>¿Qué nivel de satisfacción tiene de la asesoría del jefe de práctica?</p>
      <div>
        <label>
          <input
            type="radio"
            name="rating"
            value={'1'}
            checked={selectedRating === 1}
            onChange={handleRatingChange}
          />
          1
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="rating"
            value={'2'}
            checked={selectedRating === 2}
            onChange={handleRatingChange}
          />
          2
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="rating"
            value={'3'}
            checked={selectedRating === 3}
            onChange={handleRatingChange}
          />
          3
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="rating"
            value={'4'}
            checked={selectedRating === 4}
            onChange={handleRatingChange}
          />
          4
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="rating"
            value={'5'}
            checked={selectedRating === 5}
            onChange={handleRatingChange}
          />
          5
        </label>
      </div>

      <hr style={{ border: 'none', height: '2px', backgroundColor: '#39298b', margin: '20px 0' }} />

    </Box>
    
  );
};