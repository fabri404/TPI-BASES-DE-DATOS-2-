
#!/usr/bin/env bash
set -euo pipefail

# Ejecutar desde cualquier ubicación dentro del proyecto.
cd "$(dirname "$0")"

# Cargar la URI desde el archivo .env sin mostrarla.
if [[ ! -f .env ]]; then
  echo "Error: no se encontró el archivo .env"
  exit 1
fi

MONGODB_URI=$(
  grep -m 1 '^MONGODB_URI=' .env |
  cut -d '=' -f 2-
)

if [[ -z "${MONGODB_URI}" ]]; then
  echo "Error: MONGODB_URI no está configurada"
  exit 1
fi

# Crear carpeta principal y subcarpeta con fecha actual.
FECHA=$(date +%F)
DESTINO="resguardos_tpi/${FECHA}"

mkdir -p "$DESTINO"

# Exportar la base remota de Atlas.
mongodump \
  --uri="$MONGODB_URI" \
  --db="TPI_Vinoteca" \
  --out="$DESTINO"

echo "Respaldo completado en: $DESTINO"
