
// Root navigation — switches between Auth screens and App screens
// based on whether a JWT token exists in Redux state

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RootStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  // If a token exists in Redux, the user is authenticated
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F0EFFF' },
        }}
      >
        {isAuthenticated ? (
          // ── Authenticated Stack ──────────────────────────────────────────────
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Tasker', headerShown: true }}
            />
            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
              options={{
                title: 'Add Task',
                presentation: 'modal',
                headerShown: true,
              }}
            />
          </>
        ) : (
          // ── Auth Stack ─────
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
