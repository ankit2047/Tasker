
import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks, clearTasks } from '../redux/taskSlice';
import { logout } from '../redux/authSlice';
import TaskItem from '../components/TaskItem';
import { RootStackParamList, Task } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch tasks when the screen mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Show error as an alert
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Logout — clear Redux state and navigate back to Login
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(clearTasks());
          dispatch(logout());
        },
      },
    ]);
  };

  // Summary stats displayed in the header
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* ── Stats Row ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, styles.statCardPending]}>
          <Text style={[styles.statNumber, { color: '#FFA502' }]}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, styles.statCardDone]}>
          <Text style={[styles.statNumber, { color: '#2ED573' }]}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Tasks</Text>
    </View>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button below to add your first task
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Top Header Bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ── Task FlatList ── */}
      {loading && tasks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item: Task) => item._id}
          renderItem={({ item }) => <TaskItem task={item} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyList}
          contentContainerStyle={tasks.length === 0 ? styles.flatListEmpty : styles.flatList}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={['#6C63FF']}
              tintColor="#6C63FF"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Floating Add Button ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#6C63FF',
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  userEmail: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 220,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  flatList: {
    paddingBottom: 90,
  },
  flatListEmpty: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  listHeader: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardPending: {
    borderTopWidth: 3,
    borderTopColor: '#FFA502',
  },
  statCardDone: {
    borderTopWidth: 3,
    borderTopColor: '#2ED573',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#6C63FF',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#6C63FF',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default HomeScreen;
