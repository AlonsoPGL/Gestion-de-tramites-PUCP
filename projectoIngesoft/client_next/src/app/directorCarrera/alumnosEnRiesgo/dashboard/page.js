"use client";
import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // State to track selected semestre and course
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Colors for circular graph
  const backgroundColors1 = {
    'Segunda': ['#3B82F6', '#b4b6f6', '#d6b0fa'],
    'Tercera': ['#9dc1fc', '#6366F1', '#d6b0fa'],
    'Cuarta': ['#9dc1fc', '#b4b6f6', '#A855F7'],
  }[selectedTime] || ['#3B82F6', '#6366F1', '#A855F7'];

  // Gráfico circular (superior izquierda)
  const dataCircular = {
    labels: ['Segunda', 'Tercera', 'Cuarta'],
    datasets: [
      {
        label: 'Alumnos',
        data: [250, 160, 90],
        backgroundColor: backgroundColors1,
      },
    ],
  };

  const optionsCircular = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Vez en que se lleva el curso',
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        if (selectedTime && selectedTime == dataCircular.labels[clickedIndex]){
          setSelectedTime(null);
        } else{
          setSelectedTime(dataCircular.labels[clickedIndex]);
        }
        
        setSelectedCourse(null); // Reset the course selection
      }
    },
  };

  // Filtered data based on selected semestre
  const filteredSemesters = {
    'Segunda': [60, 70, 55, 65],
    'Tercera': [50, 25, 50, 35],
    'Cuarta': [30, 15, 25, 20],
  }[selectedTime] || [140, 110, 130, 120];

  // Gráfico de barras superior derecha
  const dataSemestres = {
    labels: ['2021-1', '2021-2', '2022-1', '2022-2'],
    datasets: [
      {
        label: 'Alumnos desaprobados',
        data: filteredSemesters,
        backgroundColor: ['#6366F1', '#6366F1', '#6366F1', '#6366F1'],
      },
    ],
  };

  const optionsSemestres = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resumen de desaprobados por semestres',
      },
    },
  };

  // Filtered courses based on selected semestre
  const filteredCourses = {
    'Segunda': [17, 9, 14, 18, 7],
    'Tercera': [8, 6, 7, 9, 5],
    'Cuarta': [5, 3, 4, 5, 3],
  }[selectedTime] || [30, 18, 25, 32, 15];

  // Define the labels array explicitly
  const labelsCourses = ['Programación', 'Software', 'Sistemas', 'Algoritmia', 'BD'];


  // Gráfico de barras inferior izquierda
  const dataDesaprobados = {
    labels: labelsCourses,
    datasets: [
      {
        label: 'Cantidad de desaprobados',
        data: filteredCourses,
        backgroundColor: labelsCourses.map((label) => 
          label === selectedCourse ? '#22C55E' : '#6366F1' // Compare the course label with the selectedCourse
        ),
      },
    ],
  };

  const optionsDesaprobados = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cantidad de desaprobados por curso 2022-2',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;

        if (selectedCourse && selectedCourse == dataDesaprobados.labels[clickedIndex]){
          setSelectedCourse(null);
        } else{
          setSelectedCourse(dataDesaprobados.labels[clickedIndex]);
        }

        setSelectedTime(null); // Reset the time selection
      }
    },
  };

  // Gráfico de barras inferior derecha
  const filteredByCourse = {
    'Programación': [17, 8, 5],
    'Software': [9, 6, 3],
    'Sistemas': [14, 7, 4],
    'Algoritmia': [18, 9, 5],
    'BD': [7, 5, 3]
  }[selectedCourse] || [];

  const dataCurso = {
    labels: ['Segunda', 'Tercera', 'Cuarta'],
    datasets: [
      {
        label: selectedCourse,
        data: filteredByCourse,
        backgroundColor: ['#22C55E', '#4ADE80', '#86EFAC'],
      },
    ],
  };

  const optionsCurso = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: "Detalle de desaprobados por curso 2022-2",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const maxWidth = '680px';
  const maxHeight = '360px';
  const squareSize = '320px';

  return (
    <Box sx={{ backgroundColor: 'white', height: '100vh' }}>
      <Box
        sx={{
          marginLeft: '220px',
          height: '100vh',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div>
          <h2>Alumnos en Riesgo</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Gráfico Circular (Superior Izquierda) */}
            <Box sx={{ width: '520px', height: maxHeight, padding: '20px', ml: '160px' }}>
              <div style={{ maxHeight: squareSize }}>
                <Doughnut data={dataCircular} options={optionsCircular} />
              </div>
            </Box>

            {/* Gráfico de Barras (Superior Derecha) */}
            <Box sx={{ width: maxWidth, height: maxHeight, padding: '20px' }}>
              <div style={{ maxWidth: maxWidth }}>
                <Bar data={dataSemestres} options={optionsSemestres} />
              </div>
            </Box>

            {/* Gráfico de Barras (Inferior Izquierda) */}
            <Box sx={{ width: maxWidth, padding: '20px' }}>
              <div style={{ maxWidth: maxWidth }}>
                <Bar data={dataDesaprobados} options={optionsDesaprobados} />
              </div>
            </Box>

            {/* Gráfico de Barras (Inferior Derecha) */}
            <Box sx={{ width: maxWidth, padding: '20px' }}>
              <div style={{ maxWidth: maxWidth }}>
                <Bar data={dataCurso} options={optionsCurso} />
              </div>
            </Box>
          </div>
        </div>
      </Box>
    </Box>
  );
}