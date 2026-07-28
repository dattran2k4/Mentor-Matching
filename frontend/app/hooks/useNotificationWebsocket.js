import { Client } from '@stomp/stompjs'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { env } from '@/config/env'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useAuthStore } from '@/stores/auth-store'
function useNotificationWebsocket() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  useEffect(() => {
    if (!accessToken) return
    const wsUrl = env.apiOrigin.replace(/^http/, 'ws') + '/ws/notifications'
    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`
      },
      reconnectDelay: 5e3,
      heartbeatIncoming: 4e3,
      heartbeatOutgoing: 4e3,
      debug: (str) => {
        console.log('STOMP DEBUG:', str)
      },
      onConnect: (frame) => {
        console.log('STOMP CONNECTED!', frame)
        client.subscribe('/user/queue/notifications', (message) => {
          console.log('STOMP MESSAGE RECEIVED:', message.body)
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification.base })
        })
      },
      onStompError: (frame) => {
        console.error('STOMP ERROR:', frame.headers['message'])
      },
      onWebSocketError: (evt) => {
        console.error('WS ERROR:', evt)
      }
    })
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [accessToken, queryClient])
}
export { useNotificationWebsocket }
