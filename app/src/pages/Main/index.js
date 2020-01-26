import React, { useEffect, useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import RNLocation from 'react-native-location';
import MapView , { Marker, Callout } from 'react-native-maps';
import styles from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import api from '../../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../../services/socket';


export default function Main ({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion ,setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialPosition(){
      RNLocation.configure({
        distanceFilter: 100, // Meters
        desiredAccuracy: {
          ios: "best",
          android: "balancedPowerAccuracy"
        },
        // Android only
        androidProvider: "auto",
        interval: 5000, // Milliseconds
        fastestInterval: 10000, // Milliseconds
        maxWaitTime: 5000, // Milliseconds
        // iOS Only
        activityType: "other",
        allowsBackgroundLocationUpdates: false,
        headingFilter: 1, // Degrees
        headingOrientation: "portrait",
        pausesLocationUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: false,
    });

      await RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse"
        }
      }).then(granted => {
          if (granted) {
            const locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
              setCurrentRegion({
                latitude: locations[0].latitude,
                longitude: locations[0].longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              });

            });
          }
      });
    }
    loadInitialPosition();
  },[]);

  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const {latitude, longitude} = currentRegion;
    connect(
      latitude,
      longitude,
      techs
    );


  }

  async function loadDevs(){
    const {latitude, longitude} = currentRegion;
    const response = await api.get('/search', {
      params:{
        latitude,
        longitude,
        techs,
      }
    });
    setDevs(response.data.devs);

    setupWebsocket();
  }

  function handleRegionChanged(region){
    setCurrentRegion(region);
  }

  if(!currentRegion){
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.container}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0],
            }}
          >
            <Image
              style={styles.avatar}
              source={{uri: dev.avatar_url}}
            />
            <Callout onPress={() => { navigation.navigate('Profile', {github_username: dev.github_username}) }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTech}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dev por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <Icon name={'search'} size={20} color='#fff' />
        </TouchableOpacity>
      </View>
    </>
  );
}
