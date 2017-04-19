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

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            termsAccepted: "",
            termsAcceptedOn: "",
            leaseBeginsOn: "",
            deadlineDate: "",
            daysLeft: "",
            progress: 0,
            indeterminate: true,
            progressValue: 0.10
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

    getCurrentDateTime() {
      return moment().format('MMM DD YYYY h:mm:ss a');
    }

    getDaysLeft() {
      let now = new Date();
      // var start = moment(start).add(-2, 'days');
      let start = new Date();
      
      if (this.state.leaseBeginsOn) {
        start = this.state.leaseBeginsOn;
      }

      

      var end = moment(start).add(5, 'days');

      var daysLeft = Math.floor(( end - now ) / 86400000);

      return daysLeft;
    }

    getDueDate() {
      var now = new Date();
      var start = new Date();

      if (this.state.leaseBeginsOn) {
        start = this.state.leaseBeginsOn;
      }

      var end = moment(start).add(5, 'days');

      return moment(end).calendar();
    }

    componentDidMount(){
      var termsAccepted = false;
      var termsAcceptedOn = "";
      var leaseBeginsOn = "";
      var deadlineDate = "";
      var daysLeft = "";

      // daysLeft = moment().add(5, 'days').calendar();

      //USE leaseBeginDate

      AsyncStorage.getItem("termsAccepted").then((termsAccepted) => {
          this.setState({"termsAccepted": termsAccepted});
      }).then(res => {});

      AsyncStorage.getItem("termsAcceptedOn").then((termsAcceptedOn) => {
          this.setState({"termsAcceptedOn": termsAcceptedOn});
      }).then(res => {});

      AsyncStorage.getItem("leaseBeginDate").then((leaseBeginDate) => {
          leaseBeginsOn = leaseBeginDate;
          this.setState({"leaseBeginsOn": leaseBeginDate});
      }).then(res => {});

      if (leaseBeginsOn) {
         // daysLeft = moment(termsAcceptedOn).add(5, 'days').calendar();

         daysLeft = moment().add(5, 'days').calendar();
         
         alert('daysLeft:', daysLeft);

         deadlineDate = moment(leaseBeginsOn, "DD.MM.YYYY");
         deadlineDate.add(5, 'days');

         alert('deadlineDate:', deadlineDate);



      }

      // this.animate();

    }

// <View style={styles.progressContainer}>
// <View style={styles.circles}>
// <Progress.Circle
//   style={styles.progress}
//   progress={this.state.progress}
//   indeterminate={this.state.indeterminate}
//   showsText={true}
// />
// </View>
// </View> 

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

                        <View style={styles.progressContainer}>
                          <Text style={{color:'rgba(0, 122, 255, 1)', fontWeight: 'bold', fontSize: 20}}>YOU HAVE </Text>
                          <View style={styles.circles}>
                            <Progress.Pie
                              style={styles.progress}
                              progress={this.state.progressValue} 
                              size={200}
                              showsText={true} 
                              color='green'
                            />
                          </View>
                          <Text style={{color:'rgba(0, 122, 255, 1)', fontWeight: 'bold', fontSize: 20}}> {this.getDaysLeft()} DAYS LEFT</Text>
                        </View>                      

                        <View style={{marginTop: 20}}>
                        <Text style={{color:'#333', fontWeight: 'bold', fontSize: 16}}>COMPLETED</Text>
                         <List>
                            <ListItem iconRight >
                               <Icon name='ios-checkmark-circle-outline' style={{color:'green'}} />
                               <Text style={{fontWeight: 'bold', color:'green'}} >Completed Sign Up</Text>
                            </ListItem>
                        </List>
                        </View>

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
                            {/*<ListItem iconRight>
                              <Icon name='ios-arrow-forward' style={{color:'rgba(0, 122, 255, 1)'}} />
                              <Text style={{fontWeight: 'bold', color:'rgba(0, 122, 255, 1)'}}  onPress={() => this.replaceRoute('submittal')}>Submit your Walkthru for approval</Text>
                            </ListItem>                             */}
                        </List>           
                        </View>                          

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
