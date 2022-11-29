import type { StackScreenProps } from '@react-navigation/stack';
import { LocationObject } from 'expo-location';
import { Place } from './place';

export type RootStackParamList = {
	Home: { location: LocationObject | null };
	Splash: undefined;
	CardItemDetails: { itemData: Place };
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type SplashScreenProps = StackScreenProps<RootStackParamList, 'Splash'>;
export type CardItemDetailsScreenProps = StackScreenProps<RootStackParamList, 'CardItemDetails'>;
