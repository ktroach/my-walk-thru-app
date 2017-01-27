'use strict';

var React = require('react-native');

var {
    StyleSheet
} = React;

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 2,
        backgroundColor: '#F7F7F7',
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
    buttonContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
        paddingVertical: 10,
    },
    button: {
        width: 140,
        height: 40,
        borderRadius: 5,
        fontSize: 15,
        fontWeight: '300',
        color: '#000',
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: '#D7D7D7',
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
        fontSize: 16,
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