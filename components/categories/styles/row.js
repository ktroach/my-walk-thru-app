'use strict';

var React = require('react-native');

var { StyleSheet } = React;

module.exports = StyleSheet.create({
   container: {
      width: null,
      height: null,
      flex: 1
   },
   card: {
      borderWidth: 0
   },
   cardHeader: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      paddingBottom: 10,
      height: 65
   },
   cardItem: {
      backgroundColor: 'transparent',
      paddingTop: 5,
      paddingLeft: 55
   },
   date: {
      textAlign: 'right',
      marginTop: -15,
      fontSize: 13,
      fontWeight: '400',
      color: '#ddd'
   },
    labelLg: {
       fontSize: 18,
       fontWeight: '700',
       paddingHorizontal: 5,
       paddingVertical: 5,
       textAlign: 'left',
    },
     labelMd: {
        fontSize: 14,
        fontWeight: '400',
        paddingHorizontal: 5,
        paddingVertical: 5
     },
     labelSm: {
        fontSize: 12,
        fontWeight: '200',
        paddingHorizontal: 5,
        paddingVertical: 5
     },
   // date: {
   //    textAlign: 'right',
   //    marginTop: -35,
   //    fontSize: 13,
   //    fontWeight: '400',
   //    color: '#ddd'
   // },
   arrow: {
      textAlign: 'right',
      marginTop: -5,
      paddingTop: 10,
      fontSize: 13,
      fontWeight: '400',
      // color: '#ddd'
      color: '#333'
   }
  //  container: {
  //     backgroundColor: '#fff',
  //     borderWidth: 1,
  //     borderColor: '#E7E7E7',
  //     padding: 10,
  //     flex: 1,
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     marginBottom: 10,
  //     marginLeft: 10,
  //     marginRight: 10,
  //  },
  //  label: {
  //     fontSize: 18,
  //     fontWeight: '500',
  //     alignItems: 'center',
  //     alignSelf: 'center',
  //     paddingHorizontal: 5,
  //     paddingVertical: 5,
  //     textAlign: 'left',
  //  },
  //  labelLg: {
  //     fontSize: 18,
  //     fontWeight: '700',
  //     paddingHorizontal: 5,
  //     paddingVertical: 5,
  //     textAlign: 'left',
  //  },
  //  labelMd: {
  //     fontSize: 14,
  //     fontWeight: '400',
  //     paddingHorizontal: 5,
  //     paddingVertical: 5
  //  },
  //  labelSm: {
  //     fontSize: 12,
  //     fontWeight: '200',
  //     paddingHorizontal: 5,
  //     paddingVertical: 5
  //  },
  //  chevron: {
  //    padding: 5,
  //    alignItems: 'center',
  //    alignSelf: 'center'
  // },
  // chevronLg: {
  //   padding: 5,
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   marginTop: 5,
  // },
  //  doneButton: {
  //     borderRadius: 5,
  //     backgroundColor: '#EAEAEA',
  //     padding: 5,
  //     alignItems: 'center',
  //     alignSelf: 'center'
  //  },
  //  optionsTitleText: {
  //    fontSize: 16,
  //    marginLeft: 15,
  //    marginTop: 9,
  //    marginBottom: 12,
  //  },
  //  optionsContainer: {
  //    borderBottomWidth: StyleSheet.hairlineWidth,
  //    borderBottomColor: '#EDEDED',
  //  },
  //  optionIconContainer: {
  //    marginRight: 9,
  //  },
  //  option: {
  //    flexDirection: 'row',
  //    paddingHorizontal: 5,
  //    paddingVertical: 5,
  //  },
  //  optionText: {
  //    fontSize: 16,
  //    marginTop: 1,
  // },
});
