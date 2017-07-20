import React from "react";
import { AppRegistry, Image, TouchableOpacity } from "react-native";
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon,
  Thumbnail
} from "native-base";

const routes = ["Home"];

export default class DrawBar extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
            <Container style={{backgroundColor: '#fff'}} >
                <Image source={require('../../assets/images/login2.jpg')} style={{        
                  flex: 1,
                  width: null,
                  height: null,}} >
                  <Content>

                  <Thumbnail size={150} style={{resizeMode: 'contain', marginTop: 20}} source={require('../../assets/images/logo.png')} />

                  <List
                    dataArray={routes}
                    renderRow={data => {
                      return (
                        <ListItem
                          button
                          onPress={() => this.props.navigation.navigate(data)}
                        >
                          <Text>{data}</Text>
                        </ListItem>
                      );
                    }}
                  />
                </Content>
                </Image>
            </Container>

    );
  }
}