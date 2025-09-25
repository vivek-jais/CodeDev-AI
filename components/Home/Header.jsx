import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getLocalStorage } from '../../service/Storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
export default function Header() {
    
const router = useRouter();

    const [user, setUser] = useState();
    useEffect(() => {
        GetUserDetail();
    }, []);

    const GetUserDetail = async () => {
        const userInfo = await getLocalStorage('userDetail');
        console.log(userInfo);
        setUser(userInfo);
    }
  
  return (
    <View style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }}>
        <View>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:25,
        color:Colors.WHITE
      }}>Hello, {user?.displayName}</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:17,
        color:Colors.WHITE
      }}>Let's Get Started!</Text>
      </View>
      <TouchableOpacity onPress={()=>router.push('/setting')}> 
     <Ionicons name="settings-outline" size={32} color={Colors.BG_GRAY} />
      </TouchableOpacity>
    </View>
  )
}