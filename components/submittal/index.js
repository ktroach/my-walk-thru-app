'use strict';

import React, { Component } from 'react';
import { Image, Linking, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

import { Checkbox } from 'nachos-ui';

import SignatureView from './SignatureView';

import theme from '../../themes/form-theme';
import styles from './styles';

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
            data: null
       };
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

      if (!this.state.firstChecked) {
        alert('Please check the confirmation circle to proceed.');
        return;
      }

      if (!this.state.data) {
        alert('Please sign off on your Walkthru to proceed');
        return;
      }

      this.setState({updating: true, processStatus: 'Creating Walkthru Report...'});

      // this.replaceRoute('home');
    }

    render() {
       if (this.state.updating) {
          return this.renderLoadingView();
       }
       return this.renderSubmittalForm();
    }

    renderLoadingView() {
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
    }

    renderSubmittalForm() {
      const checkboxStyle = { margin: 5 }
      const {data} = this.state;
        return (
            <Container theme={theme} style={{backgroundColor: '#333'}}>
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

                                <CardItem header>
                                    <Text onPress={() => this.openLink()}>Tap HERE to Read the Checklist</Text>
                                </CardItem>

                                <CardItem header>
                                    <Text onPress={() => this.openLink()}>Tap HERE to View Pending Items</Text>
                                </CardItem>

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
                                    <SignatureView
                                      ref={r => this._signatureView = r}
                                      rotateClockwise={!!true}
                                      onSave={this._onSave.bind(this)}
                                    />
                                </CardItem>

                                <CardItem header>
                                    <Button rounded block
                                      style={{backgroundColor: '#00c497', paddingHorizontal: 15}} textStyle={{color: '#fff'}}
                                      onPress={() => this.submitWalkThru()}>
                                        <Text>SUBMIT YOUR WALKTHRU</Text>
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
        popRoute: () => dispatch(popRoute()),
        replaceRoute:(route)=>dispatch(replaceRoute(route))
    }
}

export default connect(null, bindAction)(Submittal);
