import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './app/LandingPage';
import { ChatPage } from './app/ChatPage';

function App() {
	return (
		<BrowserRouter>
			<div className='min-h-screen text-foreground font-sans antialiased flex'>
				<Sidebar />
				<div className='flex-1 flex flex-col min-w-0 md:ml-72'>
					<Navbar />
					<main className='relative flex-1'>
						<Routes>
							<Route path='/' element={<LandingPage />} />
							<Route path='/chat/:id' element={<ChatPage />} />
						</Routes>
					</main>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
