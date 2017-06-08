'use strict';

import React, { Component } from 'react';

import {
  AsyncStorage,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { connect } from 'react-redux';

import moment from 'moment';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Button, Icon, List, ListItem, Text } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

import * as Progress from 'react-native-progress';

import StepIndicator from 'react-native-step-indicator';

import MapView from 'react-native-maps';

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
            itemCount: 0,            
            userId: '', 
            completed: [],
            pending: [],
            alreadySubmitted: false,
            snappedFront: '',
            reviewDate: '',
            walkthruCompletedDate: ''        
       };
    }

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
        this.props.replaceRoute(route);
    }

    popRoute() {
        this.props.popRoute();
    }

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
                    AsyncStorage.getItem("snappedFront")
                    .then((snappedFront) =>
                    {
                        if(snappedFront && snappedFront.length>0){
                            this.setState({snappedFront: snappedFront});
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
                                      let df = moment(begin).format('MMMM Do YYYY, h:mm:ss a');

                                      this.setState({leaseBeginDate: df.toString()});

                                      let now = moment().format('M/D/YYYY');
                                      let dn = moment().format('MMMM Do YYYY, h:mm:ss a');

                                      this.setState({todaysDate: dn.toString()});
                                      
                                      let end = moment(begin).add(5, 'days');

                                      let expiresOn = moment(end).format('MMMM Do YYYY, h:mm:ss a');

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



    fetchItems(userId, cb) {

      // todo: hange this query to get the relation category with the items
      let query = 'https://mywalkthruapi.herokuapp.com/api/v1/PropertyCategory?filter={"where": {"rank": 999, "userId": "'+userId+'", "active": true}}';          

      console.log('>>>home>>>fetchItems>>>query:', query);
      console.log('>>>home>>>fetchItems>>>userId:', userId);

      fetch(query).then((response) => response.json()).then((responseData) => {
        this.setState({items: responseData, itemCount: responseData.length});
        cb(null, responseData);
      }).done();
    }       

    componentWillMount() {
      this.getUserId();
    }    

    componentDidMount() {
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



    render() {
      return (
          <Container theme={theme} style={{backgroundColor: '#fff'}}>
              <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                   <Header>

                       <Button transparent>
                           <Icon name='ios-happy-outline' style={{fontSize: 30, lineHeight: 32}} />
                       </Button>                     

                       <Title>Home</Title>

                       <Button transparent onPress={this.props.openDrawer} >
                           <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                       </Button>
                   </Header>
                   

                   <Content padder style={{backgroundColor: 'transparent'}}>
                        <View style={{paddingBottom: 10, marginTop: 10}}>
                          <Text style={{color:'#3B64C9', fontSize: 22, fontWeight: 'bold', alignSelf: 'center'}}>Welcome to your new Home!</Text>
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

                        <View style={{marginTop: 20}}>
                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 1,
                                  backgroundColor:'#87B6D8',
                                  borderRadius:45,
                                  width: 300,
                                  height:40}}
                                  onPress={() => this.replaceRoute('signup-property-photos')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>SNAP A PHOTO OF YOUR HOME</Text>
                        </Button>           
                        </View>                          

                        <View style={{marginTop: 20}}>
                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 1,
                                  backgroundColor:'#87B6D8',
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
                                  backgroundColor:'#87B6D8',
                                  borderRadius:45,
                                  width: 300,
                                  height:40}}
                                  onPress={() => this.replaceRoute('report')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>VIEW YOUR REPORT</Text>
                        </Button>           
                        </View>                          

                        {/*<View style={{marginTop: 20}}>
                        <Button rounded block
                          style={{alignSelf: 'center',
                                  marginTop: 1,
                                  backgroundColor:'#87B6D8',
                                  borderRadius:45,
                                  width: 300,
                                  height:40}}
                                  onPress={() => this.replaceRoute('submittal')}>
                            <Text style={{color:'#fff', fontWeight: 'bold'}}>SUBMIT YOUR WALKTHRU</Text>
                        </Button>           
                        </View>                          */}

                                 

                        <View style={{marginTop: 20}}>
                          <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>SCHEDULE</Text>
                          <List>
                              {/*<ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}} >Today: {this.state.todaysDate}</Text>
                              </ListItem>                            */}
                              <ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}}>Lease Begins:         
                                  <Text style={{color:'#666666'}}>           {this.state.leaseBeginDate}</Text>
                                </Text>
                              </ListItem>
                              <ListItem iconRight >
                                <Icon name='ios-time-outline' style={{color:'#666666'}} />
                                <Text style={{color:'#666666'}}>Walkthru Expires: 
                                  <Text style={{color:'#666666'}}>     {this.state.expiresOn}</Text>  
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
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}} onPress={() => this.replaceRoute('signup-property-photos')}>Take a Photo of the Front of the Property</Text>
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
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}} onPress={() => this.replaceRoute('signup-property-photos')}>Take a Photo of the Front of the Property</Text>
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

  _handleLearnMorePress = () => {
    Linking.openURL('http://www.onsightpros.com/');
  }

  _handleHelpPress = () => {
    Linking.openURL('http://www.onsightpros.com/');
  }

}


function bindAction(dispatch) {
    return {
        openDrawer: ()=>dispatch(openDrawer()),
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(Home);
