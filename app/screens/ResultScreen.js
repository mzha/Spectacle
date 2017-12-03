import React from 'react';
import { Constants, FileSystem } from 'expo';
import { ScrollView, Text, Image, View, StatusBar, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'; // 0.0.67
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

const scaleAnimation = new ScaleAnimation();

export default class ResultScreen extends React.Component {

  state = {
    popupText: "",
    popupTitle: ""
  }

  componentWillReceiveProps(newProps) {
  }

  createText(app, text, fontSize, inLine) {
    if (text.definition) {
      if (inLine) {
        var temp = text.word.slice(-1);
        var firstWord = text.definition.substr(0, text.definition.indexOf(" "));
        if (firstWord == "a" || firstWord == "the") {
          text.definition = text.definition.slice(text.definition.indexOf(" ") + 1, text.definition.length);
        }
        if (temp.match(/[\.,:;]+/) != null) {
          text.definition = text.definition + temp;
          text.word = text.word.slice(0, text.word.length - 1);
        }
        return <Text onPress={() => app.openPopup("Word", text.word)} style={[styles.result, {fontWeight: 'bold', textDecorationLine: 'underline', fontSize: fontSize}]} key={text.key}> {text.definition} </Text>;
      }
      return <Text onPress={() => app.openPopup("Definition", text.definition)} style={[styles.result, {fontWeight: 'bold', textDecorationLine: 'underline', fontSize: fontSize}]} key={text.key}> {text.word} </Text>;
    } else {
      return <Text style={[styles.result, {fontSize: fontSize}]} key={text.key}> {text.word} </Text>;
    }
  }

  createTexts(app, texts, fontSize, inLine) {
    if (texts != null) {
      var createText = this.createText;
      return texts.map(function(x) { return createText(app, x, fontSize, inLine); });
    } else {
      return <Text style={[styles.result, {fontSize: fontSize}]}> NO TEXT TO SHOW. GO TO THE 'CAMERA' TAB AND TAKE A PICTURE FIRST! </Text>;
    }
  }

  openPopup(title, text) {
    this.setState({
      popupText: text,
      popupTitle: title
    }, function() {
      this.scaleAnimationDialog.show();
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#eee',
        }}>
        <PopupDialog
          ref={(popupDialog) => {
            this.scaleAnimationDialog = popupDialog;
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={styles.popupStyle}
          dialogTitle={<DialogTitle titleTextStyle={{fontWeight: 'bold', fontSize: this.props.fontSize}} title={this.state.popupTitle} />}
        >
          <View style={styles.popupView}>
            <Text style={[styles.popupText, {fontSize: this.props.fontSize}]}>{this.state.popupText}</Text>
          </View>
        </PopupDialog>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
          <Image
            style={{
              flex: 1,
              resizeMode: 'cover',
            }}
            source={{ uri: this.props.results[1] }}
          />
        </View>
        <View
          style={{
            marginTop: '6%',
            height: '90%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ScrollView
            style={ styles.resultScroll }>
            <Text>
              {this.createTexts(this, this.props.results[0], this.props.fontSize, this.props.inLine)}
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'relative'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'contain',
  },
  resultScroll: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    height: 500,
    width: '90%',
  },
  result: {
    color: '#000',
  },
  popupStyle: {
    marginTop: -70
  },
  popupView: {
    padding: 10,
    alignItems: 'center'
  },
  popupButtonText: {
    color: '#65476F'
  }
});
