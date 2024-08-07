'use strict';

var React = require('react-native');

var { StyleSheet, Platform } = React;

var fontSizeBase = 14;
// var largeFont = fontSizeBase * 2.0;
var largeFont = fontSizeBase * 1.2;

// #232323
module.exports = StyleSheet.create({
    sidebar: {
        flex: 1,
        backgroundColor: '#97CAE5',
        borderBottomColor: '#454545'
    },
    links: {
        paddingTop: 5,
        paddingBottom: 5,
        // borderBottomColor: '#454545'
    },
    sidebarIcon: {
        fontSize: largeFont,
        color: '#333',
        //lineHeight: largeFont,
      //   lineHeight: (Platform.OS === 'android') ? 32 : 36,
        backgroundColor: 'transparent',
    },
    text: {
        backgroundColor: 'transparent', //'transparent',
        color: '#333', //'#ecebeb',
        fontWeight: '600',
        fontSize: largeFont,
        //lineHeight: largeFont,
    }
});

//
// const React = require('react-native');
//
// const { StyleSheet, Platform, Dimensions } = React;
//
// const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').width;
//
// module.exports = StyleSheet.create({
//   sidebar: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   drawerCover: {
//     alignSelf: 'stretch',
//     // resizeMode: 'cover',
//     height: deviceHeight / 3.5,
//     width: null,
//     position: 'relative',
//     marginBottom: 10,
//   },
//   drawerImage: {
//     position: 'absolute',
//     // left: (Platform.OS === 'android') ? 30 : 40,
//     left: (Platform.OS === 'android') ? deviceWidth / 10 : deviceWidth / 9,
//     // top: (Platform.OS === 'android') ? 45 : 55,
//     top: (Platform.OS === 'android') ? deviceHeight / 13 : deviceHeight / 12,
//     width: 210,
//     height: 75,
//     resizeMode: 'cover',
//   },
//   listItemContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 37,
//     height: 37,
//     borderRadius: 18,
//     marginRight: 12,
//     paddingLeft: 11,
//     paddingTop: (Platform.OS === 'android') ? 7 : 5,
//   },
//   sidebarIcon: {
//     fontSize: 21,
//     color: '#fff',
//     lineHeight: (Platform.OS === 'android') ? 21 : 25,
//     backgroundColor: 'transparent',
//   },
//   text: {
//     fontWeight: '500',
//     fontSize: 16,
//   },
// });
