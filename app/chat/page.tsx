import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ChatInterface from '@/components/chat-interface'

export default async function ChatPage() {
  const session = await auth()
  if (!session) redirect('/')
  return <ChatInterface userName={session.user?.name ?? ''} userImage={session.user?.image ?? ''} />
}
