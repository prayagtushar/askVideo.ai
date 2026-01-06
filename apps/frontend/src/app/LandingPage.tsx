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
		<div className='flex min-h-screen flex-col items-center justify-center p-6 md:p-12'>
			<div className='w-full max-w-2xl text-center space-y-8 mb-12'>
				<h1 className='text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50'>
					Unlock the knowledge in <br /> any YouTube video
				</h1>
				<p className='text-lg md:text-xl text-muted-foreground max-w-lg mx-auto'>
					Chat with your favorite videos using AI. Extract insights, summarize
					content, and find answers instantly.
				</p>
			</div>

			<Card className='w-full max-w-xl p-2'>
				<CardHeader className='text-center pb-2'>
					<CardTitle className='text-xl'>Ready to start?</CardTitle>
					<CardDescription>
						Paste a YouTube video link to begin your interactive experience.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4 pt-4'>
					<Input
						placeholder='https://www.youtube.com/watch?v=...'
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className='text-center h-14 text-lg'
					/>
					{error && (
						<p className='text-sm text-center text-red-500 font-medium'>
							{error}
						</p>
					)}
				</CardContent>
				<CardFooter>
					<Button
						className='w-full h-14 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98]'
						onClick={handleIngest}
						disabled={loading || !url}>
						{loading ? 'Analyzing Video...' : 'Initialize Chat'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
