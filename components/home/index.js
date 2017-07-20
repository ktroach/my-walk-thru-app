'use strict';

import React, { Component } from 'react';

import {
  AsyncStorage,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';

import { connect } from 'react-redux';

import moment from 'moment';

// import { openDrawer } from '../../actions/drawer';
// import { popRoute, replaceRoute } from '../../actions/route';

import DrawBar from "../DrawBar";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import { setIndex } from "../../actions/list";
import { openDrawer } from "../../actions/drawer";

import { Container, Header, Title, Content, Button, Icon, List, ListItem, Text } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import * as Progress from 'react-native-progress';

import StepIndicator from 'react-native-step-indicator';

// import MapView from 'react-native-maps';

import { Indicator } from 'nachos-ui';

import Expo from 'expo';
import { WebBrowser } from 'expo';

import Config from '../../config'

const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize:40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: '#fe7013',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#aaaaaa',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 15,
  currentStepLabelColor: '#fe7013'
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            termsAccepted: "",
            termsAcceptedOn: "",
            leaseBeginsOn: "",
            deadlineDate: "",
            daysLeft: 0,
            progress: 0,
            indeterminate: true,
            progressValue: 0.10,
            leaseBegin: '',
            todaysDate: '',
            expiresOn: '',
            currentPosition: 0,
            steps: [],
            progressColor: '#fe7013',
            categories: [],
            categoryCount: 0,
            items: [],           
            userId: '', 
            completed: [],
            pending: [],
            alreadySubmitted: false,
            snappedFront: '',
            reviewDate: '',
            isWalkthruSubmitted: false,
            submittedDate: '',
            completedCount: 0,   
            itemCount: 0,
            percentComplete: 0   
       };
    }

    _handleNeedHelpPress = () => {
      WebBrowser.openBrowserAsync(
        'http://www.mywalkthru.com/#how-to-use'
      );
    };    

    _handleLearnMorePress = () => {
      WebBrowser.openBrowserAsync(
        'http://www.mywalkthru.com/#how-to-use'
      );
    };    

    animate() {
      let progress = 0;
      this.setState({ progress });
      setTimeout(() => {
        this.setState({ indeterminate: false });
        setInterval(() => {
          progress += Math.random() / 5;
          if (progress > 1) {
            progress = 1;
          }
          this.setState({ progress });
        }, 1000);
      }, 3000);
    }    

    replaceRoute(route) {
      console.log('>>>>> entered: [replaceRoute]: ', route);
      this.props.navigation.navigate(route);
    }

    // popRoute() {
    //     this.props.popRoute();
    // }

    getUserId() {
        let progressValue = 0.00;
        let daysLeft = 5;
        try {
            AsyncStorage
                .getItem("userId")
                .then((userId) => {
                    this.setState({userId: userId});   
                    this.setState({currentPosition: 1});
                    progressValue = 0.15;
                    //// snappedFront
                    AsyncStorage.getItem("submittedDate")
                    .then((submittedDate) =>
                    {
                        if(submittedDate && submittedDate.length>0){
                          // alert(submittedDate);
                            this.setState({submittedDate: submittedDate});
                            this.setState({isWalkthruSubmitted: true});
                            this.setState({currentPosition: 2});
                            progressValue = 0.20;
                        }
                        //// walkthruCompletedDate
                        AsyncStorage.getItem("walkthruCompletedDate")
                        .then((walkthruCompletedDate) =>
                        {
                          if(walkthruCompletedDate && walkthruCompletedDate.length>0){
                              this.setState({walkthruCompletedDate: walkthruCompletedDate});
                              this.setState({currentPosition: 3});
                              progressValue = 0.60;
                          }
                            //// reviewDate
                            AsyncStorage.getItem("reviewDate")
                            .then((reviewDate) =>
                            {
                              if(reviewDate && reviewDate.length>0){
                                  this.setState({reviewDate: reviewDate});
                                  this.setState({currentPosition: 4});
                                  progressValue = 0.75;
                              }
                                //// completionDate submitted on date
                                AsyncStorage.getItem("completionDate")
                                .then((completionDate) =>
                                {
                                  if(completionDate && completionDate.length>0){
                                      this.setState({alreadySubmitted: true});
                                      this.setState({completionDate: completionDate});
                                      this.setState({currentPosition: 5});
                                      progressValue = 0.95;
                                  }
                                  ////
                                  AsyncStorage.getItem("leaseBeginDate")
                                  .then((leaseBeginDate) =>
                                  {
                                      if (!leaseBeginDate){
                                        let bd = new Date();
                                        leaseBeginDate = bd.toString();
                                      }

                                      let begin = new Date(leaseBeginDate);
                                      let df = moment(begin).format('MMMM Do YYYY');
                                      // let df = moment(begin).format('MMMM Do YYYY, h:mm:ss a');

                                      this.setState({leaseBeginDate: df.toString()});

                                      let now = moment().format('M/D/YYYY');

                                      let dn = moment().format('MMMM Do YYYY');
                                      // let dn = moment().format('MMMM Do YYYY, h:mm:ss a');

                                      this.setState({todaysDate: dn.toString()});
                                      
                                      let end = moment(begin).add(5, 'days');

                                      let expiresOn = moment(end).format('MMMM Do YYYY');
                                      // let expiresOn = moment(end).format('MMMM Do YYYY, h:mm:ss a');

                                      this.setState({expiresOn: expiresOn.toString()});

                                      console.log('>>>AsyncStorage>>>begin', begin);
                                      console.log('>>>AsyncStorage>>>end', end);

                                      let a = moment(now, 'M/D/YYYY');
                                      let b = moment(end, 'M/D/YYYY');
                                      let daysLeft = b.diff(a, 'days');

                                      // alert(daysLeft);
                                      console.log('>>> daysLeft: ', daysLeft);

                                      if (daysLeft<0) {
                                        this.setState({progressValue: 1.0, progressColor: '#FF5640', daysLeft: 0});
                                        return;
                                      }                                         

                                      if (progressValue > 0.30 && daysLeft > 3) {
                                        this.setState({progressValue: progressValue, progressColor: '#8BCF62', daysLeft: daysLeft});
                                      }  else {
                                        this.setState({progressValue: progressValue, progressColor: '#F8CB43', daysLeft: daysLeft});
                                      }                 

                                  }
                                  )
                                  .done();
 
                                }
                                )
                                .done();

                            }
                            )
                            .done();

                        }
                        )
                        .done();
                      
                    }
                    )
                    .done();                        
                })
                .done();
        } catch (err) {
            console.log('Failed to get userId: ' + err);
        }
    }    

    getDaysLeft() {
      // var daysLeft = 0;
       AsyncStorage.getItem("leaseBeginDate")
       .then((leaseBeginDate) =>
          {
              console.log('>>>AsyncStorage>>>leaseBeginDate', leaseBeginDate);  

              // if (!leaseBeginDate){
              //   let bd = new Date();
              //   leaseBeginDate = bd.toString();
              // }

              // let begin = new Date(leaseBeginDate);
              // // let df = moment(begin).format('M/D/YYYY');
              // let df = moment(begin).format('MMMM Do YYYY, h:mm:ss a');

              // this.setState({leaseBeginDate: df.toString()});

              // let now = moment().format('M/D/YYYY');
              // let dn = moment().format('MMMM Do YYYY, h:mm:ss a');

              // this.setState({todaysDate: dn.toString()});
              
              // let end = moment(begin).add(5, 'days');

              // let expiresOn = moment(end).format('MMMM Do YYYY, h:mm:ss a');

              // this.setState({expiresOn: expiresOn.toString()});

              // console.log('>>>AsyncStorage>>>begin', begin);
              // console.log('>>>AsyncStorage>>>end', end);

              // let a = moment(now, 'M/D/YYYY');
              // let b = moment(end, 'M/D/YYYY');
              // let daysLeft = b.diff(a, 'days');

              // console.log('>>>AsyncStorage>>>daysLeft', daysLeft);

              // if (daysLeft > 0) {
              //   this.setState({daysLeft: daysLeft});
              // } else {
              //   this.setState({daysLeft: 0});
              // }

              let steps = [];

              steps.push('Signup Complete');
              steps.push('Photo of the Property');
              steps.push('Walkthru the Property');
              steps.push('Review your Walkthru Report');
              steps.push('Submit your Walkthru');
              steps.push('Move-in to your new home');
              
              this.setState({steps: steps});


              // alert(pv);
              // this.setState({progressValue: 0.14});

          }
       )
       .done();       
    }

    fetchUser() {
        AsyncStorage
          .getItem("userId")
          .then((userId) => {
              this.setState({userId: userId}); 
                if(!userId) return;
                let query = 'https://mywalkthruapi.herokuapp.com/api/v1/users?filter={"where": {"userId": "'+userId+'"}}';          

                console.log('>>>home>>>fetchUser>>>query:', query);
                console.log('>>>home>>>fetchUser>>>userId:', userId);

                fetch(query).then((response) => response.json()).then((responseData) => {
                  this.setState({user: responseData[0]});

                  this.fetchWalkthroughItems(responseData[0].userId);

                }).done();
          })
          .done();      
    } 

    fetchWalkthroughItems(userId) {
        console.log('>>> ENTERED: fetchWalkthroughItems');
        // let filter = '{"where": {"and": [{"rank": "999"},{"userId": "' + userId + '"}]}}';
        let query = Config.PROPERTY_ITEMS_API + '?filter={"where": {"rank": 999, "userId": "' + userId + '", "active": true}}';
        let count = 0;
        let categoryName = this.state.categoryName;
        let subcategories = [];
        let itemCount = 0;
        let pending = false;
        let completed = false;

        Array.prototype.contains = function (element) {
          return this.indexOf(element) > -1;
        };

        fetch(query).then((response) => response.json()).then((responseData) => {
          let count = responseData.length;
          if (categoryName === 'Hallway / Stairway') {
            let ds = [];
            let filter = [];
            filter.push('Flooring');
            filter.push('Ceiling');
            filter.push('Walls/Paint');
            filter.push('Doors');
            filter.push('Smoke Alarm');
            filter.push('Windows');
            filter.push('Switch Covers');
            responseData.forEach(function (item) {
              if (item.name) {
                if (filter.contains(item.name)) {
                  ds.push(item);
                }
              }
            });
            const data = ds;
            let seenNames = {};
            data = data.filter(function (currentObject) {
              if (currentObject.name in seenNames) {
                return false;
              } else {
                seenNames[currentObject.name] = true;
                return true;
              }
            });
            itemCount = data.length;

            subcategories = data;

          } else {

            itemCount = responseData.length;

            subcategories = responseData;
          }

          let completedCount = 0;

          // console.log(subcategories);

          subcategories.forEach(function(item) {
            if (item.dateObserved && item.dateObserved.length > 0) {
              completedCount++;
            }
          });

          console.log('itemCount/completedCount: ', itemCount, completedCount);

          let percentComplete = 0;
          if (itemCount>0&&completedCount>0){
            percentComplete = ((completedCount/itemCount)*100);
          }

          let status = '';
          let iconName = 'ios-arrow-dropright-outline';
          let iconColor = 'rgba(0, 122, 255, 1)';          

          if (itemCount === completedCount) {
            status = 'compeleted';
            iconName = 'ios-checkmark-circle-outline';
            iconColor = 'green'; 
          } else {
            status = 'pending';
            iconName = 'ios-arrow-dropright-outline';
            iconColor = '#fe7013';            
          }

          this.setState({
            itemCount: count, 
            completedCount: completedCount, 
            subcategories: subcategories, 
            status: status, 
            percentComplete: percentComplete
          });

        }).done();
    }
    

    componentWillMount() {
      this.getUserId();
      
    }    

    componentDidMount() {
      this.fetchUser();
      this.getDaysLeft();
    }

    onPageChange(position){
        this.setState({currentPosition: position});
    }    

    maybeRenderDaysLeft = () => {
      let { daysLeft } = this.state;
      if (daysLeft === 1){
        return(
          <Text style={{color:'rgba(0, 122, 255, 1)', fontWeight: 'bold', fontSize: 20}}> {this.state.daysLeft} DAY LEFT</Text>
        );
      } else {
        return(
          <Text style={{color:'rgba(0, 122, 255, 1)', fontWeight: 'bold', fontSize: 20}}> {this.state.daysLeft} DAYS LEFT</Text>
        );       
      }
    }

    signout(){
        AsyncStorage.removeItem("loggedin")
            .then( () => {
                console.log('Removed storage item: loggedin');
                alert('Goodbye!');
                Expo.Util.reload();
            }
        ).done();      
      // this.replaceRoute('signup-step-0');
    }

    maybeRenderSubmitYourWalkthru(){
      let isWalkthruSubmitted = this.state.isWalkthruSubmitted;
      let submittedDate = this.state.submittedDate;
      let percentComplete = this.state.percentComplete;
      if (!percentComplete) percentComplete = 0;
      percentComplete = Math.ceil(percentComplete);
      let percentCompleteStatus = percentComplete.toString() + '%';
      let submittedOn = '';
      if (submittedDate&&submittedDate.length>0){
        let submittedOnDate = new Date(submittedDate);
        if (submittedOnDate){
          submittedOn = submittedOnDate.toDateString();
        }
      }
      console.log('>>>>> maybeRenderSubmitYourWalkthru');
      if (isWalkthruSubmitted===true){
        return(
          <View>

            <View style={{marginTop: 5}}>
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 1,
                      backgroundColor:'#2B59AC',
                      borderRadius:45,
                      width: 300,
                      height:40}}
                      onPress={() => this.replaceRoute('signupPropertyPhotos')}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>SNAP A PHOTO OF YOUR HOME</Text>
            </Button>           
            </View>                          

            <View style={{marginTop: 20}}>
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 1,
                      backgroundColor:'#2B59AC',
                      borderRadius:45,
                      width: 300,
                      height:40}}
                      onPress={() => this.replaceRoute('categories')}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>WALKTHRU YOUR HOME</Text>
            </Button>           
            </View>            

            <View style={{marginTop: 20}}>
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 1,
                      backgroundColor:'#2B59AC',
                      borderRadius:45,
                      width: 300,
                      height:40}}
                      onPress={() => this.replaceRoute('report')}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>VIEW YOUR REPORT</Text>
            </Button>           
            </View>  
           
            <View style={{marginTop: 25}}>
              <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>
                PROGRESS
              </Text>
              <List>
                  <ListItem iconRight >
                    <Icon name='ios-stats-outline' style={{color:'#2B59AC'}} />
                    <Text style={{color:'#2B59AC'}}>
                      Completed: {percentCompleteStatus}
                    </Text>
                  </ListItem>                
                  <ListItem iconRight >
                    <Icon name='ios-stopwatch-outline' style={{color:'#2B59AC'}} />
                    <Text style={{color:'#2B59AC'}}>
                      Submitted: {submittedOn}         
                    </Text>
                  </ListItem>                            
              </List>
            </View> 
          </View>
        );
      } else {
        return(
          <View>

            <View style={{marginTop: 20}}>
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 1,
                      backgroundColor:'#2B59AC',
                      borderRadius:45,
                      width: 300,
                      height:40}}
                      onPress={() => this.replaceRoute('signupPropertyPhotos')}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>SNAP A PHOTO OF YOUR HOME</Text>
            </Button>           
            </View>                          

            <View style={{marginTop: 20}}>
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 1,
                      backgroundColor:'#2B59AC',
                      borderRadius:45,
                      width: 300,
                      height:40}}
                      onPress={() => this.replaceRoute('categories')}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>WALKTHRU YOUR HOME</Text>
            </Button>           
            </View>            

            <View style={{marginTop: 20}}>
            <Button rounded block
              style={{alignSelf: 'center',
                      marginTop: 1,
                      backgroundColor:'#2B59AC',
                      borderRadius:45,
                      width: 300,
                      height:40}}
                      onPress={() => this.replaceRoute('report')}>
                <Text style={{color:'#fff', fontWeight: 'bold'}}>VIEW YOUR REPORT</Text>
            </Button>           
            </View>              

            <View style={{marginTop: 20}}>
              <Button rounded block
                style={{alignSelf: 'center',
                        marginTop: 1,
                        backgroundColor:'#2B59AC',
                        borderRadius:45,
                        width: 300,
                        height:40}}
                        onPress={() => this.replaceRoute('submittal')}>
                  <Text style={{color:'#fff', fontWeight: 'bold'}}>SUBMIT YOUR WALKTHRU</Text>
              </Button>           
            </View> 

            <View style={{marginTop: 25}}>
              <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>
                PROGRESS
              </Text>
              <List>
                  <ListItem iconRight >
                    <Icon name='ios-stats-outline' style={{color:'#2B59AC'}} />
                    <Text style={{color:'#2B59AC'}}>
                      Completed: {percentCompleteStatus}
                    </Text>
                  </ListItem>                
                  <ListItem iconRight >
                    <Icon name='ios-stopwatch-outline' style={{color:'#2B59AC'}} />
                    <Text style={{color:'#2B59AC'}}>
                      Submitted: Pending         
                    </Text>
                  </ListItem>                            
              </List>
            </View>  

          </View>
        );
      }

    }

    render() {

      const IndicatorExample = () => {
        const imageStyle = {
          width: 50,
          height: 50,
          borderRadius: 10,
        };
        const indicatorStyle = {
          marginRight: 1,
        };  
      };  

     let screenWidth = Dimensions.get('window').width - 20;
     let screenHeight = Dimensions.get('window').height; 
     
     if(screenWidth>0) screenWidth = screenWidth * 0.8;

     let address1 = '';
     if (this.state.user&&this.state.user.property&&this.state.user.property.address1){
        address1 = this.state.user.property.address1;
     }



      const needHelpLink = (
        <Text onPress={this._handleNeedHelpPress} 
              style={{color:'#d9333b', fontWeight: 'bold', fontSize: 18, alignSelf: 'center'}}>
          Need Help? 
        </Text>
      );     
      
      return (
          <Container theme={theme} style={{backgroundColor: '#fff'}}>
              <Image source={require('../../assets/images/login2.jpg')} style={styles.container} >

                   <Header  style={{backgroundColor: '#2B59AC'}}>

                      <Button
                        transparent
                        onPress={() => {
                          this.replaceRoute("sendMessageToPM");

                          {/* DrawerNav.dispatch(
                            NavigationActions.reset({
                              index: 0,
                              actions: [NavigationActions.navigate({ routeName: "Home" })]
                            })
                          );
                          DrawerNav.goBack(); */}
                        }}
                      >
                        <Indicator
                          position='right top'
                          value='1'
                          style={IndicatorExample.indicatorStyle} 
                          
                        >
                          <Image
                            style={{width:28,height:28}}
                            source={require('../../assets/images/notification-outline.png')}
                          />
                        </Indicator>
                      </Button>          


                       {/* <Button transparent onPress={() => this.replaceRoute('signupPropertyPhotos')}>
                          <Indicator
                            position='right top'
                            value='1'
                            style={IndicatorExample.indicatorStyle} 
                            
                          >
                            <Image
                              style={{width:28,height:28}}
                              source={require('../../assets/images/notification-outline.png')}
                            />
                          </Indicator>
                       </Button>                      */}

                       <Title>Home</Title>

                       <Button transparent onPress={() => DrawerNav.navigate("DrawerOpen")} >
                           <Icon name='ios-menu' style={{fontSize: 30, color: '#fff'}} />
                       </Button>
                   </Header>
                   

                   <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={{paddingBottom: 10, marginTop: 10}}>
                          <Text style={{color:'#d9333b', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>
                            WELCOME TO YOUR NEW HOME
                          </Text>
                        </View>  

                        <View style={{marginTop: 10}}>
                          <View style={{paddingBottom: 10}}>
                            <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16, alignSelf: 'center'}}>
                              {address1} 
                            </Text>
                          </View>

                          <View style={{alignSelf: 'center', marginTop: 5}}>
                            <Image
                              style={{width:screenWidth,height:210}}
                              source={require('../../assets/images/3d-house-1.png')}
                            />
                          </View>  

                        </View>                                               

                        <View style={{marginTop: 10}}>
                          {needHelpLink}
                        </View>

                        {/*<View style={styles.progressContainer}>
                          <Text style={{color:'#3B64C9', fontWeight: 'bold', fontSize: 20}}>YOU HAVE </Text>
                          <View style={styles.circles}>
                            <Progress.Pie
                              style={styles.progress}
                              progress={this.state.progressValue} 
                              size={150}
                              showsText={true} 
                              color={this.state.progressColor}
                            />
                          </View>

                          {this.maybeRenderDaysLeft()}

                        </View>        */}

                        {/*<View style={{marginTop: 20}}>
                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 1,
                                  backgroundColor:'#2B59AC',
                                  borderRadius:45,
                                  width: 300,
                                  height:40}}
                                  onPress={() => this.replaceRoute('signupPropertyPhotos')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>SNAP A PHOTO OF YOUR HOME</Text>
                        </Button>           
                        </View>                          

                        <View style={{marginTop: 20}}>
                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 1,
                                  backgroundColor:'#2B59AC',
                                  borderRadius:45,
                                  width: 300,
                                  height:40}}
                                  onPress={() => this.replaceRoute('categories')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>WALKTHRU YOUR HOME</Text>
                        </Button>           
                        </View>     */}

                        {/*<View style={{marginTop: 20}}>
                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 1,
                                  backgroundColor:'#2B59AC',
                                  borderRadius:45,
                                  width: 300,
                                  height:40}}
                                  onPress={() => this.replaceRoute('report')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>VIEW YOUR REPORT</Text>
                        </Button>           
                        </View>                          */}

                        { this.maybeRenderSubmitYourWalkthru() }
         

                        <View style={{marginTop: 25}}>
                          <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>
                            SCHEDULE
                          </Text>
                          <List>
                              {/*<ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}} >Today: {this.state.todaysDate}</Text>
                              </ListItem>                            */}
                              <ListItem iconRight >
                                <Icon name='ios-calendar-outline' style={{color:'#2B59AC'}} />
                                <Text style={{color:'#2B59AC'}}>
                                  Lease Begins: {this.state.leaseBeginDate}         
                                </Text>
                              </ListItem>
                              <ListItem iconRight >
                                <Icon name='ios-calendar-outline' style={{color:'#2B59AC'}} />
                                <Text style={{color:'#2B59AC'}}>
                                  Walkthru Expires: {this.state.expiresOn}
                                </Text>
                              </ListItem>                              
                          </List>
                        </View>      

                        {/*<View style={{marginTop: 10, paddingHorizontal:10}}>
                          <View>
                            <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>STEPS</Text>  
                          </View>
                          <View style={{marginTop: 10}}>
                            <StepIndicator
                                customStyles={stepIndicatorStyles}
                                currentPosition={this.state.currentPosition}
                                labels={this.state.steps} 
                                direction='horizontal'
                                stepCount={this.state.steps.length}
                            /> 
                          </View>                         
                        </View>      */}

                        {/*<View style={{marginTop: 20}}>
                          <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>STATUS</Text>
                          <List>
                              <ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}} >Property Areas: {this.state.items.length}</Text>
                              </ListItem>                            
                              <ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}} >Areas Completed: {this.state.completed.length}</Text>
                              </ListItem>
                              <ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}} >Areas Pending: {this.state.pending.length}</Text>
                              </ListItem>                              
                          </List>
                        </View>                                                       */}

                        {/*<View style={{marginTop: 20}}>
                          <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>COMPLETED</Text>
                          <List>
                              <ListItem iconRight >
                                <Icon name='ios-checkmark-circle-outline' style={{color:'green'}} />
                                <Text style={{fontWeight: 'bold', color:'green'}} >Completed Sign Up</Text>
                              </ListItem>
                          </List>
                        </View>*/}
{/*
                        <View style={{marginTop: 20}}>
                        <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>IN PROGRESS</Text>
                         <List>
                            <ListItem iconRight>
                              <Icon name='ios-arrow-forward' style={{color:'rgba(0, 122, 255, 1)'}} />
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}} onPress={() => this.replaceRoute('signupPropertyPhotos')}>Take a Photo of the Front of the Property</Text>
                            </ListItem>
                            <ListItem iconRight>
                              <Icon name='ios-arrow-forward' style={{color:'rgba(0, 122, 255, 1)'}} />
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}} 
                                    onPress={() => this.replaceRoute('categories')}>
                                Start your Walkthru on the Property</Text>
                            </ListItem>                            

                        </List>           
                        </View>                          */}

                        {/*

                        <View style={{marginTop: 10}}>
                        <Text style={{color:'#333', fontWeight: 'bold'}}>PENDING</Text>
                         <List>
                            <ListItem iconRight>
                              <Icon name='ios-arrow-forward' style={{color:'rgba(0, 122, 255, 1)'}} />
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}} onPress={() => this.replaceRoute('signupPropertyPhotos')}>Take a Photo of the Front of the Property</Text>
                            </ListItem>
                            <ListItem iconRight>
                              <Icon name='ios-arrow-forward' style={{color:'rgba(0, 122, 255, 1)'}} />
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}}  onPress={() => this.replaceRoute('submittal')}>Submit your Walkthru for approval</Text>
                            </ListItem>                            
                        </List>           
                        </View>                            

                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 40,
                                  backgroundColor: '#ad241f',
                                  borderRadius:90,
                                  width: 300,
                                  height:65}}
                          onPress={() => this.replaceRoute('categories')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>ADD A PHOTO OF THE PROPERTY</Text>
                        </Button>

                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 40,
                                  backgroundColor: '#ad241f',
                                  borderRadius:90,
                                  width: 300,
                                  height:65}}
                          onPress={() => this.replaceRoute('categories')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>CONTINUE YOUR WALKTHRU</Text>
                        </Button>   

                          <Button rounded block
                             style={{alignSelf: 'center',
                                  marginTop: 40,
                                  backgroundColor: '#ad241f',
                                  borderRadius:90,
                                  width: 300,
                                  height:65}}
                            onPress={() => this.replaceRoute('categories')}>
                              <Text>WALKTHRU PROGRESS CHARTS</Text>
                          </Button>

                       <Button rounded block
                          style={{alignSelf: 'center',
                               marginTop: 40,
                               backgroundColor: '#ad241f',
                               borderRadius:90,
                               width: 300,
                               height:65}}
                         onPress={() => this.replaceRoute('submittal')}>
                           <Text style={{color:'#fff', fontWeight: 'bold'}}>SUBMIT WALKTHRU FOR APPROVAL</Text>
                       </Button>                          
                          */}




                   </Content>



              </Image>
          </Container>
      );
      //   return (

      // <Button transparent large style={styles.roundedButton} onPress={() => this.replaceRoute('categories')}>
      //     <Icon name='ios-close-outline' />
      // </Button>


      //      <Container theme={theme} style={{backgroundColor: '#333'}}>
      //        <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
        //
        //
      //          <View style={styles.welcomeContainer}>
      //            <Image
      //              source={require('../../assets/images/mwt-full-logo.png')}
      //              style={styles.welcomeImage}
      //            />
      //          </View>
        //
      //          <Text style={styles.appTitleText}>
      //             WELCOME TO MYWALKTHRU
      //          </Text>
        //
      //          <View style={styles.getStartedContainer}>
      //            {this._renderWelcomeText()}
      //          </View>
        //
      //          <Button transparent large style={styles.roundedButton} onPress={() => this.replaceRoute('signup-step-1')}>
      //              <Icon name='ios-close-outline' />
      //          </Button>
        //
      //          <View style={styles.helpContainer}>
      //            <TouchableOpacity onPress={this._handleLearnMorePress} style={styles.helpLink}>
      //              <Text style={styles.helpLinkText}>
      //                Learn more on our website
      //              </Text>
      //            </TouchableOpacity>
      //          </View>
        //
      //        <View style={styles.tabBarInfoContainer}>
      //          <Text style={styles.tabBarInfoText}>
      //             ® 2016 OnSight PROS
      //          </Text>
      //          <Text style={styles.legalInfoText}>
      //             OnSight PROS is a service provided to landlords, property managers, and insurance companies and the reports reflect the condition of the property on the date of the Report. These reports are provided by trained individuals. This report is not to be mistaken with the report one will receive by a licensed inspector in a particular state.
      //          </Text>
      //          <Text style={styles.tabBarInfoText}>Version {pak.version}</Text>
      //        </View>
      //        </Image>
      //    </Container>
      //   )
    }

    _renderWelcomeText() {
        return (
          <Text style={styles.welcomeText}>
            Your property manager has made good documentation about the condition of your home and it is important for you to do the same.
          </Text>

        );
    }
    


  _handleGetStartedPressed() {
     Linking.openURL('http://www.onsightpros.com/');
  }

  // _handleLearnMorePress = () => {
  //   WebBrowser.openBrowserAsync(
  //     'https://docs.expo.io/versions/latest/guides/development-mode'
  //   );
  // };

  _handleHelpPress = () => {
    Linking.openURL('http://www.onsightpros.com/');
  }

}


// function bindAction(dispatch) {
//     return {
//         openDrawer: ()=>dispatch(openDrawer()),
//         popRoute: () => dispatch(popRoute()),
//         replaceRoute:(route)=>dispatch(replaceRoute(route))
//     }
// }

// export default connect(null, bindAction)(Home);


function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer())
  };
}
const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list
});

const HomeSwagger = connect(mapStateToProps, bindAction)(Home);
const DrawNav = DrawerNavigator(
  {
    Home: { screen: HomeSwagger }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
);
const DrawerNav = null;
DrawNav.navigationOptions = ({ navigation }) => {
  DrawerNav = navigation;
  return {
    header: null
  };
};
export default DrawNav;