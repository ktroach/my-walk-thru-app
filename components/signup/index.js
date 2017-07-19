'use strict';

import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { pushNewRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, List, ListItem, Card, CardItem, InputGroup, Input } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

class Signup extends Component {

   constructor(props) {
      super(props);
      this.state = {
           email: '',
           fullName: '',
           scroll: false
      };
   }

//    replaceRoute(route) {
//       this.props.replaceRoute(route);
//    }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
    }

   pushNewRoute(route) {
        this.props.pushNewRoute(route);
   }

    popRoute() {
        this.props.popRoute();
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}} >
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Welcome to your new home!</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}} >
                        <Card transparent foregroundColor="#000">
                            <CardItem header>
                                <Text>What's your name</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-person" style={{color: '#000'}} />
                                    <Input placeholder="Full Name" placeholderTextColor="#878787" style={{color: '#000'}} />
                                </InputGroup>
                            </CardItem>
                            <CardItem header>
                                <Text>What's your Email address?</Text>
                            </CardItem>
                            <CardItem>
                                <InputGroup style={{borderColor: '#d5d5d5'}}>
                                    <Icon name="ios-mail-open-outline" style={{color: '#000'}} />
                                    <Input placeholder="EMAIL" placeholderTextColor="#878787" style={{color: '#000'}} />
                                </InputGroup>
                            </CardItem>
                        </Card>
                    </Content>

                    <Button rounded block style={{marginBottom: 20}} onPress={() => this.replaceRoute('compose', {email: this.state.email, fullName: this.state.fullName})}>
                        Next
                    </Button>
                </Image>
            </Container>
        )
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

export default connect(null, bindActions)(Signup);

// export default Signup

// import React, {
//   PropTypes
// } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
//
// export default class Signup extends React.Component {
//    constructor(props) {
//       super(props);
//    }
//
//    render() {
//        return (
//          <View style={styles.container}>
//            <ScrollView
//              style={styles.container}
//              contentContainerStyle={styles.contentContainer}>
//
//              <Text style={styles.titleText}>
//                 Signup Screen
//              </Text>
//
//            </ScrollView>
//         </View>
//        );
//    }
//
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#333',
//   },
//   contentContainer: {
//     paddingTop: 80,
//   },
//   titleText: {
//     fontSize: 24,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 23,
//     marginTop: 4,
//     paddingBottom: 10,
//     fontWeight: '800',
//     textAlign: 'center',
//   },
// });
