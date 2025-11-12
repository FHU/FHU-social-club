import { FlatList, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { APPWRITE_CONFIG, createAppWriteService, MemberRow } from "@/lib/appwrite";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function TabTwoScreen() {

  const [members, setMembers] = useState<MemberRow[] | null>(null)

  const appWriteService = useMemo(
    () => createAppWriteService(APPWRITE_CONFIG),
    []
  );

  const loadMembers = useCallback( async()=> {
    const members = await appWriteService.getMembers("xbx")
    setMembers(members)

  }, [appWriteService])

  useEffect( () => {
    loadMembers()
  }, [loadMembers]);

  return (
    <View style={styles.container}>
      <Text>Members</Text>
      <FlatList
        keyExtractor={(member) => member.$id}
        data={members}
        renderItem={ ({item}) => {
          return (
          <Text> {item.firstName} {item.lastName}</Text>
        )}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
