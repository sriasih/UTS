import React from 'react';
import { Button, View, Text, StyleSheet, TextInput, Image, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.js

const kampus = require('./src/img/kampus.png');

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>BOPAT UNDIKSHA</Text>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  }; 
constructor()
    {
        super();
 
        this.state = { 
          Kode: '',
          Nama: '',
          NIM: '', 
          Status: '', 
          ActivityIndicator_Loading: false, 

        }
    }
    //fungsi mengirim data ke database
    Insert_Data_Into_MySQL = () =>
    {
        this.setState({ ActivityIndicator_Loading : true }, () =>
        {
            fetch('https://nikomangsulastriasih.000webhostapp.com/Bopat/kirimData.php',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  Kode : this.state.Kode,
                  Nama : this.state.Nama,
                  NIM : this.state.NIM,
                  Status : this.state.Status,
                })
 
            }).then((response) => response.json()).then((responseJsonFromServer) =>
            {
                alert(responseJsonFromServer);
                this.setState({ ActivityIndicator_Loading : false });
            }).catch((error) =>
            {
                console.error(error);
                /*Alert.alert(
                  'Oops!',
                  'Something went wrong!',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  { cancelable: false }
                )*/
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
    }
  render() {
    return (
      <View style={styles.containerMain}>
      <View style={styles.box3}>
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 5, marginBottom: 15 }}>


           <Text>Masukan KODE Tempat</Text>
        <TextInput
                style={{ height: 40, width: 150, textAlign:'center' }}
              placeholder="Masukan KODE Tempat "
              onChangeText={(Kode) => this.setState({ Kode })}
            />
        <Text>Masukan Nama</Text>
        <TextInput
                style={{ height: 40, width: 150, textAlign:'center' }}
              placeholder="Masukan Nama "
              onChangeText={(Nama) => this.setState({ Nama })}
            />
            <Text>Masukan NIM</Text>
        <TextInput
                style={{ height: 40, width: 150, textAlign:'center' }}
              placeholder="Masukan NIM "
              onChangeText={(NIM) => this.setState({ NIM })}
            />
         <Text>Masukan Status</Text>
        <TextInput
                style={{ height: 40, width: 150, textAlign:'center' }}
              placeholder="Masukan Status "
              onChangeText={(Status) => this.setState({ Status })}
            />
            <Button
              title="PINJAM"
              onPress={() => this.Insert_Data_Into_MySQL()}
              color="brown" 
            />
            <Button
              title="Detail "
              onPress={() => this.props.navigation.navigate('Detail')} 
            />
                {
                 this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#2196F3' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
            
        </View>
        </View>
      </View>
      
    );
  }
}

class UtamaScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };
  render() {
    return (
      <View style={styles.containerMain}>
      <View style={{ marginLeft: 20 } }>
            <Image source={kampus} />
      </View>
      <View style={styles.box1}>
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>WELCOME BOPAT</Text>
        <Button
              title="Input Data"
              onPress={() => this.props.navigation.navigate('Home')} 
            />
      </View>
      </View>
      </View>

     
    );
  }
}

class DetailScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: false,
      ActivityIndicator_Loading: false, 
    };
}

  componentDidMount()  {
    this.setState({ ActivityIndicator_Loading : true }, () =>
    {
        this.setState({refreshing: true});
        const url = 'https://nikomangsulastriasih.000webhostapp.com/Bopat/getData.php';
       //this.setState({ loading: true });
        fetch (url)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("comp");
          console.log(responseJson);
          this.setState({
            data: responseJson,
            error: responseJson.error || null,
            loading: false,
            refreshing: false,
            ActivityIndicator_Loading: false, 

          });
        }
      );
    });
  }
  _keyExtractor = (item, index) => item.Kode;

  render() {
    return (
     <View style={ styles.containerMain }>
         {
          this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#2196F3' size='large'style={styles.ActivityIndicatorStyle} /> : null        
          }
        <FlatList
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) =>
            <View style={styles.BoxClass}>
              <Text>Kode : {item.Kode}</Text>
              <Text>Nama : {item.Nama}</Text>
              <Text>NIM : {item.NIM}</Text>
              <Text>Status : {item.Status}</Text>
              <TouchableOpacity onPress={() => this.Insert_Data_Into_MySQL()}
              style={{marginTop: 10, backgroundColor:'#009688', padding: 20, marginHorizontal: 20}}>
              <Text style={{color:'white'}}>UPDATE</Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.kode()}
              style={{marginTop: 10, backgroundColor:'#009688', padding: 20 , marginHorizontal: 20}}>
              <Text style={{color:'white'}}>DELETE</Text>
              </TouchableOpacity>
            </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.componentDidMount.bind(this)}
          />
        }
        /> 
        

   </View>   

      
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Utama: {
      screen: UtamaScreen,
    },
    Detail: {
      screen: DetailScreen,
    },
  },
  {
    initialRouteName: 'Utama',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
const styles = StyleSheet.create({
  containerMain: {
    backgroundColor: '#BBDEFB',
    flex: 1,
    flexDirection: 'column'
  },
  box1: {
    flex: 0.7,
    backgroundColor: '#BBDEFB',
  },
  box2: {
    flex: 1,
    backgroundColor: '#BBDEFB',
    marginLeft: 10,
    marginRight: 10,
     flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  box3: {
    flex: 0.6,
    backgroundColor: '#64B5F6',
    //marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'

  },
  button: {
    width: 140,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'yellow',
    flexDirection: 'row'
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#feb401',
    borderColor: '#feaf12',
    //borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    height: 50,
    width: 30,
  },
  icon: {
    tintColor: 'pink',
    height: 25,
    width: 25,
  },
  BoxClass:
    {
      alignItems: 'flex-start',
      height: 250,
      backgroundColor : "#fff",
      borderWidth: 1,
      borderColor: '#2196F3',
      borderRadius: 7 ,
      marginBottom: 10,
      width: 270,
      paddingTop: 5,
      paddingBottom: 5
    },
 
    TouchableOpacityStyle:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#2196F3',
      marginBottom: 20,
      width: '70%',
      borderRadius: 7 
 
    },
 
    TextStyle:
    {
       color: '#fff',
        textAlign: 'center',
        fontSize: 18
    },

    ActivityIndicatorStyle:{
      
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  },
});
