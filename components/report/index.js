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

    componentWillMount() {
      AsyncStorage.getItem("userId")
      .then( (userId) =>
            {
                this.setState({userId: userId});
                this.fetchReport(userId);
            }
      )
      .done();

    //   var url = "https://mywalkthruapi.herokuapp.com/api/v1/Reports/pdfExport/"+this.state.userId;

    //   AsyncStorage.getItem("reportUrl")
    //   .then( (reportUrl) =>
    //         {
    //             this.setState({loaded: true});
    //             return this.setState({reportUrl: reportUrl});
    //         }
    //   )
    //   .done();
    }


    fetchReport(userId){
        this.setState({loaded: false});

        var url = "https://mywalkthruapi.herokuapp.com/api/v1/Reports/pdfExport/"+userId+'?fileType=html&template=r1ndqRlxb&mode=prod';
        let reviewDate = moment().format();
        let now = new Date();
        let reportUrl = '';

        fetch(url, {
            method: 'get',
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => response.json()).then((responseData) => {
                console.log('RESPONSEDATA: ', responseData);
                if (!responseData) {
                    alert('Sorry, there was a problem generating your report');
                } else {

                    this.setState({loaded: true});
                    this.setState({reportUrl: responseData.reportUrl});   
                    
                    AsyncStorage.setItem("reviewDate", reviewDate).then(() => {}).done();                                   
                }
        }).done();
    }    


    renderLoadingView() {
      var screenHeight = Dimensions.get('window').height;
      return (
            <Container theme={theme} style={{backgroundColor: '#fff'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Your Walkthru Report</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View>
                             <Text>Getting Your Report Ready...</Text>
                        </View>     
                        <View>
                            <ActivityIndicator
                                animating={!this.state.loaded}
                                style={[styles.activityIndicator, {height: screenHeight}]}
                                size="large"
                            />                            
                        </View>                    
                    </Content>
                </Image>

            </Container>          
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

    render() {
       if (!this.state.loaded) {
            return this.renderLoadingView();
       } else {
            return this.renderReport();
       }
    }

    openReport(){
        if(!this.state.reportUrl) {
            alert('Failed to open Report');
            return;
        }
        Linking.openURL(this.state.reportUrl);
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

                        <Title>Your Walkthru Report</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        {/*<View style={{flex: 1, width: screenWidth *.97, height: 800}}>*/}
                        <View>
                            <Button onPress={() => this.openReport()}>
                               Open Report
                            </Button>
                            {/*<WebView
                                source={{uri: this.state.reportUrl}}
                                style={{width: screenWidth *.97, height: 800}}
                            />                        */}
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
