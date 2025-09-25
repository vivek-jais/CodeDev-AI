import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLocalStorage } from '../../service/Storage';
import Colors from '../../constant/Colors';

export default function ProfileHeader() {

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
        alignItems:'center',
        justifyContent:'center'
    }}>
        <Image source={require('./../../assets/images/app.png')}
        style={{
            width:200,
            height:200
        }}/>
      <Text style={{
        fontSize:25,
        padding:5,
        fontFamily:'outfit-bold'
      }}>{user?.displayName}</Text>
      <Text style={{
        fontSize:20,
        color:Colors.GRAY,
        fontFamily:'outfit',
        marginTop:-10
      }}>{user?.email}</Text>
    </View>
  )
}