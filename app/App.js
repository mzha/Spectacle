/* @flow */

import React, { PureComponent } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabViewAnimated, TabView, TabBar } from 'react-native-tab-view';

import VideoScreen from './screens/VideoScreen';
import TextScreen from './screens/TextScreen';
import SettingsScreen from './screens/SettingsScreen';
import ResultScreen from './screens/ResultScreen';

import type { Route, NavigationState } from 'react-native-tab-view/types';

import {Constants} from 'expo';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
    icon: string,
  }>
>;

export default class App extends PureComponent<*, State> {
  static title = 'YHacks';
  static appbarElevation = 4;

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Photo', icon: 'md-camera' },
      { key: '2', title: 'Result', icon: 'md-book' },
      { key: '3', title: 'Settings', icon: 'md-settings' },
    ],
    results: [],
    fontSize: 20,
    inLine: false,
    language: 'en'
  };

  setResults(app, results) {
    app.setState({results: results, index: 1});
  }

  setFontSize(app, size) {
    app.setState({fontSize: size});
  }

  setLanguage(app, language) {
    app.setState({language: language});
  }

  setInLine(app, inLine) {
    app.setState({inLine: inLine});
  }

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderIndicator = props => {
    // const { width, position } = props;
    //
    // const translateX = Animated.multiply(position, width);
    //
    // return (
    //   <Animated.View
    //     style={[styles.container, { width, transform: [{ translateX }] }]}
    //   >
    //     <View style={styles.indicator} />
    //   </Animated.View>
    // );
    return (
      <View
        style={styles.container}
      >
      </View>
    )
  };

  _renderIcon = ({ route }) => (
    <Ionicons name={route.icon} size={24} style={styles.icon} />
  );

  _renderBadge = ({ route }) => {
    // if (route.key === '2') {
    //   return (
    //     <View style={styles.badge}>
    //       <Text style={styles.count}>42</Text>
    //     </View>
    //   );
    // }
    return null;
  };

  _renderFooter = props => (
    <TabBar
      {...props}
      renderIcon={this._renderIcon}
      renderBadge={this._renderBadge}
      renderIndicator={this._renderIndicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
    />
  );

  _renderHeader = props => (
    <View
      style={styles.navbar}>
      <Text style={styles.navbarText}>
        {this.state.routes[this.state.index].title}
      </Text>
    </View>
  );

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <TextScreen
            index={this.state.index}
            setResults={this.setResults}
            app={this}
            language={this.state.language}
          />
        );
      case '2':
        return (
          <ResultScreen
            index={this.state.index}
            results={this.state.results}
            inLine={this.state.inLine}
            fontSize={this.state.fontSize}
            language={this.state.language}
          />
        );
      case '3':
        return (
          <SettingsScreen
            app={this}
            index={this.state.index}
            setFontSize={this.setFontSize}
            setInLine={this.setInLine}
            setLanguage={this.setLanguage}
            fontSize={this.state.fontSize}
            inLine={this.state.inLine}
            language={this.state.language}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderFooter={this._renderFooter}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        animationEnabled={false}
      />
    );
  }
}

const colors = {
  icons: '#8DA1BB',
  navbar: '#4C5468',
  background: '#ffffff'
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabbar: {
    backgroundColor: colors.navbar,
  },
  navbar: {
    backgroundColor: colors.navbar,
    paddingTop: 15
  },
  navbarText: {
    padding: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: "#fff"
  },
  tab: {
    padding: 0,
  },
  icon: {
    backgroundColor: 'transparent',
    color: colors.icons,
  },
  indicator: {
    flex: 1,
    backgroundColor: '#0084ff',
    margin: 4,
    borderRadius: 2,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
