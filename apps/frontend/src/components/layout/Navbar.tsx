import { Link } from 'react-router-dom';
import { Youtube } from 'lucide-react';

export function Navbar() {
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-14 items-center'>
				<Link to='/' className='flex items-center gap-2 font-bold'>
					<Youtube className='h-6 w-6 text-red-600' />
					<span>AskVideo.ai</span>
				</Link>
			</div>
		</header>
	);
}
