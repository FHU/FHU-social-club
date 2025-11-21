import React from 'react';
import { Slot } from 'expo-router';

export default function HTML() {
	return (
		<html lang="en">
			<head />
			<body>
				<Slot />
			</body>
		</html>
	);
}
