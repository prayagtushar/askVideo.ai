import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { type Message } from '../types';

export function useChat(sessionId: string | undefined) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSession = useCallback(async () => {
		if (!sessionId) return;
		try {
			const res = await apiClient.get(`/chat/session/${sessionId}`);
			const data = res.data;
			if (data && data.messages) {
				setMessages(data.messages);
			}
		} catch (err) {
			console.error(err);
		}
	}, [sessionId]);

	useEffect(() => {
		fetchSession();
	}, [fetchSession]);

	const sendMessage = async (content: string) => {
		if (!sessionId) return;

		// Optimistic update
		const tempId = Date.now().toString();
		const userMsg: Message = {
			id: tempId,
			role: 'user',
			content,
			createdAt: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, userMsg]);
		setLoading(true);

		try {
			const res = await apiClient.post(`/chat/${sessionId}/message`, {
				message: content,
			});
			const aiMsg = res.data;
			setMessages((prev) => [...prev, aiMsg]);
		} catch (err: any) {
			console.error(err);
			setError(err.response?.data?.message || 'Failed to send message');
			// Rollback could be implemented here
		} finally {
			setLoading(false);
		}
	};

	return { messages, sendMessage, loading, error };
}
