import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/hooks/AuthContext';

export default function TabOneScreen() {

  const {user, member, loading} = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{member?.firstName} {member?.lastName}</Text>
      <Text> {user?.name}  </Text>
      <Text> {user?.email} </Text>
      <Text> {member?.email} </Text>
      <Text> {member?.club} </Text>
      <Text> {member?.phone} </Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
