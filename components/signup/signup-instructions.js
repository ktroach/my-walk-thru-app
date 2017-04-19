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

import Confetti from 'react-native-confetti';

var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },  
  slide5: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },    
  text: {
    color: '#0066cc',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export class SignUpInstructions extends Component {

    constructor(props){
        super(props);
        this.state = {
            formData:{}
        }
    } 

    componentDidMount() {
        if(this._confettiView) {
        this._confettiView.startConfetti();
        }
    }
  
    componentWillUnmount() {
        // if (this._confettiView)
        // {
        //     //   this._confettiView.stopConfetti();
        // }
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

    openTermsAndConditionsURL(){
        Linking.openURL('http://www.mywalkthru.com/');
    }

    proceedToSignUp(){
        this.replaceRoute('signup-user-info');
    }

    render(){
        return (
            <Swiper style={styles.wrapper} showsButtons={true} loop={false}>
                <View style={styles.slide1}>

                     <Confetti ref={(node) => this._confettiView = node} 
                         confettiCount={200} 
                         timeOut={10} /> 
                   
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{width: 200, height: 200}}
                    />
                                        
                    <Text style={styles.text}>Welcome to MyWalkThru!</Text>

                    <Text style={styles.text}>Let's begin!</Text>

                        <Button rounded block
                            style={{alignSelf: 'center',
                                marginTop: 40,
                                backgroundColor: '#ad241f',
                                borderRadius:90,
                                width: 200,
                                height:40}}
                                onPress={() => {
                                    this.proceedToSignUp();
                                }}
                            >
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>Sign Up</Text>
                        </Button>                     
                </View>

                {/*<View style={styles.slide2}>

                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{width: 200, height: 200}}
                    />

                    <Text style={styles.text}>First, we need to get some basic info...</Text>
                </View>

                <View style={styles.slide3}>

                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{width: 200, height: 200}}
                    />

                    <Text style={styles.text}>about the Property, your Lease, and You :)</Text>
                </View>


                <View style={styles.slide4}>

                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{width: 200, height: 200}}
                    />

                    <Text style={styles.text}>It will only take a few minutes...</Text>
                </View>                

                <View style={styles.slide5}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{width: 200, height: 200}}
                    />

                    <Text style={styles.text}>Let's begin!</Text>

                        <Button rounded block
                            style={{alignSelf: 'center',
                                marginTop: 40,
                                backgroundColor: '#ad241f',
                                borderRadius:90,
                                width: 200,
                                height:40}}
                                onPress={() => {
                                    this.proceedToSignUp();
                                }}
                            >
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>I'm Ready >>> </Text>
                        </Button> 
                </View>*/}

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

export default connect(null, bindActions)(SignUpInstructions);