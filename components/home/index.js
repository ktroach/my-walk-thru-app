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
} from 'react-native';

import { connect } from 'react-redux';

import moment from 'moment';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Button, Icon, List, ListItem, Text } from 'native-base';

import theme from '../../themes/form-theme';
import styles from './styles';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            termsAccepted: "",
            termsAcceptedOn: "",
            deadlineDate: "",
            daysLeft: ""
       };
    }

    replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    popRoute() {
        this.props.popRoute();
    }

    getCurrentDateTime(){
      return moment().format('MMM DD YYYY h:mm:ss a');
    }

    componentDidMount(){
      var termsAccepted = false;
      var termsAcceptedOn = "";
      var deadlineDate = "";
      var daysLeft = "";

      AsyncStorage.getItem("termsAccepted").then((termsAccepted) => {
          this.setState({"termsAccepted": termsAccepted});
      }).then(res => {});

      AsyncStorage.getItem("termsAcceptedOn").then((termsAcceptedOn) => {
          this.setState({"termsAcceptedOn": termsAcceptedOn});
      }).then(res => {});

      if (termsAcceptedOn) {
         // daysLeft = moment(termsAcceptedOn).add(5, 'days').calendar();

         daysLeft = moment().add(5, 'days').calendar();
         alert('daysLeft:', daysLeft);

         deadlineDate = moment(termsAcceptedOn, "DD.MM.YYYY");
         deadlineDate.add(5, 'days');
         alert('deadlineDate:', deadlineDate);
      }

    }

    render() {
      return (
          <Container theme={theme} style={{backgroundColor: '#333'}}>
              <Image source={require('../../assets/images/glow2.png')} style={styles.container} >
                   <Header>
                       <Button transparent> </Button>

                       <Title>Home</Title>

                       <Button transparent onPress={this.props.openDrawer} >
                           <Icon name='ios-menu' style={{fontSize: 30, lineHeight: 32}} />
                       </Button>
                   </Header>

                   <Content padder style={{backgroundColor: 'transparent'}}>
                         <List>
                            <ListItem iconLeft >
                               <Icon name='ios-checkmark-circle-outline'/>
                               <Text>Completed Sign Up</Text>
                               <Text style={{fontWeight: '400'}} note>{this.state.termsAcceptedOn}</Text>
                            </ListItem>
                            <ListItem iconLeft >
                               <Icon name='ios-megaphone'/>
                               <Text>You have 5 days left to complete your Walk Thru. Better get busy.</Text>
                               <Text style={{fontWeight: '400'}} note>{this.state.deadlineDate}</Text>
                            </ListItem>
                        </List>

                       <Button transparent large style={styles.roundedButton} onPress={() => this.replaceRoute('categories')}>
                           <Icon name='ios-close-outline' />
                       </Button>
                   </Content>
              </Image>
          </Container>
      );
      //   return (
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
