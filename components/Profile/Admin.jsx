import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'

export default function Admin() {

    const openLink = () => {
        Linking.openURL('https://www.linkedin.com/in/vivek-jaiswal01/');
      };

  return (
    <TouchableOpacity 
    onPress={()=>openLink()}>
      <View style={{
        display:'flex',
        flexDirection:'row',
        gap:30,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        backgroundColor:Colors.WHITE,
        borderBottomWidth:1,
        borderColor:Colors.PRIMARY,
        borderRadius:20,
        elevation:1,
        borderRightWidth:1

      }}>
        <View style={{
        display:'flex',
        flexDirection:'row',
        gap:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
      }}>
      <Entypo name="linkedin-with-circle" size={35} color={Colors.PRIMARY}/>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:18,
        color:Colors.PRIMARY
      }}>Connect With Developer</Text>
      </View>
      <View style={{
        display:'flex',
        alignItems:'center'
      }}>
      <FontAwesome5 name="user-secret" size={20} color={Colors.GRAY} />
      <Text style={{
        fontFamily:'outfit-bold',
        color:Colors.GRAY,
        fontSize:10
      }}>VIVEK</Text>
      </View>      
      </View>
      
    </TouchableOpacity>
  )
}