'use strict';

import React, { Component } from 'react';
import { Image, Linking, ActivityIndicator, TouchableOpacity, Platform, AsyncStorage, WebView, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import { Checkbox } from 'nachos-ui';

import SignatureView from './SignatureView';

import theme from '../../themes/form-theme';
import styles from './styles';

import SignaturePad from 'react-native-signature-pad';

import moment from 'moment';
import shortid from 'shortid';

const flexCenter = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

class Submittal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            processStatus: '',
            firstChecked: false,
            data: null,
            signature: null,
            userId: '',
            loaded: false,
            reportUrl: ''
       };
    }

    componentDidMount() {
      AsyncStorage.getItem("userId")
      .then( (userId) =>
            {
                this.setState({loaded: true});
                return this.setState({userId: userId});
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
       Linking.openURL('http://www.mywalkthru.com/');
    }

    _showSignatureView() {
      this._signatureView.show(true);
    }

    _onSave(result) {
      const base64String = `data:image/png;base64,${result.encoded}`;
      this.setState({data: base64String});

      this._signatureView.show(false);
    }

    submitWalkThru(){
      // alert('Creating Walkthru Report...');

      this.setState({loaded: false});

    //   if(!this.state.userId){
    //     alert('UserId is invalid');
    //     return;
    //   }

    //   if (!this.state.firstChecked) {
    //     alert('Please confirm you want to proceed.');
    //     return;
    //   }

    //   if (!this.state.signature) {
    //     alert('Please sign off on your Walkthru to proceed');
    //     return;
    //   }

      this.setState({updating: true, processStatus: 'Creating Walkthru Report...'});

      var url = "https://mywalkthruapi.herokuapp.com/api/v1/Reports/pdfExport/"+this.state.userId;
      // var data = {userId: this.state.userId};

      let completionDate = moment().format();
      let now = new Date();
      let reportUrl = '';

      // console.log('data: ', data);

      fetch(url, {
           method: 'get',
           headers: {
             "Content-type": "application/json"
           }
      }).then((response) => response.json()).then((responseData) => {

            console.log('RESPONSEDATA: ', responseData);
            alert(responseData);

            if (!responseData) {
                alert('Sorry, there was a problem Submitting your Walkthru');
            } else {

                this.setState({loaded: true});
                this.setState({reportUrl: responseData.reportUrl});

                AsyncStorage.setItem("reportUrl", responseData.reportUrl)
                .then( () => 
                    {
                        AsyncStorage.setItem("completionDate", completionDate)
                        .then( () => 
                            {
                                alert('Thank you for Completing your Walkthru ('+completionDate+')');
                                this.replaceRoute('report');    
                            }
                        )
                        .done( );
                    }
                )
                .done( );                
            }
            
      }).done();

      // this.replaceRoute('home');
    }

    render() {
       if (!this.state.loaded) {
          return this.renderLoadingView();
       } else {
            return this.renderSubmittalForm();
       }
    }

    /*renderLoadingView() {
       return (
         <Container theme={theme} style={{backgroundColor: '#333'}}>
            <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                <Header>
                    <Button transparent onPress={() => this.replaceRoute('home')}>
                        <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                    </Button>

                    <Title>{this.state.processStatus}</Title>

                    <Button transparent onPress={this.props.openDrawer}>
                        <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                    </Button>
                </Header>
                <Content padder style={{backgroundColor: 'transparent'}}>
                   <ActivityIndicator
                       animating={this.state.updating}
                       style={[styles.activityIndicator, {height: 80}]}
                       size="large"
                   />
                </Content>
             </Image>
         </Container>
       );
    }*/

    _signaturePadError = (error) => {
      console.error(error);
    };

    _signaturePadChange = ({base64DataUrl}) => {
      console.log("Got new signature: " + base64DataUrl);
      this.setState({signature: base64DataUrl});
    };

    renderSubmittalForm() {
      const checkboxStyle = { margin: 5 }
      const {data} = this.state;
      var screenWidth = Dimensions.get('window').width;
        return (
            <Container theme={theme} style={{backgroundColor: '#fff'}}>
               <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                    <Header>
                        <Button transparent onPress={() => this.replaceRoute('home')}>
                            <Icon name='ios-arrow-back' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>

                        <Title>Submit Your Walkthru</Title>

                        <Button transparent onPress={this.props.openDrawer}>
                            <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                        </Button>
                    </Header>

                    <Content padder style={{backgroundColor: 'transparent'}}>
                     
{/*
                    <View style={{flex: 1, width: 500, height: 800}}>
                        <WebView
                            source={{uri: 'https://mywalkthruapi.herokuapp.com/api/v1/Reports/pdfExport/S1u55bQpx'}}
                            style={{width: screenWidth *.9, height: 800}}
                        />                        
                    </View>                         */}

                    {/*<View style={{flex: 1, width: 500, height: 800}}>
                        <WebView
                            source={{uri: 'https://mywalkthruapi.herokuapp.com/payment/'}}
                            style={{width: screenWidth *.9, height: 800}}
                        />                        
                    </View>                        */}

                        <View style={styles.box}>
                            <Card foregroundColor='#000'>
                                <CardItem header>
                                    <Text>Are you sure you want to Complete your WalkThru?</Text>
                                </CardItem>
                                <CardItem header>
                                    <Text>Check the circle to confirm you are ready</Text>
                                    <Checkbox
                                      style={checkboxStyle}
                                      kind='circle'
                                      checked={this.state.firstChecked}
                                      onValueChange={this.handleFirstCheckboxChange}
                                    ></Checkbox>
                                </CardItem>

                                {/*<CardItem header>
                                    <Text onPress={() => this.openLink()}>Tap HERE to Read the Checklist</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text onPress={() => this.openLink()}>Tap HERE to View Pending Items</Text>
                                </CardItem>*/}



                                {/*
                                <CardItem header>
                                    <Text>By Signing, you Agree that your WalkThru has been Completed:</Text>
                                    <TouchableOpacity onPress={this._showSignatureView.bind(this)}>
                                      <View style={[flexCenter, {padding: 10}]}>
                                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#333'}}>
                                          {data ? 'This is a your signature.' : 'SIGN HERE'}
                                        </Text>
                                        <View style={{paddingBottom: 10}} />
                                        {data &&
                                          <View style={{backgroundColor: 'white'}}>
                                            <Image
                                              resizeMode={'contain'}
                                              style={{width: 300, height: 300}}
                                              source={{uri: data}}
                                            />
                                          </View>
                                        }
                                      </View>
                                    </TouchableOpacity>
                                </CardItem>
                                */}

                                <CardItem>
                                    <Text>By Signing, you authorize a copy of this property review to go to my landlord/property manager:</Text>
                                </CardItem>                                    

                                <CardItem style={{height: 200}}>
                                  <View style={{flex: 1, borderWidth: 1,  borderColor: '#333'}}>
                                      <SignaturePad onError={this._signaturePadError}
                                                    onChange={this._signaturePadChange}
                                                    style={{flex: 1, backgroundColor: '#fff', borderWidth: 1,  borderColor: '#333'}}/>
                                  </View>
                                </CardItem>


                                <CardItem header>
                                    {/*
                                    <Button rounded block
                                      style={{backgroundColor: '#00c497', paddingHorizontal: 15}} textStyle={{color: '#fff'}}
                                      onPress={() => this.submitWalkThru()}>
                                        <Text>SUBMIT YOUR WALKTHRU</Text>
                                    </Button>
                                    */}
                                    <Button rounded block
                                      style={{alignSelf: 'center',
                                              marginTop: 40,
                                              backgroundColor: '#ad241f',
                                              borderRadius:90,
                                              width: 300,
                                              height:65}}
                                        onPress={() => this.submitWalkThru()}>
                                        <Text style={{color:'#fff', fontWeight: 'bold'}}>SUBMIT YOUR WALKTHRU</Text>
                                    </Button>
                                </CardItem>
                            </Card>






                        </View>





                    </Content>
                </Image>

                {/*
                <View style={{flex: 1}}>
                    <Text>By Signing, you Agree that your WalkThru has been Completed:</Text>
                    <SignaturePad onError={this._signaturePadError}
                                  onChange={this._signaturePadChange}
                                  style={{flex: 1, backgroundColor: 'white'}}/>
                </View>
                */}


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
