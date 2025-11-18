# SIVE


Una herramienta digital que busca solucionar la detección tardía de problemas oculares en ingenieros de sistemas, ofreciendo una herramienta que permita identificar de forma temprana el desgaste visual ocasionado por el uso prolongado de pantallas y mostrar centros oftalmológicos según su ubicación, calidad de atención, precios y servicios.

# Caracteristicas

● Registro
● Inicio de sesion
● Examenes oculares(agudeza visual(test de snellen))
● Registro de opticas(nombre, ubicación, catalogo de servicios, productos)
● Aceptar y declinar opticas en base a su legalidad.
# Home

<img width="1567" height="734" alt="image" src="https://github.com/user-attachments/assets/d046d93c-a455-4c70-9fad-e63bf28f9de9" />
# Test

<img width="1552" height="689" alt="image" src="https://github.com/user-attachments/assets/8bbe823b-3f1a-48eb-838c-9868b859fab8" />
<img width="1570" height="573" alt="image" src="https://github.com/user-attachments/assets/438d6327-26df-4818-aba0-6e5a2050701b" />

# Links

*Frontend:* https://sive-00qf.onrender.com
*Backend:* https://backsive.onrender.com
# Stack tecnologico

|               | Tecnologias                     |
| ------------- | ------------------------------- |
| Front end     | React, typescript, vite, eslint |
| Backend       | Python, django                  |
| Base de datos | PostgreSQL                      |
| Despliegue    | Render.com                      |



# Prerequisitos

- Repositorio de backend: https://github.com/HarumiNULL/backSIVE.git
- Docker
- **Git** para el  control de versiones
- node.js

# inicio rapido

```bash
# Clone repository
git clone https://github.com/HarumiNULL/SIVE.git

# Instala dependencias
npm install

# Iniciar el servidor
npm run dev

```

El servidor corre en http://localhost:5173

### Configuracion del Backend

```
# Clone repository
git clone https://github.com/HarumiNULL/backSIVE.git
# # Crear entorno virtual 
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
#levantar la base de datos en docker
docker compose up -d

#haces las migraciones
py manage.py makemigrations
py manage.py migrate

# Instala las dependencias
pip install -r requirements.txt
# Inicia el servidor
py manage.py migrate
```

Application runs on `http://localhost:8000`

# Estructura generarl del proyecto

```
📦 SIVE/
├── public/                                   # Archivos públicos servidos por Vite
├── src/                                      # Código fuente principal del frontend React
│   ├── assets/                               # Imágenes y recursos usados dentro de componentes/páginas
│   ├── components/                           # Componentes reutilizables de la UI
│   ├── pages/                                 # Páginas completas del sistema
│   │   ├── Admin/                             # Vistas exclusivas para administrador
│   │   ├── opticalOwner/                      # Vistas para propietarios de ópticas
│   │   ├── user/                              # Páginas para usuarios normales
│   ├── services/                              # Llamadas a API y lógica de comunicación backend
│   ├── config.ts                              # Configuración del frontend (URL backend, llaves, etc.)
│   ├── main.tsx                               # Punto de entrada de React + Vite
│   ├── vite-env.d.ts                          # Tipados de Vite
│   ├── index.css                              # Estilos globales
│   └── App.css                                # Estilos del componente principal
├── index.html                                 # HTML base del proyecto Vite
├── package.json                               # Dependencias y scripts de frontend
├── package-lock.json                          # Resolución exacta de dependencias
├── vite.config.ts                             # Configuración de Vite
├── tsconfig.json                              # Config general de TypeScript
├── tsconfig.app.json                          # Config específico para React
├── tsconfig.node.json                         # Config para herramientas ejecutadas desde Node
├── eslint.config.js                           # Configuración de reglas ESLint
├── .gitignore                                 # Archivos ignorados por git
└── README.md                                  # Documentación del proyecto
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
