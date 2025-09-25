import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from 'react-native'
import React from 'react'
import {ProfileMenu} from '../../constant/Option'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'
import ProfileHeader from '../../components/Profile/ProfileHeader'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { RemoveLocalStorage } from '../../service/Storage'
import {auth} from '../../config/FirebaseConfig'
import Admin from '../../components/Profile/Admin'

export default function Profile() {
  const router = useRouter();

  const PageNavigate =(item)=>{
   if(item?.name=='Logout'){
    signOut(auth);RemoveLocalStorage();
    router.replace(item.path);
   }
   else{
    router.push(item.path)
   }
  }
  return (
    <ScrollView 
    showsVerticalScrollIndicator={false}
    style={{
      padding:20
    }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:25,

      }}>Profile</Text>
      <View>
        
      <ProfileHeader/>

      {ProfileMenu.map((item, index) =>(
        <View key={index} style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
        }}>
          <TouchableOpacity 
          onPress={()=>PageNavigate(item)}
          style={styles.itemCont}>
          <Ionicons name={item?.icon} size={24} color={Colors.PRIMARY} style={{backgroundColor:Colors.BG_GRAY,padding:10,borderWidth:0.5,borderColor:Colors.GRAY,borderRadius:10}}/>
          <Text>{item?.name}</Text>
          </TouchableOpacity>
          
          </View>
      ))} 
      </View>
      <Admin/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  itemCont:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    backgroundColor: Colors.WHITE,
    padding:10,
    marginTop:10,
    width:'90%',
    borderBottomWidth:1,
    borderColor:Colors.GRAY,
    borderRadius:15,
    elevation:1
  }
})