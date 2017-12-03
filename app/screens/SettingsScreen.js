import React from 'react';
import { Picker, Switch, View, Text, Slider, ScrollView, StyleSheet } from 'react-native';

export default class SettingsScreen extends React.Component {

  state = {
    fontSize: 0,
    inLine: false,
    language: 'en'
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fontSize: nextProps.fontSize,
      inLine: nextProps.inLine,
      language: nextProps.language
    })
  }

  changeFontSize(app, newSize) {
    app.props.setFontSize(app.props.app, newSize);
  }

  changeLanguage(app, newLanguage) {
    app.setState({
      language: newLanguage
    })
    app.props.setLanguage(app.props.app, newLanguage);
  }

  changeInLine(app, newInLine) {
    app.props.setInLine(app.props.app, newInLine);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={[styles.setting, {width: '50%'}]}>
            <Text>
              Font Size:
            </Text>
            <Text> {this.state.fontSize} </Text>
          </Text>
          <Slider
           style={{width: '50%'}}
           step={1}
           minimumValue={15}
           maximumValue={50}
           value={this.state.fontSize}
           onValueChange={val => this.setState({fontSize: val})}
           onSlidingComplete={ val => this.changeFontSize(this, val)}
          />
        </View>
        <View style={styles.box}>
          <Text style={[styles.setting, {width: '85%'}]}>
            Replace hard words:
          </Text>
          <Switch
           style={{ width: '15%', height: 140 }}
           value={this.state.inLine}
           onValueChange={val => this.changeInLine(this, val)}
          />
        </View>
        <View style={styles.box}>
          <Text style={[styles.setting, {width: '50%'}]}>
            Language:
          </Text>
          <Picker
            style={styles.languagePicker}
            selectedValue={this.state.language}
            onValueChange={(itemValue, itemIndex) => this.changeLanguage(this, itemValue)}>
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Chinese (Simplified)" value="zh-CN" />
            <Picker.Item label="Chinese (Traditional)" value="zh-TW" />
            <Picker.Item label="Spanish" value="es" />
            <Picker.Item label="French" value="fr" />
            <Picker.Item label="Italian" value="it" />
            <Picker.Item label="German" value="de" />
            <Picker.Item label="Russian" value="ru" />
            <Picker.Item label="Japanese" value="ja" />
            <Picker.Item label="Korean" value="ko" />
          </Picker>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  setting: {
    fontSize: 25,
    padding: 5
  },
  right: {
    width: '70%'
  },
  box: {
    flexDirection: 'row',
    paddingBottom: 20
  },
  languagePicker: {
    width: '50%',
    height: 100
  }
});
