"use client";
import { PersonaProvider } from './PersonaContext.js';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../utils/theme.js';
import { CursosAdicionalesProvider } from './CursosAdicionalesContext.js';
import { RolProvider } from './RolContext.js';
import { UsuarioProvider } from './UsuarioContext.js';
import { DepartamentoProvider } from './DepartamentoContext.js';
import { SeccionProvider } from './SeccionContext.js';
import { SemestreProvider } from './SemestreContext.js';
import { EncuestaProvider } from './EncuestaContext.js';
import { InstitucionProvider } from './InstitucionContext.js';
import { EspecialidadProvider } from './EspecialidadContext.js';
import { FacultadProvider } from './FacultadContext.js';
import { ConvocatoriaProvider } from './convocatoriaContext.js';
import { PreguntaFrecuenteProvider } from './PreguntaFrecuenteContext.js';
import { CursoxPlanDeEstudioProvider } from './CursoxPlanDeEstudioContext.js';
import { HorarioxCursoProvider } from './HorarioxCursoContext.js';
import { PedidoCursoProvider } from './PedidoCursoContext.js';
import { UnidadProvider } from './UnidadContex.js';
import { AlumnoxHorarioProvider } from './AlumnoxHorarioContext.js';
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Esto asegura que los estilos base de Material UI se apliquen */}
          <InstitucionProvider>
            <PersonaProvider>
              <CursosAdicionalesProvider>
                <RolProvider>
                  <UsuarioProvider>
                    <DepartamentoProvider>
                      <FacultadProvider>
                        <EspecialidadProvider>
                          <SeccionProvider>
                            <SemestreProvider>
                              <EncuestaProvider>
                                <PreguntaFrecuenteProvider>
                                  <ConvocatoriaProvider>
                                    <CursoxPlanDeEstudioProvider>
                                      <HorarioxCursoProvider>
                                        <PedidoCursoProvider>
                                          <UnidadProvider> 
                                        {children} {/* Aquí va el layout para todas las páginas */} 
                                          </UnidadProvider>
                                        </PedidoCursoProvider>
                                      </HorarioxCursoProvider>
                                    </CursoxPlanDeEstudioProvider>
                                  </ConvocatoriaProvider>
                                </PreguntaFrecuenteProvider>
                              </EncuestaProvider>
                            </SemestreProvider>
                          </SeccionProvider>
                        </EspecialidadProvider>
                      </FacultadProvider>
                    </DepartamentoProvider>
                  </UsuarioProvider>
                </RolProvider>
              </CursosAdicionalesProvider>
            </PersonaProvider>
          </InstitucionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
