const clients = new Map()
let nextClientId = 1

function writeSse(res, event, data) {
  res.write(`event: ${event}\n`)
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

export function addSseClient({ res, user }) {
  const id = String(nextClientId++)
  clients.set(id, { res, user })
  writeSse(res, 'connected', { ok: true, userId: user.id, rol: user.rol })
  return id
}

export function removeSseClient(id) {
  clients.delete(id)
}

export function broadcastSse(event, payload, shouldSend) {
  for (const [id, client] of clients.entries()) {
    const { res, user } = client
    if (typeof shouldSend === 'function' && !shouldSend(user)) continue
    try {
      writeSse(res, event, payload)
    } catch {
      clients.delete(id)
    }
  }
}

export function startSseHeartbeat() {
  setInterval(() => {
    for (const [id, client] of clients.entries()) {
      try {
        client.res.write(': ping\n\n')
      } catch {
        clients.delete(id)
      }
    }
  }, 25000)
}
