#!/usr/bin/env node

// Proxy temporal para mantener compatibilidad y centralizar el nuevo nombre del binario
// Carga el script principal (antiguo nombre) mientras migramos referencias internas.
require('./yoo2back.js');
