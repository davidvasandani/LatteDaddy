import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UserPreference } from '../types';

interface PersonalizationFiltersProps {
  selectedPreferences: UserPreference;
  onTogglePreference: (category: 'Coffee' | 'Networking' | 'Music') => void;
}

const CATEGORIES: ('Coffee' | 'Networking' | 'Music')[] = ['Coffee', 'Networking', 'Music'];

export const PersonalizationFilters: React.FC<PersonalizationFiltersProps> = ({
  selectedPreferences,
  onTogglePreference,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by interests:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((category) => {
          const isSelected = selectedPreferences.includes(category);
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, isSelected && styles.selectedChip]}
              onPress={() => onTogglePreference(category)}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: '#D2691E',
    borderColor: '#D2691E',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#fff',
  },
});
