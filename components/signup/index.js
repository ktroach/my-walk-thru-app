import React, {
  PropTypes
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Signup extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
       return (
         <View style={styles.container}>
           <ScrollView
             style={styles.container}
             contentContainerStyle={styles.contentContainer}>

             <Text style={styles.titleText}>
                Signup Screen
             </Text>

           </ScrollView>
        </View>
       );
   }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  contentContainer: {
    paddingTop: 80,
  },
  titleText: {
    fontSize: 24,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    marginTop: 4,
    paddingBottom: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
