import { useRef, useEffect } from 'react';
import { type Message } from '../../types';
import { MessageBubble } from './MessageBubble';

// I need to implement ScrollArea or just use div with overflow-y-auto.
// I'll stick to a simple div for now to avoid complexity of a full ScrollArea component implementation.
// But to follow instructions, I should place it in 'shared' if I were to make one.
// I'll just use a styled div here for speed/simplicity, as ScrollArea usually requires Radix primitives which I avoided.

interface ChatWindowProps {
	messages: Message[];
	loading?: boolean;
}

export function ChatWindow({ messages, loading }: ChatWindowProps) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	return (
		<div className='flex-1 overflow-y-auto p-4'>
			<div className='flex flex-col gap-4'>
				{messages.map((msg) => (
					<MessageBubble key={msg.id} message={msg} />
				))}
				{loading && (
					<div className='flex w-full items-center justify-start gap-4 p-4'>
						<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted'>
							<span className='animate-pulse'>...</span>
						</div>
						<div className='text-sm text-muted-foreground'>Thinking...</div>
					</div>
				)}
				<div ref={bottomRef} />
			</div>
		</div>
	);
}
