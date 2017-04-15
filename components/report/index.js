'use strict';

import React, { Component } from 'react';
import { Image, Linking, ActivityIndicator, TouchableOpacity, Platform, AsyncStorage, WebView, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import moment from 'moment';
import shortid from 'shortid';

const flexCenter = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            loaded: false,
            reportUrl: ''
       };
    }

    componentDidMount() {
      AsyncStorage.getItem("reportUrl")
      .then( (reportUrl) =>
            {
                this.setState({loaded: true});
                return this.setState({reportUrl: reportUrl});
            }
      )
      .done();
    }

    renderLoadingView() {
      return (
         <Content style={styles.sidebar} >
             <Image source={require('../../assets/images/house02.jpg')} style={styles.container} >
                 <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large"
                />
             </Image>
         </Content>
      );
    }    

    popRoute() {
        this.props.popRoute();
    }

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    handleFirstCheckboxChange = (firstChecked) => {
      this.setState({ firstChecked })
    }

    openLink() {
        if (this.state.reportUrl){
             Linking.openURL(this.state.reportUrl);
        }
    }

    render() {
       if (!this.state.loaded) {
            return this.renderLoadingView();
       } else {
            return this.renderReport();
       }
    }

    renderReport() {
        var screenWidth = Dimensions.get('window').width;
        return (
            <Container theme={theme} style={{backgroundColor: '#fff'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Tenant Walkthru Report</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={{flex: 1, width: screenWidth *.9, height: 800}}>
                            <WebView
                                source={{uri: this.state.reportUrl}}
                                style={{width: screenWidth *.9, height: 800}}
                            />                        
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

export default connect(null, bindAction)(Report);
