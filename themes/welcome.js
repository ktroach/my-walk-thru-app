import Color from 'color';

import {Platform} from 'react-native';

module.exports = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeText: {
    paddingTop: 0,
    marginBottom: 10,
   //  color: 'rgba(0,0,0,0.4)',
    fontSize: 18,
    textAlign: 'center',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 40,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 5,
    // marginBottom: 10,
  },
  welcomeImage: {
    marginTop: 50,
    width: 300,
    height: 400
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  appTitleText: {
    fontSize: 24,
  //  //  color: 'rgba(96,100,109, 1)',
  //   lineHeight: 23,
    marginTop: 32,
    paddingBottom: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  getStartedText: {
    fontSize: 17,
   //  color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  getStartedButton: {
     width: 200,
     height: 40,
     borderRadius: 5,
     backgroundColor: '#ad241f'
  },
  getStartedButtonText: {
     paddingVertical: 15,
     fontSize: 17,
     lineHeight: 17,
     color: '#fff',
     textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  legalInfoText: {
    fontSize: 9,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'left',
    padding: 4,
  },
  tabBarInfoText: {
    fontSize: 9,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    paddingVertical: 2,
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 10,
  },
  helpLinkText: {
    fontSize: 20,
    color: '#fbfbfb'
   //  textDecoration: 'underline'
  },
}
