'use strict';

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import {
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
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export class SignUpComplete extends Component {

    constructor(props){
        super(props);
        this.state = {
            formData:{},
            test: '',
            leaseBeginDate: ''
        }
    } 

    componentWillMount(){
        this.getTenantId();
    }

  componentDidMount() {
    if(this._confettiView) {
       this._confettiView.startConfetti();
    }
  }

   getTenantId() {
     try {
        AsyncStorage.getItem("tenantId")
        .then( (tenantId) =>
              {
                this.setState({tenantId: tenantId});
                return tenantId;
              }
        )
        .done();
     } catch(err){
         console.log('Failed to get tenantId: ' + err);

         //REMOVE!!!
         let tenantId = '58decc07583ad3e4bab8b0ce';
         console.log('REMOVE!!! USING TEST TENANTID...')
         this.setState({tenantId: tenantId});

         return tenantId;

     }     

        // this.getTenantLeaseBeginDate(function(err,res){
        //     if (err){
        //         console.log('problem getting tenant lease begin date! ', err);
        //     } else {
        //         if (!res||res.length===0){
        //             console.log('problem getting tenant lease begin date!');
        //             return;
        //         }
        //         console.log('res.leaseBegin:', res.leaseBegin);
        //         let leaseBeginDate = res.leaseBegin;
        //         let raw = new Date(leaseBeginDate);
        //         console.log('raw:', raw);
        //         if (!raw) {
        //             return;
        //         }
        //         let formatted = raw.toDateString();
        //         if (!formatted) {
        //             return;
        //         }            
        //         console.log('formatted:', formatted);

        //         return formatted;
        //     }
        // });       
   }      

//   getTenantLeaseBeginDate(cb){
//       let id = this.state.tenantId;
//       console.log('>>>> id: ', id);
//     let url = 'https://mywalkthruapi.herokuapp.com/api/v1/Tenants/' + id;
//       fetch(url, {
//            method: 'get',
//            headers: {
//              "Content-type": "application/json"
//            }
//       }).then((response) => response.json()).then((responseData) => {
//          console.log('RESPONSEDATA: ', responseData);
//           if (!responseData) {
//              alert('Sorry, there was a problem getting your information!');
//           } else {
//             cb(null, responseData);
//           }

//       }).done();
//   }
  
    componentWillUnmount() {
        if (this._confettiView)
        {
            //   this._confettiView.stopConfetti();
        }
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

    proceedToWalkthru(){
        this.replaceRoute('signup-property-photos');
    }

    render(){
        return (
            <View>
                 
            
                <Swiper style={styles.wrapper} showsButtons={true} loop={false}>

                    <View style={styles.slide1}>

                        <Confetti ref={(node) => this._confettiView = node}/> 

                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />
                                            
                        <Text style={styles.text}>Awesome! You are Signed Up!</Text>
                    </View>

                    <View style={styles.slide2}>

                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />
                                            
                        <Text style={styles.text}>You will have exactly 5 days to complete</Text>
                        <Text style={styles.text}>your WalkThru from your Lease Begin Date</Text>

                        
                    </View>                    

                    <View style={styles.slide3}>
                        
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{width: 200, height: 200}}
                        />

                        <Text style={styles.text}>Now, you can start your Walkthru!</Text>

                            <Button rounded block
                                style={{alignSelf: 'center',
                                    marginTop: 40,
                                    backgroundColor: '#ad241f',
                                    borderRadius:90,
                                    width: 200,
                                    height:40}}
                                    onPress={() => {
                                        this.proceedToWalkthru();
                                    }}
                                >
                                <Text style={{color:'#fff', fontWeight: 'bold'}}>I'm Ready >>> </Text>
                            </Button>                     
                    </View>

                </Swiper> 

            </View>
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

export default connect(null, bindActions)(SignUpComplete);