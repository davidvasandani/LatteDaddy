import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { EventCard } from './EventCard';
import { Event } from '../types';

interface EventListProps {
  events: Event[];
  onEventPress: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEventPress }) => {
  if (events.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No events found for your preferences.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EventCard event={item} onPress={onEventPress} />}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
