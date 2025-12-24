-- Script para eliminar el campo BARCODE de la tabla productos
-- Ejecuta este script para revertir los cambios

-- Eliminar el índice si existe
SET @dbname = DATABASE();
SET @tablename = "productos";
SET @indexname = "idx_barcode";

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = @indexname)
  ) > 0,
  CONCAT("DROP INDEX ", @indexname, " ON ", @tablename),
  "SELECT 1"
));

PREPARE dropIndexIfExists FROM @preparedStatement;
EXECUTE dropIndexIfExists;
DEALLOCATE PREPARE dropIndexIfExists;

-- Eliminar la columna BARCODE si existe
SET @columnname = "BARCODE";

SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  CONCAT("ALTER TABLE ", @tablename, " DROP COLUMN ", @columnname),
  "SELECT 1"
));

PREPARE dropColumnIfExists FROM @preparedStatement2;
EXECUTE dropColumnIfExists;
DEALLOCATE PREPARE dropColumnIfExists;

-- Mensaje de confirmación
SELECT 'Campo BARCODE eliminado exitosamente (si existía)' AS Resultado;
