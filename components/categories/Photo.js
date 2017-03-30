import React from 'react';
import {
   ActivityIndicator,
   Button,
   Clipboard,
   Image,
   Share,
   StatusBar,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import Expo, {
   Components,
   Permissions,
   Location,
   Constants,
   ImagePicker,
} from 'expo';
import shortid from 'shortid';

export default class Photo extends React.Component {
   state = {
       image: null,
       uploading: false,
   }

   componentDidMount() {
   }

   static TakePhoto() {
      this._takePhoto();
   }

  render() {
    let { image } = this.state;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 150}}>
      <View style={styles.buttonContainer}>
         <TouchableOpacity onPress={this._takePhoto}>
            <View style={styles.photoButton}>
             <Text style={styles.photoButtonText}>
                 Take Photo
             </Text>
            </View>
         </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
         <TouchableOpacity onPress={this._pickImage}>
            <View style={styles.photoButton}>
             <Text style={styles.photoButtonText}>
                 Pick Photo
             </Text>
            </View>
         </TouchableOpacity>
      </View>
        { this._maybeRenderImage() }
        { this._maybeRenderUploadingOverlay() }
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}]}>
          <ActivityIndicator
            color="#fff"
            animating
            size="large"
          />
        </View>
      );
    }
  }

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }
    return (
      <View style={{
        marginTop: 30,
        width: 250,
        borderRadius: 3,
        elevation: 2,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOpacity: 0.2,
        shadowOffset: {width: 4, height: 4},
        shadowRadius: 5,
      }}>
        <View style={{borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden'}}>
          <Image
            source={{uri: image}}
            style={{width: 250, height: 250}}
          />
        </View>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{paddingVertical: 10, paddingHorizontal: 10}}>
          {image}
        </Text>
      </View>
    );
  }

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  }

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  }

  static _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3]
    });

    this._handleImagePicked(pickerResult);
  }

  static _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3]
    });

    this._handleImagePicked(pickerResult);
  }

  static _handleImagePicked = async (pickerResult) => {
    let uploadResponse, uploadResult;

    try {
      this.setState({uploading: true});

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();

        console.log('>>> uploadResult: ', uploadResult);

        let filename = uploadResult.result.files.photo[0].name;
        let location = `https://pros-estimates.herokuapp.com:443/api/Containers/images/download/${filename}`;

        this.setState({image: location});
      }
    } catch(e) {
      console.log({uploadResponse});
      console.log({uploadResult});
      console.log({e});
      alert('Failed to upload image');
    } finally {
      this.setState({uploading: false});
    }
  }
}

async function uploadImageAsync(uri) {
  let apiUrl = 'https://pros-estimates.herokuapp.com:443/api/Containers/images/upload';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  let uriParts = uri.split('.');
  let fileType = 'png'; //uri[uri.length - 1];

  let formData = new FormData();

  let filename = shortid.generate();

  formData.append('photo', {
    uri,
    name: `${filename}.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options);
}


const styles = StyleSheet.create({
   photoButton: {
      width: 40,
      height: 20,
      borderRadius: 5,
      backgroundColor: '#ad241f',
      padding: 2,
   },
   photoButtonText: {
      fontSize: 8,
      lineHeight: 8,
      color: '#fff',
      textAlign: 'center',
   },
   buttonContainer: {
     alignItems: 'center',
     marginHorizontal: 5,
     paddingBottom: 10,
   },
});
