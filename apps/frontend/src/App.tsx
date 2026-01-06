import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './app/LandingPage';
import { ChatPage } from './app/ChatPage';

function App() {
	return (
		<BrowserRouter>
			<div className='min-h-screen bg-muted/40 font-sans antialiased'>
				<Navbar />
				<main>
					<Routes>
						<Route path='/' element={<LandingPage />} />
						<Route path='/chat/:id' element={<ChatPage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
