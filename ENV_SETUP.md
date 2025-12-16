# Configuración de Variables de Entorno

Para configurar la API, crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=192.168.1.22
DB_USER=root
DB_PASSWORD=
DB_NAME=fullcontrol
DB_PORT=3306

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Server URL
SERVER_URL=http://192.168.1.22:3000
```

## Instrucciones:

1. Copia el contenido anterior a un archivo `.env` en la raíz del proyecto
2. Ajusta los valores según tu configuración:
   - `DB_HOST`: Dirección IP o hostname de tu servidor MySQL
   - `DB_USER`: Usuario de MySQL
   - `DB_PASSWORD`: Contraseña de MySQL (deja vacío si no tiene)
   - `DB_NAME`: Nombre de la base de datos (debe ser `fullcontrol`)
   - `DB_PORT`: Puerto de MySQL (por defecto 3306)
   - `SERVER_URL`: URL completa del servidor (usado para generar rutas de imágenes)
   - `PORT`: Puerto en el que correrá la API (por defecto 3000)

## Notas:

- El archivo `.env` está en `.gitignore` y no se subirá al repositorio
- Asegúrate de que la base de datos MySQL esté creada y tenga los datos del archivo `BD.sql`
- El servidor MySQL debe estar accesible desde la red para que el frontend pueda conectarse

