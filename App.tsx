import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import CardItemDetails from './src/screens/CardItemDetails';
import SplashScreen from './src/screens/SplashScreen';
import type { RootStackParamList } from './src/types/navigation';
import PlacesContext from './src/components/PlacesContext';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	const places = useContext(PlacesContext);
	return (
		<PaperProvider>
			<PlacesContext.Provider value={places}>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Splash" component={SplashScreen} />
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="CardItemDetails" component={CardItemDetails} />
					</Stack.Navigator>
				</NavigationContainer>
			</PlacesContext.Provider>
		</PaperProvider>
	);
}
