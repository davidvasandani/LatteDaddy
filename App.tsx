import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { EventList } from './components/EventList';
import { PersonalizationFilters } from './components/PersonalizationFilters';
import { MOCK_EVENTS } from './data/mockEvents';
import { Event, UserPreference } from './types';

export default function App() {
  const [selectedPreferences, setSelectedPreferences] = useState<UserPreference>(['Coffee', 'Networking', 'Music']);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => selectedPreferences.includes(event.category));
  }, [selectedPreferences]);

  const handleTogglePreference = (category: 'Coffee' | 'Networking' | 'Music') => {
    setSelectedPreferences((prev) =>
      prev.includes(category) ? prev.filter((p) => p !== category) : [...prev, category]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>LatteDaddy</Text>
        <Text style={styles.subtitle}>Personalized Events For You</Text>
      </View>
      
      <PersonalizationFilters
        selectedPreferences={selectedPreferences}
        onTogglePreference={handleTogglePreference}
      />
      
      <EventList
        events={filteredEvents}
        onEventPress={(event) => setSelectedEvent(event)}
      />

      <Modal visible={!!selectedEvent} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          {selectedEvent && (
            <ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedEvent(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <View style={styles.modalContent}>
                <Text style={styles.modalCategory}>{selectedEvent.category}</Text>
                <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                <Text style={styles.modalInfo}>{selectedEvent.date} • {selectedEvent.location}</Text>
                <Text style={styles.modalDescription}>{selectedEvent.description}</Text>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D2691E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    padding: 20,
  },
  closeButton: {
    padding: 16,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#D2691E',
    fontWeight: '600',
  },
  modalCategory: {
    fontSize: 14,
    color: '#D2691E',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  modalInfo: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginTop: 16,
  },
});
