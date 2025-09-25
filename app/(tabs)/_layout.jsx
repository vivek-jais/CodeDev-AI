import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import { getLocalStorage } from '../../service/Storage';
export default function TabLayout() {
    const router = useRouter();
    
    const GetUserDetail = async()=>{
        const userInf = await getLocalStorage('userDetail');
        if(!userInf)
        {
            router.replace('/auth')
        }
    }
    useEffect(()=>{
        GetUserDetail();
    },[])
  return (
    <Tabs
    screenOptions={{
        headerShown:false
    }}>
        <Tabs.Screen name='index'
        options={{
            tabBarIcon:({color, size})=><Ionicons name="home-outline" size={24} color={color} />,
            tabBarLabel:'Home'
        }}
        />
        <Tabs.Screen name='explore'
         options={{
            tabBarIcon:({color, size})=><Ionicons name="search-outline" size={24} color={color} />,
            tabBarLabel:'Explore'
        }}/>
        <Tabs.Screen name='progress'
         options={{
            tabBarIcon:({color, size})=><Ionicons name="analytics-outline" size={24} color={color} />,
            tabBarLabel:'Progress'
        }}/>
        <Tabs.Screen name='profile'
         options={{
            tabBarIcon:({color, size})=><Ionicons name="person-circle-outline" size={24} color={color} />,
            tabBarLabel:'Profile'
        }}/>


    </Tabs>
  )
}