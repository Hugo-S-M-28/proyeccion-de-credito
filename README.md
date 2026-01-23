# Proyección de Crédito (Calculadora Financiera Pro)

## 📄 Descripción
**Proyección de Crédito** es una aplicación web profesional desarrollada en **React** que permite a los usuarios simular préstamos, calcular tablas de amortización detalladas y visualizar costos financieros. Diseñada para ser intuitiva y poderosa, incluye capacidades avanzadas como abonos extra a capital, gráficos interactivos y exportación de reportes formales.

---
## ✨ **Características Principales**

- 🧮 **Cálculo Avanzado:** Simulación precisa con capital, tasa anual, plazo y comisiones (Apertura/Investigación).
- 📅 **Proyección Real:** Selección de fecha de inicio y cálculo automático de la fecha de término estimada.
- 💰 **Abonos a Capital:** Funcionalidad para simular pagos extra mensuales, mostrando automáticamente el ahorro en tiempo e intereses.
- 📊 **Visualización Interactiva:** Gráficos dinámicos (Dona) para entender el desglose del costo (Capital vs Intereses vs IVA).
- 💾 **Historial Automático:** Persistencia de datos local. La aplicación guarda tus últimos cálculos para consulta rápida.
- 📉 **Exportación Profesional:**
  - **Excel (.xlsx):** Tabla de amortización completa.
  - **PDF (.pdf):** Reporte formal con resumen ejecutivo y cronograma de pagos.

---
## 🚀 **Tecnologías Utilizadas**

El proyecto ha sido modernizado utilizando las últimas herramientas de desarrollo web:

| Tecnología | Propósito |
|------------|-----------|
| **React 18** | Biblioteca principal de interfaz de usuario. |
| **Vite** | Entorno de desarrollo ultrarrápido y bundler. |
| **TypeScript** | Seguridad de tipos y robustez en la lógica financiera. |
| **Chart.js** | Renderizado de gráficos estadísticos. |
| **ExcelJS** | Generación de archivos Excel en el navegador. |
| **jsPDF** | Generación de reportes PDF profesionales. |
| **CSS3** | Diseño responsivo con variables CSS y estilo Glassmorphism. |

---
## 🗂️ **Estructura del Proyecto**

```plaintext
proyeccion-de-credito/
├── src/
│   ├── components/
│   │   ├── LoanCalculator.tsx      # Componente principal de la calculadora
│   │   ├── LoanCalculator.css      # Estilos modernos del componente
│   ├── utils/
│   │   ├── loanUtils.ts            # Motor de cálculo financiero (Amortización)
│   │   ├── pdfUtils.ts             # Generador de reportes PDF
│   │   ├── storageUtils.ts         # Manejo de persistencia (LocalStorage)
│   ├── App.tsx                     # Componente raíz
│   ├── main.tsx                    # Punto de entrada
├── public/                         # Assets estáticos
├── index.html                      # HTML base
├── vite.config.ts                  # Configuración de Vite
└── package.json                    # Dependencias
```

---
## 🔧 **Instalación y Uso**

Sigue estos pasos para ejecutar la aplicación en tu entorno local:

### 1️⃣ **Clonar el Repositorio**
```bash
git clone https://github.com/Hugo-S-M-28/proyeccion-de-credito.git
```

### 2️⃣ **Instalar Dependencias**
```bash
cd proyeccion-de-credito
npm install
```

### 3️⃣ **Ejecutar en Desarrollo**
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

### 4️⃣ **Construir para Producción**
```bash
npm run build
```

---
## 🌐 **Contacto**

- **Desarrollador:** Hugo Sánchez Milán
- **GitHub:** [Hugo-S-M-28](https://github.com/Hugo-S-M-28)
- **LinkedIn:** [Hugo Sánchez Milán](https://www.linkedin.com/in/hugo-s-197b81278/)

## 📚 **Recursos Adicionales**

Para obtener más ayuda sobre React 18 y Vite , consulta sus respectivas documentaciones oficiales:

- [React 18](https://reactjs.org/docs/getting-started.html)
- [Vite](https://vite.dev/guide/)
