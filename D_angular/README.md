# Proyección de Crédito

## Descripción
**Proyección de Crédito** es una aplicación web interactiva que permite a los usuarios calcular y generar tablas de amortización de préstamos de manera sencilla y eficiente. Introduce los datos de tu préstamo, calcula las cuotas mensuales y explora un desglose detallado de los pagos a lo largo del tiempo.

---
## 📋 **Características**

- ✅ **Cálculo Preciso:** Genera tablas de amortización basadas en montos, tasas de interés y plazos definidos.
- ✅ **Interfaz Intuitiva:** Fácil de usar y diseñada para ofrecer una experiencia agradable.
- ✅ **Rendimiento Óptimo:** Aprovecha las capacidades de **Angular** y **Vite** para máxima velocidad y rendimiento.
- ✅ **Diseño Responsivo:** Perfectamente adaptado para dispositivos móviles, tabletas y computadoras.
- ✅ **Exportación de Resultados:** Guarda los cálculos en formatos compatibles para referencias futuras.

---
## 🚀 **Tecnologías Utilizadas**

| Tecnología   | Descripción                                                                                  |
|--------------|----------------------------------------------------------------------------------------------|
| **Angular**  | Framework principal para construir la aplicación.                                           |
| **Vite**     | Herramienta moderna para un desarrollo rápido y una compilación optimizada.                 |
| **TypeScript** | Lenguaje tipado para mayor robustez y mantenibilidad del código.                          |
| **HTML5**    | Estructura semántica del contenido.                                                         |
| **CSS3**     | Diseño visual y adaptativo para una mejor experiencia de usuario.                           |
| **Bootstrap**| Framework de diseño para un desarrollo rápido y responsivo.                                 |

---
## 🗂️ **Estructura del Proyecto**

```plaintext
Proyeccion-De-Credito/
├── src/
│   ├── app/
│   │   ├── loan-calculator/
│   │   │   ├── loan-calculator.component.css       # Estilos del componente
│   │   │   ├── loan-calculator.component.html      # Plantilla HTML
│   │   │   ├── loan-calculator.component.spec.ts   # Pruebas unitarias
│   │   │   ├── loan-calculator.component.ts        # Lógica del componente
│   │   ├── app.component.css                       # Estilos globales del app root
│   │   ├── app.component.html                      # Plantilla del componente raíz
│   │   ├── app.component.ts                        # Lógica del componente raíz
│   │   ├── app.routes.ts                           # Configuración de rutas
│   │   ├── loan.service.ts                         # Servicio para lógica compartida
│   ├── assets/
│   │   ├── favicon.ico                             # Ícono de la aplicación
│   ├── index.html                                  # Entrada principal de la aplicación
│   ├── main.ts                                     # Punto de inicio de Angular
│   ├── styles.css                                  # Estilos globales
├── angular.json                                    # Configuración principal de Angular
├── vite.config.ts                                  # Configuración para Vite
├── package.json                                    # Dependencias y scripts
├── tsconfig.json                                   # Configuración de TypeScript
```

---
## 🔧 **Instalación y Configuración**

Sigue estos pasos para ejecutar la aplicación localmente:

### 1️⃣ **Clonar el Repositorio**
```bash
git clone https://github.com/Hugo-S-M-28/proyeccion-de-credito.git
```

### 2️⃣ **Navegar al Directorio**
```bash
cd proyeccion-de-credito
```

### 3️⃣ **Instalar Dependencias**
Asegúrate de tener [Node.js](https://nodejs.org/) instalado, luego ejecuta:
```bash
npm install
```

### 4️⃣ **Ejecutar el Servidor**
Inicia el servidor de desarrollo con Vite:
```bash
npm run dev
```

Abre tu navegador y accede a `http://localhost:5173` para ver la aplicación.

---
## 🛠️ **Comandos Útiles**

| Comando               | Descripción                                                     |
|-----------------------|-----------------------------------------------------------------|
| `npm run dev`         | Inicia el servidor de desarrollo con Vite.                     |
| `npm run build`       | Genera una compilación lista para producción en `dist/`.       |
| `npm run preview`     | Sirve la aplicación compilada para pruebas locales.            |
| `ng generate`         | Genera nuevos componentes, servicios, módulos, etc.           |
| `ng test`             | Ejecuta pruebas unitarias con [Karma](https://karma-runner.github.io). |
| `ng e2e`              | Realiza pruebas end-to-end para la aplicación.                 |

---
## 💻 **Uso**

1. **Ingresar Datos:**  
   Completa el formulario con:
   - Monto del préstamo.
   - Tasa de interés anual.
   - Plazo en meses.

2. **Generar Amortización:**  
   Presiona el botón "Calcular" para generar la tabla de amortización.

3. **Explorar Resultados:**  
   Visualiza el desglose de cada pago con detalles de capital, intereses y saldo.

4. **Exportar Resultados:**  
   Guarda los resultados en un archivo para referencia futura.

---
## 🌐 **Contacto**

¡Las contribuciones son bienvenidas! Si tienes preguntas o sugerencias, no dudes en contactarme:

- **LinkedIn:** [Hugo Sánchez Milán](https://www.linkedin.com/in/hugo-s-197b81278/)
- **GitHub:** [Hugo-S-M-28](https://github.com/Hugo-S-M-28)

---
## 📚 **Recursos Adicionales**

Para obtener más ayuda sobre Angular CLI, usa `ng help` o visita la 

- [Descripción general de Angular CLI y referencia de comandos](https://angular.io/cli).
- [Documentación de Angular](https://angular.io/docs)
- [Guía de Vite](https://vitejs.dev/guide/)
- [Bootstrap Docs](https://getbootstrap.com/)
---
