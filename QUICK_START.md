# Guía de Inicio Rápido - FullControl API

## Pasos para ejecutar la API

### 1. Instalar dependencias
```bash
cd FullControl-api-node
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
PORT=3000
NODE_ENV=development
DB_HOST=192.168.1.24
DB_USER=root
DB_PASSWORD=
DB_NAME=fullcontrol
DB_PORT=3306
SERVER_URL=http://192.168.1.24:3000
```

**Importante:** Ajusta los valores según tu configuración de MySQL.

### 3. Verificar la base de datos
Asegúrate de que:
- La base de datos `fullcontrol` esté creada en MySQL
- Los datos del archivo `BD.sql` estén importados
- El servidor MySQL esté corriendo y accesible

### 4. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

### 5. Verificar que la API esté funcionando
Abre tu navegador o usa curl:
```bash
curl http://192.168.1.24:3000/api/health
```

Deberías recibir una respuesta:
```json
{
  "status": "OK",
  "message": "API is running"
}
```

## Configurar el Frontend

Para que el frontend se conecte a esta API, necesitas actualizar la configuración:

1. Edita el archivo `FullControl-front/src/app/assets/config.ts`:
```typescript
export const IP = '192.168.1.24:3000';
```

2. **Importante:** Los servicios del frontend esperan que la API esté en:
   - `http://192.168.1.24:3000/api/...`

   Pero el frontend actualmente usa:
   - `http://${IP}/Software_FullControl/FullControl_System/public/api/...`

   **Tienes dos opciones:**

   **Opción A:** Modificar el frontend para que use la nueva API (recomendado)
   - Actualiza las URLs en los servicios para que apunten a `http://192.168.1.24:3000/api/...`

   **Opción B:** Configurar un proxy o modificar las rutas de la API para que coincidan con las del frontend

## Endpoints Disponibles

### Materials
- `GET /api/materials/materials` - Obtener todos los materiales
- `GET /api/materials/buscarpornombre/:name` - Buscar materiales
- `POST /api/materials/insert` - Crear material
- `PUT /api/materials/update/:id` - Actualizar material
- `DELETE /api/materials/delete/:id` - Eliminar material
- `POST /api/materials/subirImagen` - Subir imagen

### Orders
- `GET /api/orders/orders` - Obtener órdenes no terminadas
- `GET /api/orders/all` - Obtener todas las órdenes
- `GET /api/orders/getFinished` - Obtener órdenes terminadas
- `GET /api/orders/getNotFinished` - Obtener órdenes pendientes
- `POST /api/orders/insert` - Crear orden
- `PUT /api/orders/update/:id` - Actualizar orden
- `POST /api/orders/finish/:id` - Terminar orden
- `POST /api/orders/notfinish/:id` - Dejar orden pendiente
- `DELETE /api/orders/delete/:id` - Eliminar orden
- `POST /api/orders/cobrar/:id` - Cobrar orden

### Productos
- `GET /api/Productos` - Obtener todos los productos
- `GET /api/ProductoPLU/:plu` - Obtener producto por PLU
- `GET /api/ProductoNombre/:name` - Buscar productos
- `POST /api/InsertarProducto` - Crear producto
- `PUT /api/actualizar/:id` - Actualizar producto
- `DELETE /api/eliminar/:id` - Eliminar producto
- `POST /api/Producto/ActualizarIMG` - Subir imagen
- `POST /api/cobrar/:id/:unidades` - Cobrar producto

### Services
- `GET /api/services/all` - Obtener todos los servicios
- `GET /api/services/findbyid/:id` - Obtener servicio por ID
- `GET /api/services/findbyname/:name` - Buscar servicios
- `POST /api/services/insert` - Crear servicio
- `PUT /api/services/update/:id` - Actualizar servicio
- `DELETE /api/services/delete/:id` - Eliminar servicio
- `POST /api/services/subirImagen` - Subir imagen
- `POST /api/services/cobrar/:id` - Cobrar servicio

### Ventas
- `GET /api/Ventas` - Obtener todas las ventas

## Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Verifica las credenciales en el archivo `.env`
- Verifica que la base de datos `fullcontrol` exista
- Verifica que el servidor MySQL permita conexiones desde la red

### Error al subir imágenes
- Verifica que la carpeta `uploads/` exista y tenga permisos de escritura
- Verifica que el tamaño del archivo no exceda 5MB
- Verifica que el archivo sea una imagen (jpeg, jpg, png, gif, webp, jfif)

### Error 404 en endpoints
- Verifica que las rutas en el frontend coincidan con las de la API
- Verifica que el servidor esté corriendo en el puerto correcto
- Verifica la configuración de CORS

## Notas Adicionales

- Las imágenes subidas están disponibles en: `http://SERVER_URL/uploads/filename`
- La API usa CORS para permitir solicitudes desde el frontend
- Los errores se registran en la consola del servidor
- La API está diseñada para trabajar con la estructura de base de datos existente

