import { useState } from 'react';
import { apiClient } from '../lib/api-client';
import { useNavigate } from 'react-router-dom';

export function useIngest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const ingestVideo = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/chat/ingest', { url });
      const session = res.data;
      navigate(`/chat/${session.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to ingest video');
    } finally {
      setLoading(false);
    }
  };

  return { ingestVideo, loading, error };
}
