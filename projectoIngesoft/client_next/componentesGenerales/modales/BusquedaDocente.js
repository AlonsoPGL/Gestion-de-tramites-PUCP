import { Modal,Button ,Backdrop} from "@mui/material";
import Box from '@mui/material/Box';
import TablaBusquedaDocentes from "componentesAlumno/solicitudDeTemaTesis/TablaBusquedaDocentes";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #8a8a8a',
    boxShadow: 13,
    p: 4,
  };

const BusquedaDocente = ({ open, onClose, alumnos,setAlumnos}) => {
    return (
    <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slots={{
            backdrop: Backdrop  // Define Backdrop aquí con la nueva propiedad 'slots.backdrop'
        }}
        slotProps={{
            backdrop: {
                sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } // Ajusta la opacidad del fondo
            }
        }}
        >
        <Box sx={style}>
            <Box>
                <TablaBusquedaDocentes onClose={onClose} alumnosBase={alumnos} setAlumnos={setAlumnos}></TablaBusquedaDocentes>
            </Box>
            <Box sx={{mt:'20px',ml:'10px',mr:'10px',display:'flex',justifyContent: "center"}}>
                <Button variant='outlined' onClick={onClose} sx={{ width:'170px'}}>Aceptar</Button>
            </Box>
        </Box>
    </Modal>
    );
};

export default BusquedaDocente;
