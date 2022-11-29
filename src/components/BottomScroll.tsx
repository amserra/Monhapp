import { StackNavigationProp } from '@react-navigation/stack';
import { Dimensions, Animated, StyleSheet, Platform, View, Text, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { Place } from '../types/place';
import StarRating from './StarRating';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const openInGPS = (lat: number, lng: number) => {
	const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
	const latLng = `${lat},${lng}`;
	const label = 'Custom Label';
	const url = Platform.select({
		ios: `${scheme}${label}@${latLng}`,
		android: `${scheme}${latLng}(${label})`,
	}) as string;

	Linking.openURL(url);
};

interface BottomScrollProps {
	scrollRef: React.RefObject<ScrollView>;
	mapAnimation: Animated.Value;
	markers: Place[];
	navigation: StackNavigationProp<RootStackParamList, 'Home', undefined>;
}

export default function BottomScroll({ scrollRef, mapAnimation, markers, navigation }: BottomScrollProps) {
	return (
		<Animated.ScrollView
			ref={scrollRef}
			horizontal
			pagingEnabled
			scrollEventThrottle={1}
			showsHorizontalScrollIndicator={false}
			snapToInterval={CARD_WIDTH + 20}
			snapToAlignment="center"
			style={styles.scrollView}
			contentInset={{
				top: 0,
				left: SPACING_FOR_CARD_INSET,
				bottom: 0,
				right: SPACING_FOR_CARD_INSET,
			}}
			contentContainerStyle={{
				paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
			}}
			onScroll={Animated.event(
				[
					{
						nativeEvent: {
							contentOffset: {
								x: mapAnimation,
							},
						},
					},
				],
				{ useNativeDriver: true }
			)}>
			{markers.map((marker, index) => (
				<View style={styles.card} key={index}>
					<TouchableOpacity
						style={{ width: '100%', height: '100%' }}
						onPress={() => {
							navigation.navigate('CardItemDetails', { itemData: marker });
						}}>
						<Image source={{ uri: marker.image }} style={styles.cardImage} resizeMode="cover" />
						<View style={styles.textContent}>
							<Text numberOfLines={1} style={styles.cardtitle}>
								{marker.title}
							</Text>
							<StarRating ratings={marker.rating} reviews={marker.reviews} />
							<Text numberOfLines={1} style={styles.cardDescription}>
								{marker.description}
							</Text>
							<View style={styles.button}>
								<TouchableOpacity
									onPress={() => {
										openInGPS(marker.coordinate.latitude, marker.coordinate.longitude);
									}}
									style={[styles.signIn, { borderColor: '#FF6347', borderWidth: 1 }]}>
									<Text
										style={[
											styles.textSign,
											{
												color: '#FF6347',
											},
										]}>
										Ir de GPS até ao monhé
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			))}
		</Animated.ScrollView>
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
	chipsScrollView: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 90 : 80,
		paddingHorizontal: 10,
	},
	chipsIcon: {
		marginRight: 5,
	},
	chipsItem: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 8,
		paddingHorizontal: 20,
		marginHorizontal: 10,
		height: 35,
		shadowColor: '#ccc',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 10,
	},
	scrollView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingVertical: 10,
	},
	endPadding: {
		paddingRight: width - CARD_WIDTH,
	},
	card: {
		// padding: 10,
		elevation: 2,
		backgroundColor: '#FFF',
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		marginHorizontal: 10,
		shadowColor: '#000',
		shadowRadius: 5,
		shadowOpacity: 0.3,
		shadowOffset: { x: 2, y: -2 },
		height: CARD_HEIGHT,
		width: CARD_WIDTH,
		overflow: 'hidden',
	},
	cardImage: {
		flex: 3,
		width: '100%',
		height: '100%',
		alignSelf: 'center',
	},
	textContent: {
		flex: 2,
		padding: 10,
	},
	cardtitle: {
		fontSize: 12,
		// marginTop: 5,
		fontWeight: 'bold',
	},
	cardDescription: {
		fontSize: 12,
		color: '#444',
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
	button: {
		alignItems: 'center',
		marginTop: 5,
	},
	signIn: {
		width: '100%',
		padding: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
	},
	textSign: {
		fontSize: 14,
		fontWeight: 'bold',
	},
});
