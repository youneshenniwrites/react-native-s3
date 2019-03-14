import React from 'react';
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	Dimensions,
	FlatList,
	TouchableOpacity
} from 'react-native'
import { ImagePicker, Permissions } from 'expo'
import { Ionicons } from '@expo/vector-icons';

import Amplify from '@aws-amplify/core'
import Storage from '@aws-amplify/storage'
import config from '../aws-exports'

Amplify.configure(config)

export default class ImageUploadS3 extends React.Component {
	state = {
		image: null,
		allImages: []
	}

	// First of all fetch all public images from S3
	componentDidMount = async () => {
		await this.fetchImages('images/', { level: "public" }) // (path, access)
		this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
	}

	// Upload an image to S3
	uploadImageToS3 = async uri => {
		const response = await fetch(uri)
		const blob = await response.blob() // format the data for images 
		const folder = 'images'
		// generate a unique random name for every single image 'fixed length'
		const fileName = Math.random().toString(18).slice(3).substr(0, 10) + '.jpeg'
		await Storage.put(folder + '/' + fileName, blob, {
			contentType: 'image/jpeg',
			level: 'public'
		})
			.then(() => {
				// every time a new image is added, we call all the items again
				this.fetchImages('images/', { level: "public" })
			})
			.catch(err => console.log(err))
	}

	fetchImages = async (path, access) => {
		await Storage.list(path, access)
			.then(async (res) => {
				// Get rid of the first item in the returned array which is the folder itself !!! (blame AWS )
				res = res.slice(1)
				// Clone the original array of data to avoid mutating the original data
				resModified = [].concat(res)
				// Sort the images by descending publication date
				resModified.sort((a, b) => b['lastModified'].toString().localeCompare(a['lastModified']))
				// Add the uri of every image stored in S3
				await this.getImagesUri(resModified) // (data)
				// Store the up to date data in the allImages array
				this.setState({ allImages: resModified })
				// console.log('allImages: ', this.state.allImages)
			})
			.catch(err => console.log(err))
	}

	/* 
		The uri of the image is surprinsingly absent from the object item of the Storage.list() response.
		Only by calling Storage.get() on every item of the list that we will get the uri.
		The below function will call Storage.get() on every single key from the Storage.list() array
		to return the uri of every image stored in allImages.
	*/
	getImagesUri = async (data) => {
		let count, foo
		let uriArray = []
		for (count = 0; count < data.length; count++) {
			foo = data[count]['key']
			// Given the key, the get method below returns the uri of every image
			await Storage.get(foo)
				.then(bar => {
					// shorten the uri for fast parsing
					shortUri = bar.substr(0, 102)
					uriArray.push(bar)
				})
				.catch(err => console.log(err))
			// add an uri key to the data array of objects
			data[count]['uri'] = uriArray[count]
		}
	}

	// Ask for permission to access the user's phone library
	askPermissionsAsync = async () => {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
	}

	// Fetch a single image from user's device and upload it to S3
	useLibraryHandler = async () => {
		await this.askPermissionsAsync()
		let result = await ImagePicker.launchImageLibraryAsync(
			{
				allowsEditing: false,
				//aspect: [4, 3],
			}
		)
		//console.log(result);
		if (!result.cancelled) {
			this.setState({ image: result.uri })
			this.uploadImageToS3(this.state.image)
		}
	}

	// Remove Image from S3. Tobe moved to the contest page 
	removeImageFromS3 = async (name) => {
		await Storage.remove(name)
			.then(result => console.log('Deleted', result))
			.catch(err => console.log(err));
	}

	render() {
		let { allImages } = this.state
		return (
			<View style={styles.container}>
				<View style={styles.headerStyle}>
					<TouchableOpacity
						onPress={this.useLibraryHandler}
					>
						<Ionicons 
							name="md-add-circle"
							style={styles.buttonStyle}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.componentDidMount}
					>
						<Ionicons 
							name="md-refresh"
							style={styles.buttonStyle}
						/>
					</TouchableOpacity>
				</View>
				<ScrollView
					contentContainerStyle={styles.container}>
					<FlatList
						ref={(ref) => { this.flatListRef = ref }}
						data={allImages}
						renderItem={(item) => {
							// format the date by removing unnecessary details
							let uploadDateImage = String(item.item.lastModified).substr(0, 15)
							//console.log(item.item.uri)
							return (
								<View>	
									<Image
										source={{ uri: item.item.uri }}
										style={styles.imageStyle}
									/>
									<View style={styles.headerStyle}>
										<Ionicons 
											name="md-trash"
											style={{ color: '#004', fontSize: 30}}
											onPress={() => {this.removeImageFromS3(item.item.key)}}
										/>
										<Text style={{fontSize: 16}}>{uploadDateImage}</Text>
									</View>			
								</View>
							)
						}
						}
					/>
				</ScrollView>
			</View>	
		);
	}
}

let { width } = Dimensions.get('window')

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	headerStyle: {
		flexDirection: 'row', 
		alignItems: 'stretch',
		justifyContent: 'space-between',
		padding: 13
	}, 
	buttonStyle: {
		fontSize: 40,
		color: '#4286f4'
	},
	imageStyle: { 
		width: width, 
		height: width, 
		marginBottom: 12
	}
});
