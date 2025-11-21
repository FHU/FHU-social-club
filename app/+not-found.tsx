import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFound() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Page not found</Text>
			<Link href="/">Go home</Link>
		</View>
	);
}
