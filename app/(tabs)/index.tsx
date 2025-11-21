import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Person } from '../../types/person';
import { fetchPeople, searchPeople } from '../../services/api';

export default function DirectoryScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadPeople();
  }, []);

  useEffect(() => {
    const results = searchPeople(people, searchQuery);
    setFilteredPeople(results);
  }, [searchQuery, people]);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const data = await fetchPeople();
      setPeople(data);
      setFilteredPeople(data);
      setError(null);
    } catch (err) {
      setError('Failed to load directory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonPress = (person: Person) => {
    router.push(`/member/${person.id}`);
  };

  const renderPersonCard = ({ item }: { item: Person }) => (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark]}
      onPress={() => handlePersonPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageURL }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={[styles.name, isDark && styles.textDark]}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={[styles.classification, isDark && styles.textSecondaryDark]}>
          {item.classification.charAt(0).toUpperCase() + item.classification.slice(1)}
        </Text>
        {item.relationshipStatus && (
          <Text style={[styles.relationship, isDark && styles.textSecondaryDark]}>
            {item.relationshipStatus.charAt(0).toUpperCase() + item.relationshipStatus.slice(1)}
          </Text>
        )}
        {item.officer && (
          <View style={styles.officerBadge}>
            <Text style={styles.officerText}>{item.officer}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.textDark]}>Loading directory...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.textDark]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPeople}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search by first or last name..."
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filteredPeople}
        renderItem={renderPersonCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.textDark]}>
              No members found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainerDark: {
    backgroundColor: '#1c1c1e',
    borderBottomColor: '#38383a',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchInputDark: {
    backgroundColor: '#2c2c2e',
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1c1c1e',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  textDark: {
    color: '#fff',
  },
  classification: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  textSecondaryDark: {
    color: '#aaa',
  },
  relationship: {
    fontSize: 14,
    color: '#666',
  },
  officerBadge: {
    marginTop: 6,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  officerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
