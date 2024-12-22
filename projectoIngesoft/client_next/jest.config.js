// jest.config.js
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Asegúrate de que la ruta coincida con tu estructura de carpetas
    },
    globals: {
      HTMLCanvasElement: class {
        getContext() {
          return {}; // Simular el contexto de Canvas si es necesario
        }
      },
    },
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest', // Asegúrate de que Babel transpile correctamente tu código
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'], // Agrega extensiones de archivos si es necesario
};
