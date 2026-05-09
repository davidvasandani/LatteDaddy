import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.chip,
            selectedPreferences.includes(category) && styles.selectedChip,
          ]}
          onPress={() => onTogglePreference(category)}
        >
          <Text
            style={[
              styles.chipText,
              selectedPreferences.includes(category) && styles.selectedChipText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#D2691E',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '600',
  },
});