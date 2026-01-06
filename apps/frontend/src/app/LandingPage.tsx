import { useState } from 'react';
import { useIngest } from '../hooks/useIngest';
import { Button } from '../components/shared/button';
import { Input } from '../components/shared/input';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '../components/shared/card';

export function LandingPage() {
	const [url, setUrl] = useState('');
	const { ingestVideo, loading, error } = useIngest();

	const handleIngest = () => {
		if (url) {
			ingestVideo(url);
		}
	};

	return (
		<div className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Ask Video AI</CardTitle>
					<CardDescription>
						Chat with any YouTube video. Just paste the link below.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Input
						placeholder='https://youtube.com/watch?v=...'
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					{error && <p className='text-sm text-destructive'>{error}</p>}
				</CardContent>
				<CardFooter>
					<Button
						className='w-full'
						onClick={handleIngest}
						disabled={loading || !url}>
						{loading ? 'Analyzing Video...' : 'Start Chat'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
