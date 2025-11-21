import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function AboutScreen() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<View style={[styles.container, isDark && styles.containerDark]}>
			<View style={[styles.card, isDark && styles.cardDark]}>
				<Text style={[styles.title, isDark && styles.textDark]}>
					FHU Social Club
				</Text>
				<Text style={[styles.description, isDark && styles.textSecondaryDark]}>
					Welcome to the FHU Social Club Directory!
				</Text>
				<Text style={[styles.description, isDark && styles.textSecondaryDark]}>
					Browse through our members, search by name, and view detailed profiles including contact information.
				</Text>
				<Text style={[styles.version, isDark && styles.textSecondaryDark]}>
					Version 1.0.0
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 16,
		justifyContent: 'center',
	},
	containerDark: {
		backgroundColor: '#000',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardDark: {
		backgroundColor: '#1c1c1e',
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#000',
		marginBottom: 16,
		textAlign: 'center',
	},
	textDark: {
		color: '#fff',
	},
	description: {
		fontSize: 16,
		color: '#666',
		lineHeight: 24,
		marginBottom: 12,
		textAlign: 'center',
	},
	textSecondaryDark: {
		color: '#aaa',
	},
	version: {
		fontSize: 14,
		color: '#999',
		marginTop: 24,
		textAlign: 'center',
	},
});
