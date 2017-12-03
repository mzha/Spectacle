import React from 'react';
import { Button, TouchableOpacity, View, Text, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import { ImagePicker, Constants, FileSystem } from 'expo';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

import common from '../common.json';

const scaleAnimation = new ScaleAnimation();

export default class TextScreen extends React.Component {
  static navigationOptions = {
    title: 'Text',
  };

  state = {
    type: 'back',
    response: [],
    left: 0,
    top: 0,
    height: 0,
    width: 0,
    focused: true,
    intervalId: 0,
    photoId: 1
  };

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
   // use intervalId from the state to clear the interval
   clearInterval(this.state.intervalId);
  }

  parseImage(app, data) {
   fetch('https://vision.googleapis.com/v1/images:annotate?key=' + 'AIzaSyB0bFs2USeIDbZUVwZnBySrpfhF6CZsv7E', {
     method: 'POST',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       requests:[
         {
           "image":{
             "content": data.base64
           },
           "features":[
             {
               "type":"TEXT_DETECTION"
             }
           ]
         }
       ]
     }),
   }).then(function (response) {
     var body = JSON.parse(response._bodyText);
     var annotations = body.responses[0].textAnnotations;
     if (annotations != null) {
       fetch('https://translation.googleapis.com/language/translate/v2?key=' + 'AIzaSyB0bFs2USeIDbZUVwZnBySrpfhF6CZsv7E', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           q: annotations[0].description,
           target: app.props.language
         }),
       }).then(function (translated) {
         var body2 = JSON.parse(translated._bodyText);
         var finalText = annotations[0].description;
         if (body2.data != null && body2.data.translations != null) {
           finalText = body2.data.translations[0].translatedText;
         }
         var results = [finalText, data.uri];
         app.replaceWords(results, function(final) {
           app.scaleAnimationDialog.dismiss();
           app.props.setResults(app.props.app, final);
         });
       });
     } else {
       console.log("NO TEXT");
       app.setState({text: "ERROR NO TEXT DETECTED"});
       // app.takePicture(app);
     }
   });
 }

 async replaceWords(results, callback) {
   var text = results[0];
   text = text.replace("-", "");
   text = text.replace(/[\r\n]+/g, " ");
  //  var words = text.split(/[^A-Za-z0-9']/);
   var words = text.split(" ");
   var final = [];

   for (var i = 0; i < words.length; i++) {
     var temp = words[i].replace(/[^A-Za-z0-9']/, "");
     var element = {};
     if (common.arr.indexOf(temp.toLowerCase()) == -1 && temp.length > 3) {
       var response = await fetch('https://wordsapiv1.p.mashape.com/words/' + temp + '/definitions', {
         method: 'GET',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'X-Mashape-Key': 'vpdOjVhKhAmshELOe59fZC54fDsep1dQ7pMjsnOKjAv8WqtB3f'
         }
       });
       var body = JSON.parse(response._bodyText);
       if (body.definitions != null && body.definitions.length > 0) {
         element.definition = body.definitions[0].definition;
       }
     }
     element.word = words[i];
     element.key = i;
     final.push(element);
   }
   results[0] = final;
   callback(results);
 }

  _pickImage = async (app) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      app.scaleAnimationDialog.show();
      app.parseImage(app, result);
    }
  };

  takeImage(app) {
    Expo.ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true
    }).then(function(response) {
      if (!response.cancelled) {
        app.scaleAnimationDialog.show();
        app.parseImage(app, response);
      }
    })
  }

  render() {
    var app = this;
    return (
      <View style={styles.container}>
        <PopupDialog
          ref={(popupDialog) => {
            this.scaleAnimationDialog = popupDialog;
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={styles.popupStyle}
          dismissOnTouchOutside={false}>
          <Image
            style={styles.popupImage}
            source={{uri:'https://loading.io/spinners/coolors/lg.palette-rotating-ring-loader.gif'}}/>
        </PopupDialog>
        <TouchableOpacity
          style={[styles.button, {marginTop: 40}]}
          onPress={this._pickImage.bind(this, app)}>
          <Image
            style={styles.buttonImage}
            source={{uri:'https://lh3.googleusercontent.com/OR9GgUfH_jSdU2FskIWiag6d7S7Rs6TXo4sEAAhYUflcMwcL_UoFu3yNrOitoHkX_cc=w300'}}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.takeImage.bind(this, app)}>
          <Image
            style={styles.buttonImage}
            source={{uri:'https://cdn.iconscout.com/public/images/icon/free/png-512/apple-camera-image-picture-photo-photos-random-moments-square-panoramic-pano-sequence-38d41e520e51b9cc-512x512.png'}}/>
        </TouchableOpacity>
        <Text style={styles.textOutput}>
          {this.state.text}
        </Text>
      </View>
    );
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    backgroundColor: '#ddd'
  },
  textInput: {
    fontSize: 20,
    marginTop: 20,
    padding: 5,
    marginHorizontal: 5,
    height: 150,
    borderColor: '#aaa',
    borderWidth: 2,
    borderRadius: 5
  },
  textOutput: {
    fontSize: 20,
    marginTop: 50,
    padding: 5,
    marginHorizontal: 5,
    height: 500,
  },
  explanation: {
    marginTop: 50,
    fontSize: 20,
    marginHorizontal: 10,
    color: '#000'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 40
  },
  buttonText: {
    fontSize: 25,
    color: '#000',
  },
  buttonImage: {
    resizeMode: 'contain',
    height: 200,
    width: 200,
    flex: 1
  },
  popupText: {
  },
  popupView: {
    padding: 10,
    alignItems: 'center'
  },
  popupButtonText: {
    color: '#65476F'
  },
  popupStyle: {
    marginTop: -70,
    alignItems: 'center',
    width: 250,
    height: 250
  },
  popupImage: {
    height: 200,
    width: 200,
    resizeMode: 'cover',
    flex: 1
  }
});
