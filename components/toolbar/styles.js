'use strict';

var React = require('react-native');

var { StyleSheet } = React;
var { Platform } = React;

module.exports = StyleSheet.create({
   toolbar: {
      height: 80,
   },
   toolbarIOS: {
      alignItems: 'center',
      paddingTop: 5,
      paddingLeft: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#E7E7E7',
   },
   toggleToolbar: {
      height: 120,
      backgroundColor: '#ad241f',
   },
   title: {
      color: '#fff',
      fontWeight: '900',
      paddingRight: 5
   },
   iconBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center'
   },
   right: {
      flexDirection: 'row',
      alignItems: 'center'
   }
});
