export function Toast({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) {
  if (!show) return null
  setTimeout(onClose, 2500)
  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
      <div style={{ background: '#222', color: '#fff', padding: '12px 24px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 15 }}>
        {message}
      </div>
    </div>
  )
}
