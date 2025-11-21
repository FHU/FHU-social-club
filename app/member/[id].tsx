import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Person } from '../../types/person';
import { fetchPeople } from '../../services/api';

export default function MemberDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadPersonDetails();
  }, [id]);

  const loadPersonDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchPeople();
      const foundPerson = data.find((p) => p.id === Number(id));
      setPerson(foundPerson || null);
    } catch (err) {
      console.error('Error loading person details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = () => {
    if (person?.showPhone && person?.phone) {
      Linking.openURL(`sms:${person.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (person?.showEmail && person?.email) {
      Linking.openURL(`mailto:${person.email}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!person) {
    return (
      <View style={[styles.centerContainer, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.textDark]}>
          Member not found
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Image source={{ uri: person.imageURL }} style={styles.avatar} />
        <Text style={[styles.name, isDark && styles.textDark]}>
          {person.firstName} {person.lastName}
        </Text>
        {person.officer && (
          <View style={styles.officerBadgeLarge}>
            <Text style={styles.officerText}>{person.officer}</Text>
          </View>
        )}
      </View>

      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
          Basic Information
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, isDark && styles.textSecondaryDark]}>
            Classification:
          </Text>
          <Text style={[styles.value, isDark && styles.textDark]}>
            {person.classification.charAt(0).toUpperCase() +
              person.classification.slice(1)}
          </Text>
        </View>
        {person.relationshipStatus && (
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.textSecondaryDark]}>
              Relationship:
            </Text>
            <Text style={[styles.value, isDark && styles.textDark]}>
              {person.relationshipStatus.charAt(0).toUpperCase() +
                person.relationshipStatus.slice(1)}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
          Contact Information
        </Text>

        {person.showEmail ? (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleEmailPress}
          >
            <View style={styles.contactIcon}>
              <Text style={styles.contactIconText}>✉️</Text>
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactLabel, isDark && styles.textSecondaryDark]}>
                Email
              </Text>
              <Text style={[styles.contactValue, isDark && styles.textDark]}>
                {person.email}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.contactDisabled}>
            <View style={styles.contactIcon}>
              <Text style={styles.contactIconText}>✉️</Text>
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactLabel, isDark && styles.textSecondaryDark]}>
                Email
              </Text>
              <Text style={[styles.contactDisabledText, isDark && styles.textSecondaryDark]}>
                Not shared
              </Text>
            </View>
          </View>
        )}

        {person.showPhone ? (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handlePhonePress}
          >
            <View style={styles.contactIcon}>
              <Text style={styles.contactIconText}>📱</Text>
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactLabel, isDark && styles.textSecondaryDark]}>
                Phone
              </Text>
              <Text style={[styles.contactValue, isDark && styles.textDark]}>
                {person.phone}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.contactDisabled}>
            <View style={styles.contactIcon}>
              <Text style={styles.contactIconText}>📱</Text>
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactLabel, isDark && styles.textSecondaryDark]}>
                Phone
              </Text>
              <Text style={[styles.contactDisabledText, isDark && styles.textSecondaryDark]}>
                Not shared
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
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
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  textDark: {
    color: '#fff',
  },
  textSecondaryDark: {
    color: '#aaa',
  },
  officerBadgeLarge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  officerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionDark: {
    backgroundColor: '#1c1c1e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contactDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    opacity: 0.5,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactIconText: {
    fontSize: 20,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  contactDisabledText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  arrow: {
    fontSize: 24,
    color: '#c7c7cc',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
