/**
 * Abre el cuadro "Guardar como" del sistema (Chrome, Edge, Opera) cuando exista
 * `window.showSaveFilePicker`. Si no (p. ej. Firefox), descarga con nombre sugerido.
 */
export type SaveFileAsResult = 'saved' | 'cancelled' | 'fallback'

export type SaveFileAsOptions = {
  suggestedName?: string
  /** Descripción del tipo en el selector de archivos */
  typeDescription?: string
}

type WindowWithSavePicker = Window & {
  showSaveFilePicker?: (opts?: {
    suggestedName?: string
    types?: Array<{ description: string; accept: Record<string, string[]> }>
  }) => Promise<FileSystemFileHandle>
}

export async function saveBlobAs(blob: Blob, options: SaveFileAsOptions = {}): Promise<SaveFileAsResult> {
  const suggestedName = options.suggestedName ?? 'export.csv'
  const typeDescription = options.typeDescription ?? 'CSV'

  const w = window as WindowWithSavePicker
  const picker = w.showSaveFilePicker?.bind(w)
  if (typeof picker === 'function') {
    try {
      const handle = await picker({
        suggestedName,
        types: [
          {
            description: typeDescription,
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return 'saved'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled'
      console.warn('saveBlobAs: showSaveFilePicker falló, se usa descarga clásica', e)
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = suggestedName
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
  return 'fallback'
}
