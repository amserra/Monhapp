import { Platform, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import categories from '../constants/categories';

export default function CategoryScroll() {
	return (
		<ScrollView
			horizontal
			scrollEventThrottle={1}
			showsHorizontalScrollIndicator={false}
			height={50}
			style={styles.chipsScrollView}
			contentInset={{
				// iOS only
				top: 0,
				left: 0,
				bottom: 0,
				right: 20,
			}}
			contentContainerStyle={{
				paddingRight: Platform.OS === 'android' ? 20 : 0,
			}}>
			{categories.map((category, index) => (
				<TouchableOpacity key={index} style={styles.chipsItem}>
					{category.icon}
					<Text>{category.name}</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	chipsScrollView: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 90 : 80,
		paddingHorizontal: 10,
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
});
