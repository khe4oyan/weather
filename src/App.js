// libs
import { Suspense } from 'react';

// components
import Weather from './components/Weather';

// styles
import './css/general.css';

function MyComponent() {
	return (
		<div>
			<Weather />
		</div>
	);
}

export default function App() {
	return (
		<Suspense fallback="Loading..">
			<MyComponent />
		</Suspense>
	);
};