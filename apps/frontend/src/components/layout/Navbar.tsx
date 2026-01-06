import { Link } from 'react-router-dom';
import { Youtube } from 'lucide-react';

export function Navbar() {
	return (
		<header className='md:hidden fixed top-0 left-0 right-0 z-50 glass border-none'>
			<div className='px-4 flex h-14 items-center justify-between'>
				<Link to='/' className='flex items-center gap-2 font-bold'>
					<Youtube className='h-6 w-6 text-red-600' />
					<span>AskVideo.ai</span>
				</Link>
			</div>
		</header>
	);
}
