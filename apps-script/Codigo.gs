/**
 * Curso Cadiem 2026 · registro de resultados de las evaluaciones.
 *
 * Va en la planilla "Resultados Curso Cadiem 2026" de cursocadiem@gmail.com
 * (Extensiones → Apps Script). Se publica como aplicación web:
 * Ejecutar como "Yo" · Acceso "Cualquier persona".
 * Cada envío de la página agrega una fila a la hoja "Resultados".
 */
const HOJA = 'Resultados';
const COLUMNAS = ['Fecha y hora', 'Nombre', 'Email', 'Tema', 'Correctas', 'Total', 'Porcentaje', 'Detalle', 'ID'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const hoja = obtenerHoja_();
    // Evita filas duplicadas si el alumno toca el botón dos veces
    const ultima = hoja.getLastRow();
    if (ultima > 1) {
      const ids = hoja.getRange(2, 9, ultima - 1, 1).getValues().flat();
      if (ids.indexOf(d.id) !== -1) return respuesta_({ ok: true, duplicado: true });
    }
    hoja.appendRow([
      new Date(), limpiar_(d.nombre), limpiar_(d.email), limpiar_(d.tema),
      Number(d.correctas) || 0, Number(d.total) || 0, (Number(d.porcentaje) || 0) / 100,
      limpiar_(d.detalle), limpiar_(d.id)
    ]);
    hoja.getRange(hoja.getLastRow(), 7).setNumberFormat('0%');
    return respuesta_({ ok: true });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Para probar que la aplicación web está publicada: abrir la URL en el navegador. */
function doGet() {
  return respuesta_({ ok: true, servicio: 'Resultados Curso Cadiem 2026' });
}

function obtenerHoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(HOJA);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA);
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#0c2e4e').setFontColor('#ffffff');
    hoja.setColumnWidth(8, 420);
  }
  return hoja;
}

/** Evita que un texto que empieza con = + - @ se interprete como fórmula. */
function limpiar_(v) {
  const s = String(v == null ? '' : v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
