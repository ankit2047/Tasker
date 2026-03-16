
// Displays a colored badge indicating task priority level

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

// Map priority levels to their corresponding colors
const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  High:   { bg: '#FF4757', text: '#FFFFFF' },
  Medium: { bg: '#FFA502', text: '#FFFFFF' },
  Low:    { bg: '#2ED573', text: '#FFFFFF' },
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const colors = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.Medium;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default PriorityBadge;
