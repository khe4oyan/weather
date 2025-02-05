// libs
import { Suspense } from 'react';

// components
import Weather from './components/Weather';

// styles
import './css/general.css';

export default function App() {
	return (
		<Suspense fallback="Loading..">
			<Weather />
		</Suspense>
	);
}
