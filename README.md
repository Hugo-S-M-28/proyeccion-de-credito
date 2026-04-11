# Proyección de Crédito (Calculadora Financiera Pro)

![React](https://img.shields.io/badge/React-18.2.0-blue.svg?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3.2-646CFF.svg?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg?logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.1-FF6384.svg?logo=chartdotjs&logoColor=white)
![ExcelJS](https://img.shields.io/badge/ExcelJS-4.4.0-107C41.svg?style=flat&logo=microsoftexcel&logoColor=white)
![jsPDF](https://img.shields.io/badge/jsPDF-5.0.7-FF0000.svg?style=flat&logo=adobeacrobatreader&logoColor=white)

## 🧩 Visión General del Proyecto

**Proyección de Crédito** es una aplicación web financiera de alto rendimiento diseñada para simular préstamos de manera precisa, permitiendo a los usuarios analizar el comportamiento de sus créditos a lo largo del tiempo.

El sistema no solo es una calculadora básica, sino una **herramienta financiera completa** que permite introducir datos, calcular cuotas mensuales y explorar un desglose detallado de los pagos. Incorpora simulaciones avanzadas como **pagos extraordinarios**, lo que permite evaluar estrategias para reducir deuda, ahorrar intereses y acortar plazos para tomar decisiones informadas.

Diseñada con una estética **Premium Dark Mode** y principios de **Glassmorphism**, ofrece una experiencia de usuario moderna, fluida y profesional.

---

## ✨ Características Principales

* 🧮 **Cálculo Financiero Exacto:** Soporte para capital, tasa anual, plazos, IVA sobre intereses y cálculo de comisiones (apertura y autorización).
* 💰 **Simulación de Pagos Extra:** Ingresa abonos mensuales adicionales y el sistema recalculará automáticamente la tabla, mostrando una insignia de trofeo con el **ahorro en dinero y tiempo exacto**.
* 📊 **Desglose Gráfico Interactivo:** Un gráfico de dona dinámico separa visualmente el crédito en 3 segmentos clave: **Capital (Azul), Interés (Verde) e IVA (Ámbar)**, con porcentajes exactos.
* 📋 **Tablas de Amortización Detalladas:** Visualiza cómo se distribuyen los pagos entre capital e intereses en cada periodo.
* 💾 **Historial Persistente:** Acceso rápido a simulaciones anteriores guardadas automáticamente en el LocalStorage del navegador.
* 📉 **Exportación Profesional Multiformato:** Descarga los resultados al instante en documentos **PDF** de alta calidad (jsPDF) o en hojas de cálculo de **Excel .xlsx** con celdas pre-formateadas (ExcelJS).

---

## ⚙️ Arquitectura y Tecnologías

El sistema está construido bajo una arquitectura moderna basada en componentes, combinando el estado reactivo con un motor de lógica matemática puro, asegurando mantenibilidad y testing fácil.

| Tecnología | Propósito |
| :--- | :--- |
| **React 18** | Biblioteca base y gestión de estado reactivo mediante hooks (`useState`, `useEffect`). |
| **Vite** | Entorno de desarrollo con HMR instantáneo y build ultrarrápido optimizado. |
| **TypeScript** | Interfaces estrictas (`LoanParams`, `AmortizationResult`) para la seguridad de tipos financieros. |
| **Chart.js** | Motor de renderizado en Canvas para la gráfica de distribución porcentual de los pagos. |
| **ExcelJS & jsPDF** | Generación de reportes tabulares pesados procesados directamente en el lado del cliente (Navegador). |
| **Vanilla CSS Premium** | Diseño a la medida utilizando flexbox, grid, animaciones fluidas y técnicas de Glasscard (cristal). |

---

## 🧮 Flujo de Funcionamiento

El comportamiento del sistema sigue este proceso lógico:

1. **Entrada de Datos:** El usuario introduce monto, tasa anual, plazo y parámetros adicionales (IVA, comisiones, pagos extra).
2. **Procesamiento:** El sistema convierte la tasa a mensual, calcula la cuota fija y genera iterativamente el interés del mes, abono a capital y saldo restante.
3. **Generación de Resultados:** Se construye la tabla con número de periodo, pago total, interés, capital y saldo.
4. **Simulación Avanzada:** Si hay pagos extraordinarios, se recalculan los saldos dinámicamente para mostrar el ahorro en tiempo e intereses.
5. **Persistencia y Exportación:** Se guarda el historial en el navegador y permite exportar a PDF o Excel.

---

### 🗂️ Estructura del Código Fuente

```plaintext
proyeccion-de-credito/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Encabezado visual
│   │   ├── Footer.tsx              # Pie de página y enlaces
│   │   ├── LoanCalculator.tsx      # Lógica de contenedor (Estado principal UI)
│   │   ├── LoanCalculatorUI.tsx    # Presentación pura (Formulario, Tablas, Gráficas)
│   │   └── LoanCalculator.css      # Estética principal del Glassmorphism
│   ├── utils/
│   │   ├── loanUtils.ts            # Motor matemático (Interés compuesto, tablas)
│   │   ├── pdfUtils.ts             # Motor de renderizado en PDF
│   │   └── storageUtils.ts         # Adaptador para el LocalStorage
│   ├── App.tsx                     # Orquestador del Layout
│   └── main.tsx                    # Punto de inyección de React
├── vite.config.ts                  # Configuración de compilación 
└── package.json                    # Dependencias
```

---

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para ejecutar la aplicación en tu máquina local:

### 1️⃣ Clonar el Repositorio

```bash
git clone -b main https://github.com/Hugo-S-M-28/proyeccion-de-credito.git
```

### 2️⃣ Instalar las Dependencias

```bash
cd proyeccion-de-credito
npm install
```

### 3️⃣ Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible instantáneamente en tu navegador local (usualmente en `http://localhost:5173` o `http://localhost:5174`).

### 4️⃣ Compilar para Producción

```bash
npm run build
```

---

## 💻 Guía de Uso Rápida

1. **Datos del Préstamo:** Llena el monto, tasa de interés anual y el plazo esperado (ej. $255,000 al 20% a 12 meses).
2. **Aplica extras (Opcional):** Si lo deseas, agrega un monto en "Abono Extra Mensual".
3. **Calcula:** Observa las tarjetas resumen que consolidan tu "Mensualidad fija", "Interés Total" e "IVA".
4. **Desglose:** Analiza la gráfica de dona y el listado porcentual a la derecha, para saber exactamente en qué se divide el costo de tu crédito.
5. **Revisa la Tabla:** Desplázate a través de la tabla de amortización para ver el estatus de tu deuda mes a mes.
6. **Exporta:** Emite los detalles como PDF o archivo Excel (.xlsx) para guardarlos o compartirlos formalmente.

---

## 🌐 Créditos y Contacto

Desarrollado con un alto enfoque en experiencia de usuario y código limpio por **Hugo Sánchez Milán**.
¡Las contribuciones, sugerencias y aportes son siempre bienvenidos!

* **GitHub:** [@Hugo-S-M-28](https://github.com/Hugo-S-M-28)
* **LinkedIn:** [Hugo Sánchez Milán](https://www.linkedin.com/in/hugo-s-197b81278/)

## 📚 Recursos Adicionales

* [React 18 Docs](https://reactjs.org/docs/getting-started.html)
* [Vite Guide](https://vite.dev/guide/)
