
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppDispatch, RootState } from '../redux/store';
import { addTask } from '../redux/taskSlice';
import { Priority, RootStackParamList } from '../types';

type AddTaskScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddTask'>;
};

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: '#2ED573',
  Medium: '#FFA502',
  High: '#FF4757',
};

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.tasks);

  // ── Form State ──
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  // DateTimePicker state for task dateTime
  const [dateTime, setDateTime] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time'>('date');

  // DateTimePicker state for deadline
  const [deadline, setDeadline] = useState(new Date());
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  // ── DateTime Picker Handlers ──
  const onDateTimeChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowDateTimePicker(false);
    if (selected) setDateTime(selected);
  };

  const onDeadlineChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowDeadlinePicker(false);
    if (selected) setDeadline(selected);
  };

  const showDateTimepickerFor = (mode: 'date' | 'time') => {
    setDateTimeMode(mode);
    setShowDateTimePicker(true);
  };

  // Format date for display
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // ── Submit Handler ──
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title.');
      return;
    }
    if (deadline < new Date()) {
      Alert.alert('Validation Error', 'Deadline must be in the future.');
      return;
    }

    const result = await dispatch(
      addTask({
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        deadline: deadline.toISOString(),
        priority,
      })
    );

    // Navigate back on success
    if (addTask.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to create task. Please try again.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>New Task</Text>

      {/* ── Title ── */}
      <View style={styles.group}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#BBBBBB"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          returnKeyType="next"
        />
      </View>

      {/* ── Description ── */}
      <View style={styles.group}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add more details (optional)..."
          placeholderTextColor="#BBBBBB"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          maxLength={500}
        />
      </View>

      {/* ── Date & Time ── */}
      <View style={styles.group}>
        <Text style={styles.label}>Date & Time</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => showDateTimepickerFor('date')}
          >
            <Text style={styles.dateBtnText}>📅 {formatDate(dateTime)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => showDateTimepickerFor('time')}
          >
            <Text style={styles.dateBtnText}>🕐 {formatTime(dateTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* iOS/Android DateTimePicker for dateTime */}
      {showDateTimePicker && (
        <DateTimePicker
          value={dateTime}
          mode={dateTimeMode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateTimeChange}
          minimumDate={new Date()}
        />
      )}

      {/* ── Deadline ── */}
      <View style={styles.group}>
        <Text style={styles.label}>Deadline *</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDeadlinePicker(true)}
        >
          <Text style={styles.dateBtnText}>⏰ {formatDate(deadline)}</Text>
        </TouchableOpacity>
      </View>

      {/* iOS/Android DateTimePicker for deadline */}
      {showDeadlinePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDeadlineChange}
          minimumDate={new Date()}
        />
      )}

      {/* ── Priority Selector ── */}
      <View style={styles.group}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityBtn,
                priority === p && {
                  backgroundColor: PRIORITY_COLORS[p],
                  borderColor: PRIORITY_COLORS[p],
                },
              ]}
              onPress={() => setPriority(p)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.priorityBtnText,
                  priority === p && styles.priorityBtnTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Submit Button ── */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitBtnText}>Create Task</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 24,
  },
  group: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 1.5,
    borderColor: '#E8E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 13,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E8E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dateBtnText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8F0',
    backgroundColor: '#FFFFFF',
  },
  priorityBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  priorityBtnTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default AddTaskScreen;
