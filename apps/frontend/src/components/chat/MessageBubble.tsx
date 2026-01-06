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
					'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border',
					isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
				)}>
				{isUser ? <User className='h-4 w-4' /> : <Bot className='h-4 w-4' />}
			</div>
			<div
				className={cn(
					'flex min-w-0 max-w-[80%] flex-col gap-1',
					isUser && 'items-end'
				)}>
				<div
					className={cn(
						'whitespace-pre-wrap rounded-lg px-4 py-2 break-words',
						isUser
							? 'bg-primary text-primary-foreground'
							: 'bg-muted text-muted-foreground'
					)}>
					{message.content}
				</div>
			</div>
		</div>
	);
}
