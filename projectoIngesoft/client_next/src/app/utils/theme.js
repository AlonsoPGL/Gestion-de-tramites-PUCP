import { createTheme } from '@mui/material/styles';

// Define los tokens de colores
const tokens = {
  primary: {
    main: '#363581', // Color principal
    light: '#5D71BC', // Variante más clara
    dark: '#1565c0', // Variante más oscura
    contrastText: '#fff', // Texto que contraste sobre el color primario
  },
  secondary: {
    main: '#9c27b0', // Color secundario
    // Otros colores secundarios
  },
  // Otros colores como background, error, etc.
};

// Crear el tema usando los tokens
const theme = createTheme({
  palette: {
    primary: {
      main: tokens.primary.main,
      light: tokens.primary.light,
      dark: tokens.primary.dark,
      contrastText: tokens.primary.contrastText,
    },
    secondary: {
      main: tokens.secondary.main,
    },
    // Puedes definir más colores aquí (error, warning, info, etc.)
  },
});

export default theme;
