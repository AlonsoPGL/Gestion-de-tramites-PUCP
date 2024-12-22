"use client";
import axios from 'axios';
import { Box, Button, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState ,useContext, useEffect} from "react";
import { useRouter } from "next/navigation";
import { InstitucionContext,useInstitucion } from "@/app/InstitucionContext";

const GestionPerfilInstitucion = () => {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false); // Estado para arrastrar
    const [nombre, setNombre] = useState("");
    const [nombreError, setNombreError] = useState("");
    const [fileError, setFileError] = useState("");
    
    //!Solucionando error (visualizar informacion actual)
    const {institucion}=useInstitucion();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        validateFile(selectedFile);
    };

    const validateFile = (selectedFile) => {
        if (selectedFile && selectedFile.size > 500 * 1024) {
            setFileError("El archivo debe ser menor a 500 KB.");
            setFile(null);
            setPreview(null);
            return;
        }
        if (selectedFile) {
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setPreview(fileURL);
            setFileError("");
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const droppedFile = event.dataTransfer.files[0];
        validateFile(droppedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleButtonClick = () => {
        const uploadButton = document.getElementById("upload-button");
        uploadButton.click();
    };
    
    const redirectHomeAdmin = () => {
        // Funcionalidad de redirección
        router.push('/home')
    }

    //!Actualizando insitucion
    const [actualizado, setActualizado] = useState(false);

    useEffect(() => {
        if (actualizado) {
            console.log("Institución actualizada y datos reflejados.");
            setActualizado(false); // Resetear estado para evitar re-renderizados innecesarios
        }
    }, [actualizado]);

    const { setInstitucion }=useContext(InstitucionContext);

    const obtenerInstitucion = async () => {
        try {
          const response = await axios.get('http://localhost:8080/institucion/institucion/obtener/1');
          const responseInsitucionAxios = response.data; // Guardamos la data de la persona en una variable local 
          //setInstitucionBD(responseInsitucionAxios); // Almacenar la institución
          setInstitucion(responseInsitucionAxios);
          console.log(responseInsitucionAxios); // Verifica los datos recibidos
        } catch (error) {
          console.error('Error al obtener institución:', error);
        }
      };

    const handleAceptar = async () => {
        if (!nombre || nombre.length > 20) {
            setNombreError("El nombre es obligatorio y no debe exceder los 20 caracteres.");
            return;
        }

        if (!file) {
            setFileError("Por favor, seleccione un archivo válido.");
            return;
        }

        if (file && nombre) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // Obtener la parte del Base64

                const jsonData = {
                    idInstitucion: 1,
                    nombre: nombre,
                    logo: base64data,
                    activo: true
                };

                try {
                    const response = await fetch('http://localhost:8080/institucion/institucion/actualizar/1', {
                        method: 'PUT', // Cambia a PUT para la actualización
                        headers: {
                            'Content-Type': 'application/json', // Establecer el tipo de contenido como JSON
                        },
                        body: JSON.stringify(jsonData), // Convierte el objeto a JSON
                    });

                    if (response.ok) {
                        window.alert("Cambios registrados con éxito, se reflejarán en breve.");
                        await obtenerInstitucion();
                        setActualizado(true);
                        // Puedes manejar la respuesta aquí, por ejemplo, mostrar un mensaje de éxito
                    } else {
                        console.error('Error al actualizar los datos:', response.statusText);
                        // Maneja errores aquí
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                    // Maneja errores de red aquí
                }
            };

            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        } else {
            console.warn('Por favor, complete todos los campos requeridos.');
        }
        //router.push("/"); 
        //!Aqui no se deberia redirigir al login, creo que deberia de hacer fetch, actualizar el contextInsitucion y refrescar la pagina
        obtenerInstitucion();
    };

    const handleNombreChange = (e) => {
        const newValue = e.target.value;
        setNombre(newValue);

        if (!newValue) {
            setNombreError("El nombre es obligatorio.");
        } else if (newValue.length > 20) {
            setNombreError("El nombre no debe exceder los 20 caracteres.");
        } else {
            setNombreError("");
        }
    };

    return (
        <Box sx={{ marginLeft: '220px',marginBottom:'50px', marginTop:'5px', height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' ,cursor:'default'}}>
            <Box sx={{display:'flex', mb:'20px'}}>
                <Typography variant='h5' sx={{ margin: '10px' ,ml:'100px'}}>Datos actuales de la institucion:</Typography>
                <Box 
                    sx={{ 
                        marginTop: '10px', 
                        textAlign: 'center', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' // Centrar horizontalmente
                    }}
                >
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' // Centrar horizontalmente el texto e imagen
                        }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${institucion.logo}`}
                            style={{ 
                                width: 35, 
                                height: 35, 
                                marginRight: '10px' 
                            }}
                        />
                        {institucion.nombre}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ border: 'solid 1px', mr: '100px',ml: '100px', marginBottom: '40px', borderRadius: '15px' ,cursor:'default'}}>
                <Typography variant='h5' sx={{ margin: '20px' }}>CARGAR NUEVO LOGO</Typography>
                <Box
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    sx={{
                        border: dragging ? '2px dashed #000' : '2px dashed #d9dade',
                        margin: '20px',
                        padding: '40px',
                        borderRadius: '15px',
                        backgroundColor: dragging ? '#f0f0f0' : '#d9dade',
                        textAlign: 'center',
                    }}
                >

                    <Box>
                        {!preview&&(
                            <Box>
                                <CloudUploadIcon sx={{ fontSize: 150, color: '#363581' }} />
                                <Typography sx={{ marginBottom: '20px' }} variant='subtitle1'>
                                    {dragging ? "Suelta tu archivo aquí" : "Arrastra y suelta tu archivo o haz clic para seleccionarlo"}
                                </Typography>
                            </Box>
                        )}
                    
                        {preview && (
                        <Box 
                            sx={{ 
                                marginTop: '5px', 
                                textAlign: 'center', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center' // Centrar horizontalmente
                            }}
                        >
                            <Typography variant="subtitle1">Vista previa:</Typography>

                            <Box 
                                sx={{ 
                                    marginTop: '10px', 
                                    textAlign: 'center', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center' // Centrar horizontalmente
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' // Centrar horizontalmente el texto e imagen
                                    }}
                                >
                                    <img
                                        src={preview} 
                                        style={{ 
                                            width: 35, 
                                            height: 35, 
                                            marginRight: '10px' 
                                        }}
                                    />
                                    NOMBRE DE LA INSTITUCIÓN
                                </Typography>

                                <img
                                    src={preview}
                                    alt="Vista previa"
                                    style={{ 
                                        width: '150px', 
                                        height: 'auto', 
                                        marginTop: '10px', 
                                        borderRadius: '10px' 
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                        <input
                            accept="image/png, image/jpeg, image/jpg, image/ico, image/svg+xml"
                            id="upload-button"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        

                        <Button onClick={handleButtonClick} sx={{ marginTop: '20px' }} variant='contained'>
                            <AddIcon />
                        </Button>
                    </Box>
                    

                    {fileError && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {fileError}
                        </Typography>
                    )}

                    
                </Box>
            </Box>

            <Box sx={{ display: "flex", marginBottom: '20px', marginLeft: '100px', alignItems: 'center' }}>
                <Typography variant='h5'>NUEVO NOMBRE</Typography>
                <TextField
                    size="small"
                    label="Ingrese el nombre de la institución"
                    value={nombre}
                    onChange={handleNombreChange}
                    error={!!nombreError}
                    helperText={nombreError}
                    sx={{
                        width: "400px",
                        marginLeft: '20px',
                        '& .MuiInputBase-root': {
                            height: '39px',
                        },
                        fontSize: '15px',
                    }}
                />
            </Box>

            <Box sx={{ mt: '20px', ml: '500px',mb:'20px', mr: '500px', display: 'flex', justifyContent: "space-between" }}>
                <Button variant='outlined' onClick={redirectHomeAdmin} sx={{ width: '250px' }}>Cancelar</Button>
                <Button variant='contained' onClick={handleAceptar} sx={{ marginLeft:'40px',width: '250px' }}>Aceptar</Button>
            </Box>

        </Box>
    );
};

export default GestionPerfilInstitucion;
