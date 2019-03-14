import React from 'react'
import {
	StyleSheet,
	View,
	Image,
	Text,
	Dimensions
} from 'react-native'
import LikeButton from './LikeButton'

export default class CardYounes extends React.Component {
	render() {
		return (
			<View style={styles.imageContainer}>
				{/* image part */}
				<Image
					source={this.props.imageUri}
					style={styles.imageStyle}
				/>
				{/* footer */}
				<View style={styles.footerStyle}>
					{/* avatar */}
					<View style={styles.avatarContainerStyle}>
						<Image
							source={this.props.avatarUri}
							style={styles.avatarStyle}
						/>
						<Text style={styles.avatarNameStyle}>
							{this.props.dogName}
						</Text>
					</View>
					{/* like button */}
					<LikeButton />
				</View>
			</View>
		);
	}
}

// get the dimensions of the device
let { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 0.5,
		paddingBottom: 0.5,
		marginTop: 34,
		backgroundColor: '#fff',
		shadowOffset: { width: 5, height: 5 },
		shadowColor: 'black',
		shadowOpacity: 0.85,
		shadowRadius: 8
	},
	imageStyle: {
		width: width,
		height: height / 2,
	},
	footerStyle: {
		flexDirection: 'row',
		paddingTop: 5,
		paddingBottom: 0.5,
		marginTop: 0.7,
		justifyContent: 'center',
		alignItems: "center",
		backgroundColor: '#69fb'
	},
	avatarContainerStyle: {
		flex: 1,
		alignItems: 'center',
		marginRight: 150,
	},
	avatarStyle: {
		borderWidth: 2,
		borderColor: '#f777',
		borderRadius: 40,
		marginLeft: 5,
		width: 80,
		height: 80,
	},
	avatarNameStyle: {
		fontWeight: 'bold',
		fontSize: 16,
	},
});
