import {
  Camera,
  Video,
  FileSystem,
  Permissions,
} from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  Image,
  Picker,
  Button,
  ScrollView,
  Vibration,
} from 'react-native';

export default class VideoScreen extends React.Component {
  static navigationOptions = {
    title: 'Video',
  };

  state = {
    type: 'back',
    images: [
      require('../assets/confused-3.png')
    ],
    response: [],
    left: 0,
    bottom: 0,
    height: 0,
    width: 0,
    focused: true
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.index == 2) {
      var app = this;
      var takePicture = this.takePicture;
      // takePicture(app);
      // var intervalId = 0;
      takePicture(app);
      // store intervalId in the state so it can be accessed later:
    } else {
    }
  }

  componentWillUnmount() {
   // use intervalId from the state to clear the interval
   clearInterval(this.state.intervalId);
  }

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  createEmotion(emotion) {
    return <Image
      style={[styles.emotion, {left: emotion[1], top: emotion[2] }]}
      key={emotion[1]}
      source={emotion[0]}/>;
  }

  createResponse(response) {
    return response.map(this.createEmotion);
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
              "content": data
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
        let vertices = annotations[0].boundingPoly.vertices;

        let widthMultiplier = 0.75;
        let heightMultiplier = 0.91;

        var width = vertices[1].x - vertices[0].x;
        var height = vertices[3].y - vertices[0].y;
        var left = vertices[0].x;
        var bottom = vertices[0].y;

        left *= widthMultiplier;
        width *= widthMultiplier;
        height *= heightMultiplier;
        bottom *= heightMultiplier

        console.log("WIDTH: " + width + ", HEIGHT: " + height + ", LEFT: " + left + ", BOTTOM: " + bottom)

        console.log(annotations[0].description);

        app.setState({newText: annotations[0].description}, function() {
          app.setState({
            width: width,
            height: height,
            left: left,
            bottom: bottom
          }, function() {
            app.takePicture(app);
          });
        });
      } else {
        console.log("NO TEXT");
        app.setState({text: "ERROR NO TEXT DETECTED"});
      }
    });
  }

  takePicture(app) {
    if (app.state.focused) {
      if (app.camera) {
        app.camera.takePictureAsync({ base64:true, quality: 1 }).then(function(data) {
          app.parseImage(app, data.base64);
        });
      }
    }
  };

  renderCamera() {
    return (
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        autofocus={true}>
        <View
          style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
          <Text
            style={[styles.newText, {
              left: 0,
              bottom: 0,
              width: 100,
              height: 100
            }]}>
            {this.state.newText}
          </Text>
        </View>
      </Camera>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  newText: {
    backgroundColor: "#000",
    color: "#fff",
    position: 'absolute'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'ivory',
  },
  emotion: {
    height: 100,
    width: 100,
    position: 'absolute'
  },
  navigation: {
    flex: 1,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flipButton: {
    flex: 0.3,
    alignSelf: 'flex-end',
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  item: {
    margin: 4,
    backgroundColor: 'indianred',
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  galleryButton: {
    backgroundColor: 'indianred',
  },
  row: {
    flexDirection: 'row',
  },
});
