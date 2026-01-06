import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageSquare, Plus, Youtube, Edit2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { apiClient } from '../../lib/api-client';

interface Session {
	id: string;
	title: string | null;
	videoId: string;
	video: {
		title: string;
		youtubeId: string;
	};
	createdAt: string;
}

export function Sidebar() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editTitle, setEditTitle] = useState('');
	const { id: currentId } = useParams<{ id: string }>();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const response = await apiClient.get('/chat/sessions');
				setSessions(response.data);
			} catch (error) {
				console.error('Failed to fetch sessions:', error);
			}
		};

		fetchSessions();
	}, [currentId]);

	useEffect(() => {
		if (editingId && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editingId]);

	const handleEditStart = (e: React.MouseEvent, session: Session) => {
		e.preventDefault();
		e.stopPropagation();
		setEditingId(session.id);
		setEditTitle(session.title || session.video.title || '');
	};

	const handleEditSave = async (e?: React.FormEvent | React.FocusEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (!editingId) return;

		try {
			await apiClient.post(`/chat/${editingId}/title`, { title: editTitle });
			setSessions(
				sessions.map((s) =>
					s.id === editingId ? { ...s, title: editTitle } : s
				)
			);
			setEditingId(null);
		} catch (error) {
			console.error('Failed to update title:', error);
		}
	};



	return (
		<aside className='hidden md:flex w-72 flex-col fixed left-0 top-0 bottom-0 glass z-40 border-r-0'>
			<div className='p-6 flex items-center gap-3'>
				<div className='p-2 rounded-xl bg-red-600/10'>
					<Youtube className='h-6 w-6 text-red-600' />
				</div>
				<span className='font-bold text-xl tracking-tight'>AskVideo.ai</span>
			</div>

			<div className='px-4 mb-4'>
				<Link
					to='/'
					className='flex items-center gap-2 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group'>
					<Plus className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
					<span className='font-medium'>New Chat</span>
				</Link>
			</div>

			<div className='flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar'>
				<div className='px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
					Recent Chats
				</div>
				{sessions.map((session) => (
					<Link
						key={session.id}
						to={`/chat/${session.id}`}
						className={cn(
							'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
							currentId === session.id
								? 'bg-white/10 text-foreground'
								: 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
						)}>
						<MessageSquare
							className={cn(
								'h-4 w-4 shrink-0',
								currentId === session.id
									? 'text-blue-400'
									: 'text-muted-foreground group-hover:text-blue-400'
							)}
						/>

						{editingId === session.id ? (
							<form
								className='flex-1 flex items-center gap-1 min-w-0'
								onSubmit={handleEditSave}>
								<input
									ref={inputRef}
									className='flex-1 bg-white/10 border-none rounded px-1 py-0.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none w-full'
									value={editTitle}
									onChange={(e) => setEditTitle(e.target.value)}
									onBlur={() => handleEditSave()}
									onClick={(e) => e.stopPropagation()}
								/>
								<button
									type='submit'
									className='p-1 hover:text-green-400 transition-colors'>
									<Check className='h-3 w-3' />
								</button>
							</form>
						) : (
							<>
								<span className='text-sm font-medium truncate flex-1'>
									{session.title || session.video.title || 'Untitled Video'}
								</span>
								<button
									onClick={(e) => handleEditStart(e, session)}
									className='p-1 opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all'>
									<Edit2 className='h-3 w-3' />
								</button>
							</>
						)}

						{currentId === session.id && (
							<div className='absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' />
						)}
					</Link>
				))}
			</div>

			<div className='p-4 border-t border-white/5'>
				<div className='flex items-center gap-3 px-2 py-2'>
					<div className='h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500' />
					<div className='flex flex-col'>
						<span className='text-xs font-bold'>Premium User</span>
						<span className='text-[10px] text-muted-foreground'>
							Settings & Plan
						</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
