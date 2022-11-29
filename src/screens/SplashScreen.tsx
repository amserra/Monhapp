import React, { useContext, useEffect, useState } from 'react';
import { Text, Dimensions, StyleSheet, StatusBar, View, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import type { SplashScreenProps } from '../types/navigation';
import { query, getDocs, collectionGroup } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import PlacesContext from '../components/PlacesContext';
import type { Place } from '../types/place';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export default function SplashScreen({ navigation }: SplashScreenProps) {
	const places = useContext(PlacesContext);
	const [error, setError] = useState<null | string>(null);
	const [location, setLocation] = useState<null | LocationObject>(null);

	const getLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			// Allow to not grant location: it will be provided a default location
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		setLocation(location);
	};

	const fetchData = async () => {
		const placesRef = collectionGroup(db, 'places');
		const q = query(placesRef);
		try {
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(async (doc) => {
				const data = doc.data() as Place;
				const imageUrl = await getDownloadURL(ref(storage, data.image));
				data.image = imageUrl;
				places.push(data);
			});
			navigation.replace('Home', { location });
		} catch (e) {
			setError('Falha ao sacar dados de monhés. Por favor tenta mais tarde ou envia mensagem ao programador miserável que fez esta app');
		}
	};

	useEffect(() => {
		getLocation();
		fetchData();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#eab308" barStyle="light-content" />
			<View style={styles.header}>
				<Animatable.Image animation="bounceIn" source={require('../../assets/logo.png')} style={styles.logo} resizeMode="stretch" />
			</View>
			<Animatable.View
				style={[
					styles.footer,
					{
						backgroundColor: '#eab308',
					},
				]}
				animation="fadeInUpBig">
				<Text style={[styles.title, { color: '#ffff' }]}>A tua app para encontrar monhés!</Text>
				{error ? <Text>{error}</Text> : <ActivityIndicator size="large" color="#fff" style={styles.spinner} />}
			</Animatable.View>
		</View>
	);
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eab308',
	},
	header: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	spinner: {
		marginTop: 20,
	},
	footer: {
		flex: 1,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 50,
		paddingHorizontal: 30,
	},
	logo: {
		width: height_logo,
		height: height_logo,
	},
	title: {
		color: '#05375a',
		fontSize: 30,
		textAlign: 'center',
		fontWeight: 'bold',
	},
});
