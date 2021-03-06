import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  PickerIOS,
  NativeModules,
  ScrollView
} from 'react-native';
var PickerItemIOS = PickerIOS.Item;
import loginPostStyles from '../CSS/LoginPostStyle';
var ImageUpload = require('./ImageUpload').component

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: ['Bike', 'Snow', 'Camp', 'Boat', 'Golf'],
      category: 'Bike',
      price: '',
      description: '',
      location: '',
      image: '',
      displayAddPhotos: false
    };
  }

  _navigate(name) {
    this.props.navigator.push({
      name: name,
      passProps: {
        name: name
      }
    })
  }

  submitPost(){
    console.log('the state', this.state)
    fetch("http://localhost:3000/api/v1/equip/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(this.state)
    }).then(function(response) {
      return response.json()
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  }

  addPhotos() {
    if(this.state.displayAddPhotos) {
      return (
        <View>
          <ImageUpload getImage={this.getImage.bind(this)}/>
        </View>
      )
    }
  }

  getImage(uri){
    NativeModules.ReadImageData.readImage(uri, (image) => {
      this.setState({
          image: image,
      });
    })
  }

  render() {
    return (
      <View style={ loginPostStyles.mainPost }>
        <ScrollView style={ loginPostStyles.scrollView }>
          <TouchableHighlight onPress={ () => this.props.navigator.pop() }>
            <Text>
              Home
            </Text>
          </TouchableHighlight>
          <View style={ loginPostStyles.inputContainer }>
            <View>
              <Text>Please choose a gear category:</Text>
                <PickerIOS
                  selectedValue={this.state.category}
                  onValueChange={(category) => this.setState({category: category})}>
                  {this.state.categoryList.map((category, i) => (
                    <PickerItemIOS
                      key={category}
                      value={category}
                      label={category}
                    />
                  ))}
                </PickerIOS>
            </View>
            <Text>Price</Text>
            <TextInput
              style={ loginPostStyles.inputBar }
              onChangeText={(price) => this.setState({price})}
              value={this.state.price}
            />
            <Text>Description</Text>
            <TextInput
              style={ loginPostStyles.inputBar }
              multiline = {true}
              onChangeText={(description) => this.setState({description})}
              value={this.state.description}
            />
            <Text>Location</Text>
            <TextInput
              style={ loginPostStyles.inputBar }
              onChangeText={(location) => this.setState({location})}
              value={this.state.location}
            />
            <TouchableHighlight onPress={ () => this.setState({displayAddPhotos: !this.state.displayAddPhotos})}>
              <Text>
                Select Photo
              </Text>
            </TouchableHighlight>
            {this.addPhotos()}
          </View>
          <TouchableHighlight onPress={ () => this.submitPost()}>
            <Text>
              Post your listing
            </Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

module.exports = Post