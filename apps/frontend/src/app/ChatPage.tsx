import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ChatInput } from '../components/chat/ChatInput';

export function ChatPage() {
	const { id } = useParams<{ id: string }>();
	// We need to fetch the session info or at least have the ID.
	const { messages, sendMessage, loading, error } = useChat(id);

	if (!id) return <div>Invalid Session</div>;

	return (
		<div className='flex h-[calc(100vh-3.5rem)] flex-col'>
			<div className='flex-1 overflow-hidden p-4'>
				<div className='mx-auto flex h-full max-w-3xl flex-col rounded-xl border bg-card shadow-sm'>
					<ChatWindow messages={messages} loading={loading} />
					{error && (
						<div className='bg-destructive/10 p-2 text-center text-sm text-destructive'>
							{error}
						</div>
					)}
					<ChatInput onSend={sendMessage} disabled={loading} />
				</div>
			</div>
		</div>
	);
}
