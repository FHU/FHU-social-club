import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
	return (
		<Tabs>
			<Tabs.Screen name="index" options={{ title: 'Directory' }} />
			<Tabs.Screen name="two" options={{ title: 'About' }} />
		</Tabs>
	);
}
