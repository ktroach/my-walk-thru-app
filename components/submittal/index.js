'use strict';

import React, { Component } from 'react';
import { Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

class Submittal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updating: false
       };
    }

    popRoute() {
        this.props.popRoute();
    }

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    submitWalkThru(){
      alert('Thank you for using MYWALKTHRU!');
      this.setState({updating: true});
      // this.replaceRoute('home');
    }

    render() {
       if (this.state.updating) {
          return this.renderLoadingView();
       }
       return this.renderSubmittalForm();
    }

    renderLoadingView() {
       return (
         <Container theme={theme} style={{backgroundColor: '#333'}}>
            <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                 <ActivityIndicator
                     animating={this.state.updating}
                     style={[styles.activityIndicator, {height: 80}]}
                     size="large"
                 />
             </Image>
         </Container>
       );
    }

    renderSubmittalForm() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Submit Walkthru</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={styles.box}>
                            <Card foregroundColor='#000'>
                                <CardItem header>
                                    <Text>Are you sure you want to Complete your WalkThru?</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text>Read Checklist</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text>View Pending Items</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text>Sign here to Complete your WalkThru </Text>
                                </CardItem>

                                <CardItem>
                                    <Text>
                                        Write Your Signature HERE
                                    </Text>
                                </CardItem>

                                <CardItem header>
                                    <Button rounded block
                                      style={{backgroundColor: '#00c497', paddingHorizontal: 15}} textStyle={{color: '#fff'}}
                                      onPress={() => this.submitWalkThru()}>
                                        <Text>SUBMIT YOUR WALKTHRU</Text>
                                    </Button>
                                </CardItem>
                            </Card>
                        </View>
                    </Content>
                </Image>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(Submittal);
