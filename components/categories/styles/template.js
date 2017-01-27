'use strict';

var React = require('react-native');
var {StyleSheet} = React;

module.exports = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   contentContainer: {
     paddingTop: 80,
   },
   appTitleText: {
     fontSize: 24,
     color: 'rgba(96,100,109, 1)',
     lineHeight: 23,
     marginTop: 4,
     paddingBottom: 10,
     fontWeight: '800',
     textAlign: 'center',
   },
});
