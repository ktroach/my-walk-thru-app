'use strict';

var React = require('react-native');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
   input: {
      borderWidth: 1,
      borderColor: '#D7D7D7',
      height: 30,
      marginLeft: 10,
      marginRight: 10,
      padding: 5,
      borderRadius: 8,
      backgroundColor: '#efefef',
      color: '#cccccc',
      textAlign: 'center',
   },
   option: {
     flexDirection: 'row',
     backgroundColor: 'rgba(0,0,0,0.02)',
     paddingHorizontal: 15,
     paddingVertical: 15,
   },
   optionText: {
     marginTop: 1,
     fontWeight: 'bold',
     fontSize: 16,
     textAlign:'right',
  },
  optionIconText: {
    marginTop: 1,
    fontWeight: 'bold',
    fontSize: 22,
    textAlign:'right',
   },
   toolbar: {
     height: 50,
     backgroundColor: '#ad241f',
   },
   container: {
      paddingTop: 2,
      backgroundColor: '#F7F7F7',
      flex: 1,
      justifyContent: 'flex-start',
   },
   header: {
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop: 5
    },
   headerText: {
     fontWeight: 'bold',
     fontSize: 16,
     color: 'black'
   },
   overview: {
      backgroundColor: '#fff',
      flexDirection: 'column',
      paddingTop: 5
   },
   overviewText: {
     fontWeight: 'bold',
     fontSize: 16,
     color: '#333'
   },
   activityIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   button: {
      height: 60,
      borderColor: '#05A5D1',
      borderWidth: 2,
      backgroundColor: '#333',
      margin: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   buttonText: {
      color: '#FAFAFA',
      fontSize: 20,
      fontWeight: '600',
   },
   optionsTitleText: {
     fontSize: 18,
     marginLeft: 15,
     marginTop: 8,
     marginBottom: 12,
   },
   optionsContainer: {
     borderBottomWidth: StyleSheet.hairlineWidth,
     borderBottomColor: '#EDEDED',
   },
   optionIconContainer: {
     marginRight: 9,
   },

});
