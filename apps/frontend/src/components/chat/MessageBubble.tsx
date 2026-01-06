import { type Message } from '../../types';
import { cn } from '../../lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
	message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
	const isUser = message.role === 'user';

	return (
		<div
			className={cn(
				'flex w-full items-start gap-4 p-4',
				isUser ? 'flex-row-reverse' : 'flex-row'
			)}>
			<div
				className={cn(
					'flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-xl glass',
					isUser ? 'bg-primary/20' : 'bg-white/5'
				)}>
				{isUser ? (
					<User className='h-5 w-5' />
				) : (
					<Bot className='h-5 w-5 text-blue-400' />
				)}
			</div>
			<div
				className={cn(
					'flex min-w-0 max-w-[85%] flex-col gap-1',
					isUser && 'items-end'
				)}>
				<div
					className={cn(
						'whitespace-pre-wrap rounded-2xl px-5 py-3 break-words shadow-lg',
						isUser
							? 'bg-primary text-primary-foreground'
							: 'glass-card text-foreground/90'
					)}>
					{message.content}
				</div>
			</div>
		</div>
	);
}
