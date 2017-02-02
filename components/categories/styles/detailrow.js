'use strict';

var React = require('react-native');

var {
    StyleSheet
} = React;

module.exports = StyleSheet.create({
   container: {
      flex: 1,
      width: null,
      height: null,
   },
   //  container: {
   //      flex: 1,
   //      justifyContent: 'flex-start',
   //      paddingTop: 2,
   //      backgroundColor: '#F7F7F7',
   //  },
    scrollviewcontainer: {
      flex: 1,
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
    contentContainer: {
      paddingTop: 80,
    },
    thumbnailsContainer: {
      flex: 1,
      paddingTop: 5,
      paddingHorizontal: 5,
      backgroundColor: '#F5FCFF',
      borderWidth: 1,
      borderColor: '#0000ff',
      width: 1000,
      height: 500
    },
    imageStyle: {
      width: 70,
      height: 70,
      marginTop: 5,
      backgroundColor: 'gray'
   },
    subHeaderBar: {
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E7E7E7',
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
      height: 50,
      backgroundColor: '#ad241f',
      borderColor: '#333',
      alignSelf: 'stretch',
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
   },
   buttonText: {
      alignText: 'center'
      color: '#fff',
   },
    toolbar: {
        height: 50,
        backgroundColor: '#ad241f',
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
        fontSize: 20,
        color: 'black'
    },
    sectionHeader: {
        backgroundColor: '#831d19',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});
