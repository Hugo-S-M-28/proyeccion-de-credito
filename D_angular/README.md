# 🧠 Proyección de Crédito (Versión Angular)

![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue.svg?logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-21.2.7-DD0031.svg?style=flat&logo=angular&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF.svg?style=flat&logo=vite&logoColor=white)
![AnalogJS](https://img.shields.io/badge/AnalogJS-1.22.5-E01E5A.svg?style=flat&logo=analogue&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3.2.1-FCC72B.svg?style=flat&logo=vitest&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3.svg?style=flat&logo=bootstrap&logoColor=white)
![ExcelJS](https://img.shields.io/badge/ExcelJS-4.4.0-107C41.svg?style=flat&logo=microsoftexcel&logoColor=white)
![jsPDF](https://img.shields.io/badge/jsPDF-5.0.7-FF0000.svg?style=flat&logo=adobeacrobatreader&logoColor=white)

---

## 🧩 Visión General del Proyecto

**Proyección de Crédito** es una aplicación web financiera de alto rendimiento diseñada para simular préstamos de manera precisa, permitiendo a los usuarios analizar el comportamiento de sus créditos a lo largo del tiempo.

El sistema no solo es una calculadora básica, sino una **herramienta financiera completa** que permite introducir datos, calcular cuotas mensuales y explorar un desglose detallado de los pagos. Incorpora simulaciones avanzadas como **pagos extraordinarios**, lo que permite evaluar estrategias para reducir deuda, ahorrar intereses y acortar plazos para tomar decisiones informadas.

Diseñada con una estética **Premium Dark Mode** y principios de **Glassmorphism**, ofrece una experiencia de usuario moderna, fluida y profesional.

---

## 📋 Características Principales

* ✅ **Cálculo Financiero Avanzado:** Soporte para tasas anuales, IVA sobre intereses, comisiones de apertura y autorización.
* ✅ **Tablas de Amortización Detalladas:** Visualiza cómo se distribuyen los pagos entre capital e intereses en cada periodo.
* ✅ **Simulación de Pagos Extra:** Visualiza cuánto dinero y meses ahorras al realizar abonos adicionales recurrentes.
* ✅ **Interfaz Premium:** Diseño responsivo con temas oscuros, efectos de desenfoque (blur) y tipografía optimizada (Outfit).
* ✅ **Historial de Cálculos:** Acceso rápido a tus simulaciones anteriores mediante almacenamiento local persistente (LocalStorage).
* ✅ **Exportación Multiformato:** Generación de reportes profesionales en **PDF** y hojas de cálculo en **Excel (.xlsx)**.
* ✅ **Rendimiento Extremo:** Compilación ultra rápida gracias a la integración de **AnalogJS** y **Vite**.

---

## ⚙️ Enfoque Técnico y Arquitectura

El sistema está construido bajo una arquitectura moderna basada en componentes, optimizada para ofrecer un arranque casi instantáneo y recarga en caliente (HMR) ultrarrápida.

### 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **Angular** | Framework principal para la arquitectura de componentes. |
| **Vite** | Motor de desarrollo y bundler de última generación. |
| **AnalogJS**| Optimización del rendimiento y capacidades adicionales para Vite + Angular. |
| **TypeScript**| Superset de JavaScript que añade tipado estático funcional. |
| **Vitest** | Framework de pruebas unitarias de alta velocidad. |
| **Bootstrap** | Base para el layout responsivo y componentes UI. |
| **ExcelJS** | Motor para la creación de reportes financieros en Excel. |
| **jsPDF** | Generación de documentos PDF dinámicos junto a AutoTable. |

### 🏗️ Capas del Sistema

1. **Capa de Presentación (UI)** (`src/components/loan-calculator/`): Maneja la interacción, el formulario, la tabla y los estilos modernos.
2. **Capa de Lógica de Negocio** (`src/app/loan.service.ts`): Ejecuta cálculos financieros, procesa tasas, IVA y comisiones.
3. **Capa de Utilidades** (`src/utils/`):
    * `loanUtils.ts` → Funciones matemáticas de amortización.
    * `pdfUtils.ts` → Generación de reportes PDF.
    * `storageUtils.ts` → Persistencia en LocalStorage.

---

## 🧮 Flujo de Funcionamiento

El comportamiento del sistema sigue este proceso lógico:

1. **Entrada de Datos:** El usuario introduce monto, tasa anual, plazo y parámetros adicionales (IVA, comisiones, pagos extra).
2. **Procesamiento:** El sistema convierte la tasa a mensual, calcula la cuota fija y genera iterativamente el interés del mes, abono a capital y saldo restante.
3. **Generación de Resultados:** Se construye la tabla con número de periodo, pago total, interés, capital y saldo.
4. **Simulación Avanzada:** Si hay pagos extraordinarios, se recalculan los saldos dinámicamente para mostrar el ahorro en tiempo e intereses.
5. **Persistencia y Exportación:** Se guarda el historial en el navegador y permite exportar a PDF o Excel.

---

## 🗂️ Estructura del Proyecto

```plaintext
proyeccion-de-credito/
├── src/
│   ├── app/
│   │   ├── app.component.css                 # Estilos específicos del componente raíz
│   │   ├── app.component.html                # Plantilla del componente raíz
│   │   ├── app.component.spec.ts             # Pruebas unitarias del componente
│   │   ├── app.component.ts                  # Lógica del componente raíz
│   │   ├── app.config.ts                     # Configuración de la aplicación
│   │   ├── app.routes.ts                     # Definición de rutas (SPA)
│   │   ├── loan.service.spec.ts              # Pruebas unitarias del servicio
│   │   └── loan.service.ts                   # Cálculos financieros y gestión de datos
│   ├── assets/
│   │   ├── favicon.ico                        # Ícono de la aplicación
│   │   ├── Github.png                         # Ícono de GitHub para el footer
│   │   └── icons8-v1.png                      # Ícono informativo para tooltips
│   ├── components/
│   │   ├── loan-calculator.component.css      # Estilos específicos de la calculadora
│   │   ├── loan-calculator.component.html     # Plantilla del formulario y tabla
│   │   ├── loan-calculator.component.spec.ts  # Pruebas unitarias del componente
│   │   └── loan-calculator.component.ts       # Lógica de negocio y manejo de estado
│   ├── utils/
│   │   ├── loanUtils.ts                   # Matemáticas de amortización
│   │   ├── pdfUtils.ts                    # Generación de PDF
│   │   └── storageUtils.ts                # Manejo de LocalStorage
│   ├── index.html                             # Punto de entrada HTML
│   ├── main.ts                                # Inicialización de Angular
│   ├── styles.css                             # Estilos globales (Dark Mode, Glassmorphism)
│   └── test-setup.ts                          # Configuración de Vitest
├── .editorconfig                                # Configuración de EditorConfig
├── angular.json                                # Configuración CLI
├── package-lock.json                           # Configuración de AnalogJS
├── package.json                                # Dependencias y scripts
├── README.md                                   # Documentación
├── tsconfig.json                               # Configuración de TypeScript
└── vitest.config.ts                            # Configuración de pruebas
```

---

## 🔧 Instalación y Ejecución

1. **Clonar el Repositorio**

    ```bash
    git clone https://github.com/Hugo-S-M-28/proyeccion-de-credito.git
    ```

2. **Navegar al Directorio**

    ```bash
    cd proyeccion-de-credito
    ```

3. **Instalar Dependencias**

    ```bash
    npm install
    ```

4. **Iniciar Servidor**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:4200`.

---

## 🛠️ Comandos Útiles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Vite. |
| `npm run build` | Genera una compilación lista para producción en `dist/`. |
| `npm run preview` | Sirve la aplicación compilada localmente. |
| `ng generate` | Crea nuevos componentes, servicios o módulos. |
| `npm test` | Ejecuta pruebas unitarias con Vitest. |

---

## 🧪 Pruebas

El proyecto incluye pruebas unitarias para asegurar la correctitud en cálculos financieros y la estabilidad del sistema:

* **Vitest** como motor de pruebas.
* Archivos `.spec.ts` integrados en componentes y servicios.

---

## 💻 Uso

1. **Ingresar Datos:** Completa el formulario con monto, tasa y plazo.
2. **Generar Amortización:** Presiona "Calcular" para procesar la información.
3. **Explorar Resultados:** Revisa el desglose detallado en la tabla generada.
4. **Exportar:** Guarda tus resultados en PDF o Excel para referencia futura.

---

## 🌐 Créditos y Contacto

¡Las contribuciones son bienvenidas! Desarrollado con ❤️ por **Sánchez Milán Hugo**.

* **LinkedIn:** [Hugo Sánchez Milán](https://www.linkedin.com/in/hugo-s-197b81278/)
* **GitHub:** [Hugo-S-M-28](https://github.com/Hugo-S-M-28)

## 📚 Recursos Adicionales

* [Documentación de Angular](https://angular.io/docs)
* [Guía de Vite](https://vitejs.dev/guide/)
* [Bootstrap Docs](https://getbootstrap.com/)
