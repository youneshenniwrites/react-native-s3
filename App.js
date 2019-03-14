import React from 'react';
import { View } from 'react-native'
import { withAuthenticator } from 'aws-amplify-react-native'
import ImageUploadS3 from './components/ImageUploadS3'

class App extends React.Component {
render() {
		return (
			<View style={{flex: 1}}>
				<ImageUploadS3 />
			</View>
		);
	}
}

export default withAuthenticator(App, { includeGreetings: true })