import { useState, useRef } from 'react';
import { Button } from '../shared/button';
import { Input } from '../shared/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
	const [input, setInput] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSend = () => {
		if (input.trim()) {
			onSend(input);
			setInput('');
			// focus back after send? maybe not needed for mobile, but good for desktop
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className='flex w-full items-center gap-2 p-4 pt-2'>
			<Input
				ref={inputRef}
				placeholder='Ask something about the video...'
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				className='flex-1'
			/>
			<Button
				onClick={handleSend}
				disabled={disabled || !input.trim()}
				size='icon'>
				<Send className='h-4 w-4' />
				<span className='sr-only'>Send</span>
			</Button>
		</div>
	);
}
