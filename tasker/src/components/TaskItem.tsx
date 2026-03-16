
// Renders a single task card in the FlatList on HomeScreen

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { completeTask, deleteTask } from '../redux/taskSlice';
import { Task } from '../types';
import PriorityBadge from './PriorityBadge';

interface TaskItemProps {
  task: Task;
}

// Format a date string into a readable format e.g. "Dec 31, 2024"
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Confirm before deleting to prevent accidental removal
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteTask(task._id)),
        },
      ]
    );
  };

  const handleComplete = () => {
    if (!task.completed) {
      dispatch(completeTask(task._id));
    }
  };

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      {/* ── Header Row ── */}
      <View style={styles.header}>
        <Text
          style={[styles.title, task.completed && styles.titleCompleted]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <PriorityBadge priority={task.priority} />
      </View>

      {/* ── Description ── */}
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      {/* ── Meta Info ── */}
      <View style={styles.meta}>
        <Text style={styles.metaText}>📅 {formatDate(task.deadline)}</Text>
        <View
          style={[
            styles.statusBadge,
            task.completed ? styles.statusDone : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>
            {task.completed ? '✓ Done' : '⏳ Pending'}
          </Text>
        </View>
      </View>

      {/* ── Action Buttons ── */}
      <View style={styles.actions}>
        {!task.completed && (
          <TouchableOpacity
            style={[styles.btn, styles.btnComplete]}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>✓ Mark Complete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btn, styles.btnDelete]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  cardCompleted: {
    borderLeftColor: '#2ED573',
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusDone: {
    backgroundColor: '#D4EDDA',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnComplete: {
    backgroundColor: '#6C63FF',
  },
  btnDelete: {
    backgroundColor: '#FF4757',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TaskItem;
