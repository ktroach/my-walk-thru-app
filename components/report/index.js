'use strict';

import React, { Component } from 'react';
import { Animated, Image, Linking, ActivityIndicator, TouchableOpacity, Platform, AsyncStorage, WebView, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import moment from 'moment';
import shortid from 'shortid';

import { WebBrowser } from 'expo';

import Animation from 'lottie-react-native';

const flexCenter = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
             progress: new Animated.Value(0),
            userId: '',
            loaded: false,
            reportUrl: ''
       };
    }

    componentDidMount() {
        Animated.timing(
            this.state.progress, {
            toValue: 1,
            duration: 5000,
        }).start();        
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

    _maybeReportLoading(){
        // console.log('ENTERED [_maybeReportLoading]');
        if (!this.state.loaded){
            return (
                <View style={{
                            alignSelf: 'center',
                            backgroundColor: '#fff',  		
                            borderRadius: 5}}>
                    <Animation
                            style={{
                                width: 200,
                                height: 200,
                            }}
                            source={require('../../assets/images//snap_loader_black.json')}
                            progress={this.state.progress}
                    />                    
                </View>
            );
        } else {
            return (
                <View style={{marginTop: 5}}>
                    <Button rounded block
                    style={{alignSelf: 'center',
                            marginTop: 1,
                            backgroundColor:'#2B59AC',
                            borderRadius:45,
                            width: 300,
                            height:40}}
                            onPress={() => this._openReport()}>
                        <Text style={{color:'#fff', fontWeight: 'bold'}}>Open Report</Text>
                    </Button>           
                </View>                  
            );
        }
    }

    // <View>
    //     <Button onPress={() => this._openReport()}>
    //        Open Report
    //     </Button>
    // </View>  

    renderLoadingView() {
      var screenHeight = Dimensions.get('window').height;
      return (
            <Container theme={theme} style={{backgroundColor: '#fff'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('Home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Your Walkthru Report</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                        <View>
                             <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                 Please wait while we get your Report ready...
                            </Text>
                        </View>     

                        <View style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#fff',  		
                                    borderRadius: 5}}>
                            <Animation
                                    style={{
                                        width: 200,
                                        height: 200,
                                    }}
                                    source={require('../../assets/images//snap_loader_black.json')}
                                    progress={this.state.progress}
                            />                    
                        </View>

                        {/* <View>
                            <ActivityIndicator
                                animating={!this.state.loaded}
                                style={[styles.activityIndicator, {height: screenHeight}]}
                                size="large"
                            />                            
                        </View>                     */}
                    </Content>
                </Image>

            </Container>          
      );
    }    

    popRoute() {
        this.props.popRoute();
    }

    // replaceRoute(route) {
    //     this.props.replaceRoute(route);
    // }

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
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

    _openReport = () => {
        if(!this.state.reportUrl) {
            alert('Failed to open Report');
            return;
        }        
        WebBrowser.openBrowserAsync(
            this.state.reportUrl
        );
    };       

    renderReport() {
        var screenWidth = Dimensions.get('window').width;
        return (
            <Container theme={theme} style={{backgroundColor: '#fff'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('Home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Your Walkthru Report</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>

                        <Card foregroundColor='#333'>

                            <CardItem header>
                                <Text>Your Report is ready for your review</Text>
                            </CardItem>    

                            <CardItem>
                                <Button rounded block
                                style={{alignSelf: 'center',
                                        marginTop: 1,
                                        backgroundColor:'#2B59AC',
                                        borderRadius:45,
                                        width: 300,
                                        height:40}}
                                        onPress={() => this._openReport()}>
                                    <Text style={{color:'#fff', fontWeight: 'bold'}}>Open Report</Text>
                                </Button>           
                            </CardItem>                                                     

                        </Card>                             


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
