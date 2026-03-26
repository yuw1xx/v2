import { useState, useEffect, useRef } from 'react'

export interface SpotifyData {
  song: string
  artist: string
  album: string
  album_art_url: string
  track_id: string
  timestamps: { start: number; end: number }
}

export interface Activity {
  name: string
  details?: string
  state?: string
  type: number
  application_id?: string
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
  timestamps?: { start?: number; end?: number }
}

export interface LanyardData {
  discord_user: {
    id: string
    username: string
    display_name?: string
    avatar: string
    discriminator: string
  }
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities: Activity[]
  spotify: SpotifyData | null
  listening_to_spotify: boolean
  kv: Record<string, string>
}

export function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const hbRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let alive = true

    function connect() {
      const ws = new WebSocket('wss://api.lanyard.rest/socket')
      wsRef.current = ws

      ws.onmessage = (e) => {
        if (!alive) return
        const msg = JSON.parse(e.data)
        if (msg.op === 1) {
          hbRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }))
          }, msg.d.heartbeat_interval)
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }))
        }
        if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
          setData(msg.d)
          setConnected(true)
        }
      }

      ws.onclose = () => {
        if (hbRef.current) clearInterval(hbRef.current)
        setConnected(false)
        if (alive) setTimeout(connect, 3000)
      }
    }

    connect()
    return () => {
      alive = false
      if (hbRef.current) clearInterval(hbRef.current)
      wsRef.current?.close()
    }
  }, [userId])

  return { data, connected }
}

export function statusColor(s: LanyardData['discord_status']) {
  return { online: '#22c55e', idle: '#f59e0b', dnd: '#ef4444', offline: '#52525b' }[s]
}
export function statusLabel(s: LanyardData['discord_status']) {
  return { online: 'Online', idle: 'Idle', dnd: 'Do not disturb', offline: 'Offline' }[s]
}
