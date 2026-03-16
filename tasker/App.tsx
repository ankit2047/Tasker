

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // Provide Redux store to the entire app
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#6C63FF" />
        {/* AppNavigator handles routing between Auth and App screens */}
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}
