'use strict';

import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

// import Button from './Button';

import { Container, Header, Title, Content, Button, Text, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import { SegmentedControls } from 'react-native-radio-buttons'

import stripe from 'tipsi-stripe'

class Step5 extends Component {
   state = {
     loading: false,
     token: null,
     params: {
       number: '4242424242424242',
       expMonth: 11,
       expYear: 17,
       cvc: '223',
       name: 'Test User',
       currency: 'usd',
     },
   }
   constructor(props) {
      super(props);
      // state = {
      //     loading: false,
      //     token: null,
      //     params: {
      //       number: '4242424242424242',
      //       expMonth: 11,
      //       expYear: 17,
      //       cvc: '223',
      //       name: 'Test User',
      //       currency: 'usd'
      // };
      // this.state = {
      //      email: '',
      //      fullName: '',
      //      scroll: false,
      //      selectedOption: 0,
      //      loading: false,
      //     token: null,
      // };
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

    handleCustomPayPress() {
        try {
          this.setState({
            loading: true,
            token: null,
          })
          var token = stripe.createTokenWithCard(this.state.params)
          console.log('Result:', token) // eslint-disable-line no-console
          this.setState({
            loading: false,
            token,
          })
        } catch (error) {
          console.log('Error:', error) // eslint-disable-line no-console
         //  this.setState({
         //    loading: false,
         //  })
        }
      }


      //   render() {
      //     const { loading, token, params } = this.state
        //
      //     return (
      //       <View style={styles.container}>
      //         <Text style={styles.header}>
      //           Custom Card Params Example
      //         </Text>
      //         <View style={styles.params}>
      //           <Text style={styles.instruction}>
      //             Number: {params.number}
      //           </Text>
      //           <Text style={styles.instruction}>
      //             Month: {params.expMonth}
      //           </Text>
      //           <Text style={styles.instruction}>
      //             Year: {params.expYear}
      //           </Text>
      //           <Text style={styles.instruction}>
      //             CVC: {params.cvc}
      //           </Text>
      //           <Text style={styles.instruction}>
      //             Name: {params.name}
      //           </Text>
      //           <Text style={styles.instruction}>
      //             Currency: {params.currency.toUpperCase()}
      //           </Text>
      //         </View>
      //         <Text style={styles.instruction}>
      //           Click button to get token based on params.
      //         </Text>
      //         <Button
      //           text="Pay with custom params"
      //           loading={loading}
      //           style={styles.button}
      //           accessible
      //           accessibilityLabel={'customCardButton'}
      //           onPress={this.handleCustomPayPress}
      //         />
      //         <View
      //           accessible
      //           accessibilityLabel={'customCardToken'}
      //           style={styles.token}>
      //           {token &&
      //             <Text style={styles.instruction}>
      //               Token: {token.tokenId}
      //             </Text>
      //           }
      //         </View>
      //       </View>
      //     )
      //   }
        //


   //  getOptions() {
   //    var options = [
   //     "Credit Card",
   //     "Apple Pay",
   //     "PayPal"
   //    ];
   //    return options;
   // }

   // createCreditCardToken(){
   //    return fetch('https://api.stripe.com/v1/tokens', {
   //      method: 'post',
   //      headers: {
   //        'Accept': 'application/json',
   //        'Content-Type': 'application/x-www-form-urlencoded',
   //        'Authorization': 'Bearer ' + '<YOUR-STRIPE-API-KEY>'
   //      },
   //      body: formBody
   //    });
   // }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('signup-step4')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>How do you want Pay?</Title>
                        <Text>For your security we do not store any Credit Card / Payment Information on our systems or on your device </Text>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>Credit Card</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-card" style={{color: '#000'}} />
                                    <Input placeholder="Credit Card" placeholderTextColor="#878787" style={{color: '#000'}} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>Name on Card</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-contact-outline" style={{color: '#000'}} />
                                    <Input placeholder="Cardholder Name" placeholderTextColor="#878787" style={{color: '#000'}} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>Expiration Date</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-calendar-outline" style={{color: '#000'}} />
                                    <Input placeholder="MM/YYYY" placeholderTextColor="#878787" style={{color: '#000'}} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>CVV</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-lock-outline" style={{color: '#000'}} />
                                    <Input placeholder="CVV" placeholderTextColor="#878787" style={{color: '#000'}} />
                                </InputGroup>
                            </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20, backgroundColor: '#ad241f'}} onPress={() => this.replaceRoute('signup-step6', {email: this.state.email, fullName: this.state.fullName})}>
                        Next
                    </Button>
                </Image>
            </Container>
        )
    }



}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   header: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instruction: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   button: {
//     margin: 10,
//     borderWidth: 1,
//   },
//   token: {
//     height: 20,
//   },
//   params: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     alignItems: 'flex-start',
//     margin: 5,
//   },
// });

function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        pushNewRoute:(route)=>dispatch(pushNewRoute(route)),
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindActions)(Step5);
