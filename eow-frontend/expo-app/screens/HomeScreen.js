import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {
    const navigation = useNavigation()
    
    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      },
    )
  
    return (
        <SafeAreaView style={{ display: 'flex' , flex: 1, position: 'relative' }}>
            <View style={styles.container}>
              <Animatable.Image
                animation="fadeIn"
                easing="ease-in-out" 
                source={require('../assets/eow-logo1.webp')} 
                sstyle={{ width: '100%', aspectRatio: 16 / 9 }}
              />
              <View>

              </View>
              <TouchableOpacity>
                <Animatable.View 
                    animation={"pulse"}
                    easing="easing-in-out"
                    iterationCount={"infinite"}
                    style={styles.container}>
                  <View style={styles.circle}>
                    <Text>Go</Text>
                  </View>
                </Animatable.View>
              </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Parent takes up the whole screen
    justifyContent: 'center', // Vertical alignment
    alignItems: 'center', // Horizontal alignment
    backgroundColor: '#063970',
    gap:20
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 50, // Half of width/height
    backgroundColor: '#007AFF', // Background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

