'use strict';

import React, { Component } from 'react';
import { BackAndroid, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash/core';

// Actions
import { closeDrawer } from './actions/drawer';
import { popRoute } from './actions/route';
import { subitem } from './actions/sub';

// Navigation
import { Drawer } from 'native-base';
import Navigator from 'Navigator';
import SideBar from './components/sideBar';

// Home
import Home from './components/home/';

// Report
import Report from './components/report/';

// New Sign Up Routes (replace old signup routes)
import SignUpUserInfo from './components/signup/signup-user-info';
import SignUpPropertyInfo from './components/signup/signup-property-info';
import SignUpPropertyLocation from './components/signup/signup-property-location';
import SignUpLeaseInfo from './components/signup/signup-lease-info';
import SignUpPropertyManagerInfo from './components/signup/signup-property-manager-info';
import SignUpTermsConditions from './components/signup/signup-terms-conditions';
import SignUpPropertyPhotos from './components/signup/signup-property-photos';
import SignUpComplete from './components/signup/signup-complete';
import SignUpInstructions from './components/signup/signup-instructions';
import SignUpResetDemo from './components/signup/signup-reset-demo';

// Old Sign Up Routes (replace)
import Step0 from './components/signup/step-0';
import Step1 from './components/signup/step-1';
import Step2 from './components/signup/step-2';
import Step3 from './components/signup/step-3';
import Step4 from './components/signup/step-4';
import Step5 from './components/signup/step-5';
import Step6 from './components/signup/step-6';

// we have to deprecate the react-native-gifted-form becuase it was a terrible peice of crap
import Step1Copy from './components/signup/step-1-copy';

// Submittal screen  process signature
import Submittal from './components/submittal/';

// Walkthru Categories
import TopCategories from './components/categories/top';
import SubCategories from './components/categories/details';
import CommentsAndPhotos from './components/categories/commentsAndPhotos';

// StatusBar
import { statusBarColor } from './themes/base-theme';

// NAVIGATOR
Navigator.prototype.replaceWithAnimation = function (route) {
    const activeLength = this.state.presentedIndex + 1;
    const activeStack = this.state.routeStack.slice(0, activeLength);
    const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    const nextStack = activeStack.concat([route]);
    const destIndex = nextStack.length - 1;
    const nextSceneConfig = this.props.configureScene(route, nextStack);
    const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

    const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
    this._emitWillFocus(nextStack[destIndex]);
    this.setState({
        routeStack: nextStack,
        sceneConfigStack: nextAnimationConfigStack,
    }, () => {
        this._enableScene(destIndex);
        this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
            this.immediatelyResetRouteStack(replacedStack);
        });
    });
};

export var globalNav = {};

const searchResultRegexp = /^search\/(.*)$/;

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        var currentState = state;

        if(currentState){
            while (currentState.children){
                currentState = currentState.children[currentState.index]
            }
        }
        return defaultReducer(state, action);
    }
};

const drawerStyle  = { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3};

// APPNAVIGATOR
class AppNavigator extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        globalNav.navigator = this._navigator;

        this.props.store.subscribe(() => {
            if(this.props.store.getState().drawer.drawerState == 'opened')
                this.openDrawer();

            if(this.props.store.getState().drawer.drawerState == 'closed')
                this._drawer.close();

        });

        BackAndroid.addEventListener('hardwareBackPress', () => {
            var routes = this._navigator.getCurrentRoutes();

            if(routes[routes.length - 1].id == 'home' || routes[routes.length - 1].id == 'login') {
                return false;
            }
            else {
                this.popRoute();
                return true;
            }
        });
    }

    popRoute() {
        this.props.popRoute();
    }

    openDrawer() {
        this._drawer.open();
    }

    closeDrawer() {
        if(this.props.store.getState().drawer.drawerState == 'opened') {
            this._drawer.close();
            this.props.closeDrawer();
        }
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type='overlay'
                content={<SideBar navigator={this._navigator} />}
                tapToClose={true}
                acceptPan={false}
                onClose={() => this.closeDrawer()}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}>
                <StatusBar
                    hidden={true}
                />
                <Navigator
                    ref={(ref) => this._navigator = ref}
                    configureScene={(route) => {
                        return {
                            ...Navigator.SceneConfigs.FloatFromRight,
                            gestures: {}
                        };
                    }}
                    initialRoute={{id: (Platform.OS === 'android') ? 'signup-step0' : 'signup-step0',
                                   statusBarHidden: true}}

                    renderScene={this.renderScene}
                  />
            </Drawer>
        );
    }

    renderScene(route, navigator) {
        switch (route.id) {
            case 'home':
               return <Home navigator={navigator} />;
            case 'report':
               return <Report navigator={navigator} />;               
            case 'submittal':
               return <Submittal navigator={navigator} />;
            case 'signup-user-info':
               return <SignUpUserInfo navigator={navigator} />;               
            case 'signup-property-info':
               return <SignUpPropertyInfo navigator={navigator} />;               
            case 'signup-property-location':
               return <SignUpPropertyLocation navigator={navigator} />;               
            case 'signup-lease-info':
               return <SignUpLeaseInfo navigator={navigator} />;               
            case 'signup-property-manager-info':
               return <SignUpPropertyManagerInfo navigator={navigator} />;               
            case 'signup-terms-conditions':
               return <SignUpTermsConditions navigator={navigator} />;             
            case 'signup-reset-demo':
               return <SignUpResetDemo navigator={navigator} />;                  
            case 'signup-property-photos':
               return <SignUpPropertyPhotos navigator={navigator} />;               
            case 'signup-complete':
               return <SignUpComplete navigator={navigator} />;    
            case 'signup-instructions':
               return <SignUpInstructions navigator={navigator} />;                           
            case 'signup-step0':
               return <Step0 navigator={navigator} />;
            case 'signup-step1':
               return <Step1Copy navigator={navigator} />;
            case 'signup-step2':
               return <Step2 navigator={navigator} />;
            case 'signup-step3':
               return <Step3 navigator={navigator} />;
            case 'signup-step4':
               return <Step4 navigator={navigator} />;
            case 'signup-step5':
               return <Step5 navigator={navigator} />;
            case 'signup-step6':
               return <Step6 navigator={navigator} />;
            case 'categories':
               return <TopCategories navigator={navigator} />;
            case 'subcategories':
               return <SubCategories navigator={navigator} />;
            case 'commentsAndPhotos':
              return <CommentsAndPhotos navigator={navigator} />;
            default :
               return <Home navigator={navigator} />;
        }
    }
}

function bindAction(dispatch) {
    return {
        closeDrawer: () => dispatch(closeDrawer()),
        popRoute: () => dispatch(popRoute())
    }
}

const mapStateToProps = (state) => {
    return {
        drawerState: state.drawer.drawerState
    }
}

export default connect(mapStateToProps, bindAction) (AppNavigator);
