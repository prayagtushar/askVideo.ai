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
		<div className='h-screen flex flex-col pt-14 md:pt-0'>
			<div className='flex-1 overflow-hidden p-2 md:p-6'>
				<div className='mx-auto flex h-full max-w-5xl flex-col rounded-3xl glass overflow-hidden border border-white/5'>
					<ChatWindow messages={messages} loading={loading} />
					{error && (
						<div className='bg-red-500/10 p-3 text-center text-sm text-red-400 font-medium'>
							{error}
						</div>
					)}
					<ChatInput onSend={sendMessage} disabled={loading} />
				</div>
			</div>
		</div>
	);
}
