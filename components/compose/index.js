'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

class Compose extends Component {

    popRoute() {
        this.props.popRoute();
    }

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.popRoute()}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Semd Message</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={styles.box}>
                            <Card foregroundColor='#000'>
                                <CardItem header>
                                    <Text>Send MEssage tpo Properyy Manager</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text>To : kroach@gmail.com</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text>Subject: Enquiry about MWT</Text>
                                </CardItem>

                                <CardItem>
                                    <Text>
                                        tewt tets test tesetset test wets tewrtwrgwrglsl
                                    </Text>
                                </CardItem>

                                <CardItem header>
                                    <Button rounded style={{backgroundColor: '#00c497', paddingHorizontal: 15}} textStyle={{color: '#fff'}}>
                                        Send
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
        popRoute: () => dispatch(popRoute())
    }
}

export default connect(null, bindAction)(Compose);
