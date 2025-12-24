-- Script para agregar campo BARCODE a la tabla productos
-- Este campo almacenará códigos de barras externos (EAN, UPC, etc.)

-- Verificar si la columna ya existe antes de agregarla
SET @dbname = DATABASE();
SET @tablename = "productos";
SET @columnname = "BARCODE";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(50) NULL AFTER PLU")
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar índice para búsquedas rápidas por código de barras
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = 'idx_barcode')
  ) > 0,
  "SELECT 1",
  CONCAT("CREATE INDEX idx_barcode ON ", @tablename, " (BARCODE)")
));

PREPARE createIndexIfNotExists FROM @preparedStatement2;
EXECUTE createIndexIfNotExists;
DEALLOCATE PREPARE createIndexIfNotExists;

-- Mensaje de confirmación
SELECT 'Campo BARCODE agregado exitosamente (si no existía)' AS Resultado;
