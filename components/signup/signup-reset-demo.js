'use strict';

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import {
    AsyncStorage,    
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Linking,
    TouchableHighlight, 
    Modal,
    Image,
} from 'react-native';

import { Button } from 'native-base';

import Swiper from 'react-native-swiper';

import Expo from 'expo';

var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },  
  text: {
    color: '#0066cc',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export class SignUpResetDemo extends Component {

    constructor(props){
        super(props);
        this.state = {
            loaded: false
        }
    } 

    componentDidMount() {

    }
    
    componentWillUnmount() {

    }       

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    pushNewRoute(route) {
        this.props.pushNewRoute(route);
    }

    popRoute() {
        this.props.popRoute();
    }  

    cancelLogout(){
        this.replaceRoute('home');
    }

    resetApp(){

        // AsyncStorage.removeItem("loggedin")
        //     .then( () => {
        //         console.log('Removed storage item: loggedin');
        //         alert('Goodbye!');
        //         Expo.Util.reload();
        //     }
        // ).done();        

        AsyncStorage.removeItem("signUpDate")
        .then( () =>
            {
                console.log('Removed storage item: signUpDate');

                AsyncStorage.removeItem("userId")
                .then( () => {

                    console.log('Removed storage item: userId');

                    AsyncStorage.removeItem("leaseBeginDate")
                    .then( () => {

                        AsyncStorage.removeItem("loggedin")
                            .then( () => {
                                console.log('Removed storage item: loggedin');
                                alert('Goodbye!');
                                Expo.Util.reload();
                            }
                        ).done(); 

                    }
                    ).done();
                }
                ).done();
            }
        )
        .done( );
        
    }

    render(){
        return (
            <Swiper style={styles.wrapper} showsButtons={true} loop={false}>          

                <View style={styles.slide1}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{width: 200, height: 200}}
                    />

                    <Text style={styles.text}>You can log back in later using your 4-digit pincode</Text>

                    <Button rounded block
                        style={{alignSelf: 'center',
                            marginTop: 40,
                            backgroundColor: '#ad241f',
                            borderRadius:90,
                            width: 200,
                            height:40}}
                            onPress={() => {
                                this.resetApp();
                            }}
                        >
                        <Text style={{color:'#fff', fontWeight: 'bold'}}>Logout</Text>
                    </Button> 

                    <Button rounded block
                        style={{alignSelf: 'center',
                            marginTop: 40,
                            backgroundColor: '#ad241f',
                            borderRadius:90,
                            width: 200,
                            height:40}}
                            onPress={() => {
                                this.cancelLogout();
                            }}
                        >
                        <Text style={{color:'#fff', fontWeight: 'bold'}}>Cancel</Text>
                    </Button>                     
                </View>

            </Swiper>         

        );
    }

}

function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindActions)(SignUpResetDemo);