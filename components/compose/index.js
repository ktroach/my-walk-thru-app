'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View, List, ListItem, CheckBox } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

class Compose extends Component {

    popRoute() {
        this.props.popRoute();
    }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
    }       

    render() {
        return (
            <Container theme={theme} style={{backgroundColor: '#fff'}}>
                <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('Home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Check List</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <List>
                            <ListItem itemDivider>
                                <Text>Doors</Text>
                            </ListItem>
                            <ListItem >
                                <Text>Do all the doors open and shut easily?</Text>
                                 <CheckBox checked={false} />
                            </ListItem>
                            <ListItem itemDivider>
                                <Text>Appliances</Text>
                            </ListItem>
                            <ListItem>
                                <Text>Is the refrigerator running and odor free?</Text>
                                <CheckBox checked={false} />
                            </ListItem>
                            <ListItem>
                                <Text>Is the freezer defrosted?</Text>
                                <CheckBox checked={false} />
                            </ListItem>
                            <ListItem>
                                <Text>Check condition of the stove, microwave, and dishwasher</Text>
                                <CheckBox checked={false} />
                            </ListItem>      
                            <ListItem itemDivider>
                                <Text>Ceilings and Walls</Text>
                            </ListItem>
                            <ListItem >
                                <Text>Is there peeling paint?</Text>
                                <CheckBox checked={false} />
                            </ListItem>
                            <ListItem >
                                <Text>Cracked plaster?</Text>
                                <CheckBox checked={false} />
                            </ListItem>   
                            <ListItem >
                                <Text>Signs of mold or mildew?</Text>
                                <CheckBox checked={false} />
                            </ListItem>  
                            <ListItem >
                                <Text>Any holes or damage?</Text>
                                <CheckBox checked={false} />
                            </ListItem>                                                                                                                                   
                        </List>
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

export default connect(null, bindAction)(Compose);
