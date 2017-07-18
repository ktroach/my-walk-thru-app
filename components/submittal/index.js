'use strict';

import React, { Component } from 'react';
import { Image, Linking, ActivityIndicator, TouchableOpacity, Platform, AsyncStorage, WebView, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { openDrawer } from '../../actions/drawer';
import { popRoute, replaceRoute } from '../../actions/route';

import { Container, Header, Title, Content, Text, Button, Icon, Card, CardItem, View } from 'native-base';

// import { Checkbox } from 'nachos-ui';

// import SignatureView from './SignatureView';

import theme from '../../themes/form-theme';
import styles from './styles';

import SignaturePad from 'react-native-signature-pad';
// import RNFetchBlob from 'react-native-fetch-blob';
//saveImageFileInExtStorage

import moment from 'moment';
import shortid from 'shortid';

// import FileSystem from 'react-native-filesystem';

// import * as RNFS from 'react-native-fs';

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
            reportUrl: '',
            alreadySubmitted: false,
            submitted: false
       };
    }

    componentDidMount() {
      AsyncStorage.getItem("userId")
      .then( (userId) =>
            {
                this.setState({loaded: true});
                this.setState({userId: userId});

                AsyncStorage.getItem("completionDate")
                .then( (completionDate) =>
                        {
                            if(completionDate && completionDate.length>0){
                                this.setState({alreadySubmitted: false});
                            }
                            
                        }
                )
                .done();                
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

    renderAlreadySubmittedView() {
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
                        <View style={styles.box}>
                            <Card foregroundColor='#000'>
                                <CardItem header>
                                    <Text>*** YOU HAVE ALREADY SUBMITTED YOUR WALKTHRU ***</Text>
                                </CardItem>
                            </Card>
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

    // handleFirstCheckboxChange = (firstChecked) => {
    //   this.setState({ firstChecked })
    // }

    openLink() {
       Linking.openURL('http://www.mywalkthru.com/');
    }

    _showSignatureView() {
    //   this._signatureView.show(true);
    }

    _onSave(result) {
        const base64String = `data:image/png;base64,${result.encoded}`;
        this.setState({data: base64String});

        // let dirs = RNFetchBlob.fs.dirs;
        // console.log(dirs.DocumentDir);
        // console.log(dirs);
        // console.log(dirs.DCIMDir);
        // console.log(dirs.DownloadDir);

        // return;        

        // let PATH_TO_FILE = 'temp1241wdqweqwdqwd.png';

        // RNFetchBlob.fs.writeStream(
        //     PATH_TO_FILE,
        //     // encoding, should be one of `base64`, `utf8`, `ascii` 
        //     'utf8',
        //     // should data append to existing content ? 
        //     true)
        // .then((ofstream) => {
        //     ofstream.write(base64String);
        //     ofstream.close();
        //     this._signatureView.show(false);
        // });      

        // this._signatureView.show(false);
    }

    // saveToCameraRoll = (image) => {
    //     if (Platform.OS === 'android') {
    //         RNFetchBlob
    //         .config({
    //             fileCache : true,
    //             appendExt : 'jpg'
    //         })
    //         .fetch('GET', image.urls.small)
    //         .then((res) => {
    //             CameraRoll.saveToCameraRoll(res.path())
    //             .then(Alert.alert('Success', 'Photo added to camera roll!'))
    //             .catch(err => console.log('err:', err))
    //         })
    //     } else {
    //         CameraRoll.saveToCameraRoll(image.urls.small)
    //         .then(Alert.alert('Success', 'Photo added to camera roll!'))
    //     }
    // }    

    // saveImage(){
    //     let signature = this.state.signature;
    //     let fileName = shortid.generate();
    //     let fileType = 'png';
    //     let path = RNFS.DocumentDirectoryPath + '/' + `${fileName}.${fileType}`;
    //     alert(path);
    // }

    uploadSignature(){
        let uploadResponse, uploadResult;
        try {
        if (this.state.data && this.state.data.length>0) {
            let userId = this.state.userId;

            let signatureImage = this.state.data;
            // save the signatureImage to the file system

            if (!userId) {
                throw new Error('No UserId found!');
            }

            let fileName = shortid.generate();
            let fileType = 'png';
            // let path = RNFS.DocumentDirectoryPath + '/' + `${fileName}.${fileType}`;
            // alert(path);

            // need to save the file
            // need file path
            // uri required - File system URI, can be assets library path or file:// path
            //"assets-library://asset/asset.PNG?id=655DBE66-8008-459C-9358-914E1FB532DD&ext=PNG"
            const file = {
                uri: `file://${path}`,
                name: `${fileName}.${fileType}`,
                type: `image/${fileType}`
            };

            const options = {
                keyPrefix: 'photos/',
                bucket: 'mywalkthru-pm-files',
                region: 'us-west-2',
                accessKey: 'AKIAIRVLMXELYRQ5GYFA',
                secretKey: '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',
                successActionStatus: 201
            };

            console.log('UPLOADING TENANT SIGNATURE TO S3...');

            RNS3.put(file, options).then(response => {
            // let res = JSON.stringify(response);

                console.log('>>>>>>>> response:', response);

                if (response.status !== 201) {
                    throw new Error('Failed to upload image to S3', response);
                }

                if (!response.body){
                    throw new Error('Failed to upload image to S3', response);
                }

                let photoUrl = response.body.postResponse.location;

                alert(photoUrl);

                // console.log('Property photoUrl:', photoUrl);
                let now = new Date();                  
                let data =
                {
                    signatureUrl: photoUrl,
                    modified: now
                };                    

                this.persistData(userId, data, 'report');

            });
        }
        } catch(error) {
        console.log({uploadResponse});
        console.log({uploadResult});
        console.log('error:', error);
        let errorMessage = 'Failed to upload image' + error.message;
        alert(errorMessage);
        } finally {
        console.log('finally');
        }
    }    

    fetchUser(userId, cb) {
        console.log('>>> submittal >>> fetchUser >>> userId:', userId);
        if(!userId) return;
        let query = 'https://mywalkthruapi.herokuapp.com/api/v1/users?filter={"where": {"userId": "'+userId+'"}}';   
        console.log('>>> submittal >>> fetchUser >>> query:', query);       
        fetch(query).then((response) => response.json()).then((responseData) => {
            if (responseData && responseData.length>0){
                return cb(null, responseData[0]);
            }
        }).done();
    } 

    saveSignature(){
        let now = new Date(); 
        let userId = this.state.userId;
        let signature = this.state.signature;
        if (!userId) {
            alert('UserId is undefined');
            return;
        } 
        if (!signature) {
            alert('Please sign the Form');
            return;
        }          

        this.fetchUser(userId, function(err,res){
            if (err){
                console.log(err);
                return;
            } else {
                let uid = res.id;
                if (!uid) {
                    alert('Invalid parameter: uid');
                    return;
                }                  
                let data =
                {
                    signatureUrl: signature,
                    modified: now
                };                    
                let now = new Date();
                let url = 'https://mywalkthruapi.herokuapp.com/api/v1/users/' + uid;

            //  return new Promise(function (resolve, reject) {
                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }).then((response) => response.json()).then((responseData) => {
                    // console.log('responseData: ', responseData);
                    alert('Your Walkthru has been submitted');
                    // resolve('signature saved');
                    // this.setState({submitted: true});
                    // return cb(null, 'success');
                    // change navigation route post save
                    //  if (route) {
                    // this.replaceRoute('report');
                    //  }
                    //this.setState({comments: JSON.stringify(responseData)});
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                }).done();
            }});

            AsyncStorage.setItem("submittedDate", now.toISOString())
            .then( () => {
                this.replaceRoute('report');
            }
            ).done();

            
            // }}); // promise       
    }

    persistData(id, data, route) {
      if (!data) {
        alert('Invalid parameter: data');
        return;
      }
      if (!id) {
        alert('Invalid parameter: id');
        return;
      }         

      let now = new Date();

      //PATCH data
      let url = 'https://mywalkthruapi.herokuapp.com/api/v1/users/' + id;
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((responseData) => {
         console.log('responseData: ', responseData);

         alert('Photo Saved');

         // change navigation route post save
        //  if (route) {
        //    this.replaceRoute(route);
        //  }
         //this.setState({comments: JSON.stringify(responseData)});
      }).catch((error) => {
         console.log(error);
      }).done();
    }    
    

    submitWalkThru(){
        // this.setState({loaded: false});
        // this.setState({updating: true, processStatus: 'Creating Walkthru Report...'});

        // var url = "https://mywalkthruapi.herokuapp.com/api/v1/Reports/pdfExport/"+this.state.userId;
      // var data = {userId: this.state.userId};

        let completionDate = moment().format();
        let now = new Date();
        // let reportUrl = '';

        // todo : upload the signature image to aws storage
        // todo: patch the user record with the url to the signature per the report script
        // todo : email the report to the PM and the Tenant
        // todo: remove the submit button on the home screen

        if (!this.state.signature){
            alert('Please SIGN the signature pad to confirm your WALKTHRU is complete');
            return;
        }

        this.saveSignature();

        // this.saveSignature().then( () => 
        //     {
        //         alert('Thank you for submitting your Walkthru');
        //         this.replaceRoute('report');    
        //     }
        // )
        // .done(); 

        // AsyncStorage.setItem("completionDate", completionDate)
        // .then( () => 
        //     {
        //         alert('Thank you for Completing your Walkthru ('+completionDate+')');
        //         this.replaceRoute('report');    
        //     }
        // )
        // .done( );  

      // console.log('data: ', data);

    //   fetch(url, {
    //        method: 'get',
    //        headers: {
    //          "Content-type": "application/json"
    //        }
    //   }).then((response) => response.json()).then((responseData) => {

    //         console.log('RESPONSEDATA: ', responseData);
    //         alert(responseData);

    //         if (!responseData) {
    //             alert('Sorry, there was a problem Submitting your Walkthru');
    //         } else {

    //             this.setState({loaded: true});
    //             this.setState({reportUrl: responseData.reportUrl});

    //             AsyncStorage.setItem("reportUrl", responseData.reportUrl)
    //             .then( () => 
    //                 {
    //                     AsyncStorage.setItem("completionDate", completionDate)
    //                     .then( () => 
    //                         {
    //                             alert('Thank you for Completing your Walkthru ('+completionDate+')');
    //                             this.replaceRoute('report');    
    //                         }
    //                     )
    //                     .done( );
    //                 }
    //             )
    //             .done( );                
    //         }
            
    //   }).done();

      // this.replaceRoute('home');
    }

    render() {
       if (this.state.alreadySubmitted) {
          return this.renderAlreadySubmittedView();
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

    //   this.saveImage();
    //   alert('Image changed');
      
    //   let fileName = 'assets-library://asset/asset.PNG';
      
    //   this.writeToFile(fileName, base64DataUrl, function(err,res){
    //       console.log('writeToFile done');
    //   });

      // upload the image to aws s3 and store the s3 url in state 


    };


    writeToFile(fileName, fileContents, cb) {
        FileSystem.writeToFile(fileName, fileContents, function(err, res){
            if(err){
                console.log(err);
                return cb(err,null);
            }else{
                console.log('file is written');
                return cb(null, '200 OK');
            }
        });
    }    

    renderSubmittalForm() {
    //   const checkboxStyle = { margin: 5 }
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

                                {/*<CardItem header>
                                    <Image
                                        style={{width: 200, height: 200}}
                                        source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                                    />
                                </CardItem>*/}

                                <CardItem header>
                                    <Text>*** PLEASE READ ***</Text>
                                </CardItem>
                                {/*<CardItem>
                                    <Text>Tap (Check) the circle to confirm want to submit your WalkThru</Text>
                                    <Checkbox
                                      style={checkboxStyle}
                                      kind='circle'
                                      checked={this.state.firstChecked}
                                      onValueChange={this.handleFirstCheckboxChange}
                                    ></Checkbox>
                                </CardItem>*/}

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
                                    <Text>By Signing and Submitting your WALKTHRU, you authorize a copy of this property review to go to your Property Manager for their records:</Text>
                                </CardItem>                                    
{/*
                                <CardItem style={{height: 200}}>
                                  <View style={{flex: 1, borderWidth: 1,  borderColor: '#333'}}>
                                      <SignaturePad onError={this._signaturePadError}
                                                    onChange={this._signaturePadChange}
                                                    style={{flex: 1, backgroundColor: '#fff', borderWidth: 1,  borderColor: '#333'}}/>
                                  </View>
                                </CardItem>*/}


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
