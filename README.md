# FullControl API

API REST desarrollada con Node.js y Express para el sistema FullControl.

## Requisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio o navegar a la carpeta del proyecto:
```bash
cd FullControl-api-node
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus credenciales de base de datos:
```env
DB_HOST=192.168.1.24
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=fullcontrol
DB_PORT=3306
SERVER_URL=http://192.168.1.24:3000
```

5. Asegurarse de que la base de datos MySQL esté creada y tenga los datos necesarios (ver BD.sql)

## Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor se ejecutará en el puerto especificado en el archivo `.env` (por defecto 3000).

## Estructura del Proyecto

```
FullControl-api-node/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de la base de datos
│   ├── controllers/
│   │   ├── materialController.js
│   │   ├── orderController.js
│   │   ├── productoController.js
│   │   ├── serviceController.js
│   │   └── ventaController.js
│   ├── models/
│   │   ├── Material.js
│   │   ├── Order.js
│   │   ├── Producto.js
│   │   ├── Service.js
│   │   └── Venta.js
│   ├── routes/
│   │   ├── materialRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productoRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── ventaRoutes.js
│   └── middleware/
│       ├── upload.js            # Configuración de Multer
│       └── errorHandler.js      # Manejo de errores
├── uploads/                     # Directorio para archivos subidos
├── server.js                    # Archivo principal del servidor
├── package.json
├── .env.example
└── README.md
```

## Endpoints de la API

### Materials
- `GET /api/materials/materials` - Obtener todos los materiales
- `GET /api/materials/buscarpornombre/:name` - Buscar materiales por nombre
- `POST /api/materials/insert` - Crear material
- `PUT /api/materials/update/:id` - Actualizar material
- `DELETE /api/materials/delete/:id` - Eliminar material
- `POST /api/materials/subirImagen` - Subir imagen de material

### Orders
- `GET /api/orders/orders` - Obtener órdenes no terminadas
- `GET /api/orders/all` - Obtener todas las órdenes
- `GET /api/orders/getFinished` - Obtener órdenes terminadas
- `GET /api/orders/getNotFinished` - Obtener órdenes no terminadas
- `POST /api/orders/insert` - Crear orden
- `PUT /api/orders/update/:id` - Actualizar orden
- `POST /api/orders/finish/:id` - Terminar orden
- `POST /api/orders/notfinish/:id` - Dejar orden pendiente
- `DELETE /api/orders/delete/:id` - Eliminar orden
- `POST /api/orders/cobrar/:id` - Cobrar orden

### Productos
- `GET /api/Productos` - Obtener todos los productos
- `GET /api/ProductoPLU/:plu` - Obtener producto por PLU
- `GET /api/ProductoNombre/:name` - Buscar productos por nombre
- `POST /api/InsertarProducto` - Crear producto
- `PUT /api/actualizar/:id` - Actualizar producto
- `DELETE /api/eliminar/:id` - Eliminar producto
- `POST /api/Producto/ActualizarIMG` - Subir imagen de producto
- `POST /api/cobrar/:id/:unidades` - Cobrar producto

### Services
- `GET /api/services/all` - Obtener todos los servicios
- `GET /api/services/findbyid/:id` - Obtener servicio por ID
- `GET /api/services/findbyname/:name` - Buscar servicios por nombre
- `POST /api/services/insert` - Crear servicio
- `PUT /api/services/update/:id` - Actualizar servicio
- `DELETE /api/services/delete/:id` - Eliminar servicio
- `POST /api/services/subirImagen` - Subir imagen de servicio
- `POST /api/services/cobrar/:id` - Cobrar servicio

### Ventas
- `GET /api/Ventas` - Obtener todas las ventas

## Configuración del Frontend

Para que el frontend se conecte a esta API, actualiza el archivo de configuración del frontend (`FullControl-front/src/app/assets/config.ts`) con la URL del servidor:

```typescript
export const IP = '192.168.1.24:3000';
```

Y actualiza las URLs en los servicios del frontend para que apunten a:
- `http://192.168.1.24:3000/api/...`

## Notas

- Las imágenes subidas se guardan en la carpeta `uploads/` y son accesibles mediante la URL: `http://SERVER_URL/uploads/filename`
- La base de datos debe tener los triggers configurados para calcular automáticamente la ganancia de los productos
- Asegúrate de que el servidor MySQL esté corriendo y accesible desde la red

## Licencia

ISC

