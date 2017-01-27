'use strict';

var React = require('react-native');

var {
    StyleSheet
} = React;

// import Colors from '../../../constants/Colors';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 2,
        backgroundColor: '#F7F7F7',
    },
    contentContainer: {
      paddingTop: 2,
   },
    toolbar: {
        height: 50,
        backgroundColor: '#ad241f',
    },
    label: {
        borderWidth: 1,
        borderColor: '#D7D7D7',
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        padding: 15,
        borderRadius: 3,
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D7D7D7',
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        padding: 15,
        borderRadius: 3,
    },
    button: {
      borderRadius: 5,
      backgroundColor: '#EAEAEA',
      padding: 5,
      alignItems: 'center',
      alignSelf: 'center'
    },
    buttonText: {
      color: '#fff',
  },
});
