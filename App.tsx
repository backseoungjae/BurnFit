import 'react-native-gesture-handler';
import RootTabNavigator from '@/navigation/RootTabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <RootTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
