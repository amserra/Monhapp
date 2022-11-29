import React, { useContext, useEffect } from 'react';
import { StyleSheet, TextInput, View, Dimensions, Animated, Platform, ScrollView } from 'react-native';
import MapView, { MarkerPressEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Marker } from 'react-native-maps';
import { HomeScreenProps } from '../types/navigation';
import BottomScroll from '../components/BottomScroll';
import CategoryScroll from '../components/CategoryScroll';
import PlacesContext from '../components/PlacesContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
	const location = route.params.location;
	const places = useContext(PlacesContext);

	const initialRegion = {
		latitude: location ? location.coords.latitude : 38.76245458804109,
		longitude: location ? location.coords.longitude : -9.16062180259428,
		latitudeDelta: 0.04864195044303443,
		longitudeDelta: 0.040142817690068,
	};

	let mapIndex = 0;
	let mapAnimation = new Animated.Value(0);

	const _map = React.useRef<MapView>(null);
	const _scrollView = React.useRef<ScrollView>(null);

	useEffect(() => {
		mapAnimation.addListener(({ value }) => {
			let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
			if (index >= places.length) {
				index = places.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			clearTimeout(regionTimeout);

			const regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					mapIndex = index;
					const { coordinate } = places[index];
					_map.current?.animateToRegion(
						{
							...coordinate,
							latitudeDelta: initialRegion.latitudeDelta,
							longitudeDelta: initialRegion.longitudeDelta,
						},
						350
					);
				}
			}, 10);
		});
	});

	const interpolations = places.map((marker, index) => {
		const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];

		const scale = mapAnimation.interpolate({
			inputRange,
			outputRange: [1, 1.5, 1],
			extrapolate: 'clamp',
		});

		return { scale };
	});

	const onMarkerPress = (mapEventData: MarkerPressEvent) => {
		// @ts-ignore
		const markerID = mapEventData._targetInst.return.key;

		let x = markerID * CARD_WIDTH + markerID * 20;
		if (Platform.OS === 'ios') {
			x = x - SPACING_FOR_CARD_INSET;
		}

		_scrollView.current?.scrollTo({ x: x, y: 0, animated: true });
	};

	return (
		<View style={styles.container}>
			<MapView
				ref={_map}
				initialRegion={initialRegion}
				style={styles.container}
				provider={PROVIDER_GOOGLE}
				customMapStyle={[
					{
						elementType: 'labels.icon',
						stylers: [
							{
								visibility: 'off',
							},
						],
					},
				]}
				showsUserLocation={location ? true : false}>
				{places.map((marker, index) => {
					const scaleStyle = {
						transform: [
							{
								scale: interpolations[index].scale,
							},
						],
					};
					return (
						<Marker
							key={index}
							coordinate={{ latitude: marker.coordinate.latitude, longitude: marker.coordinate.longitude }}
							onPress={(e) => onMarkerPress(e)}>
							<Animated.View style={[styles.markerWrap]}>
								<Animated.Image
									source={require('../../assets/map_marker.png')}
									style={[styles.marker, scaleStyle]}
									resizeMode="cover"
								/>
							</Animated.View>
						</Marker>
					);
				})}
			</MapView>
			<View style={styles.searchBox}>
				<TextInput placeholder="Procura aqui" placeholderTextColor="#000" autoCapitalize="none" style={{ flex: 1, padding: 0 }} />
				<Ionicons name="ios-search" size={20} />
			</View>
			<CategoryScroll />

			<BottomScroll scrollRef={_scrollView} mapAnimation={mapAnimation} markers={places} navigation={navigation} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchBox: {
		position: 'absolute',
		marginTop: Platform.OS === 'ios' ? 40 : 20,
		flexDirection: 'row',
		backgroundColor: '#fff',
		width: '90%',
		alignSelf: 'center',
		borderRadius: 5,
		padding: 10,
		shadowColor: '#ccc',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 10,
	},
	markerWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 50,
		height: 50,
	},
	marker: {
		width: 30,
		height: 30,
	},
});
