import { View, Text, Image, Pressable, ActivityIndicator, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {imageAssets, PraticeOption} from '../../../constant/Option'
import Colors from '../../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import {db} from '../../../config/FirebaseConfig'
import { getLocalStorage } from '../../../service/Storage';
import CourseListGrid from '../../../components/PracticeScreen/CourseListGrid';
export default function PracticeTypeHomeScreen() {
//userDatail
    const [user, setUser] = useState();
    useEffect(() => {
        GetUserDetail();
    }, []);
    const GetUserDetail = async () => {
        const userInfo = await getLocalStorage('userDetail');
        console.log(userInfo);
        setUser(userInfo);
    }

    const router =  useRouter();

    const {type} = useLocalSearchParams();
    const option = PraticeOption.find(item=>item.name==type);
    // console.log(option);

    const [loading,setLoading]=useState(false)
    const [courseList,setCourseList] = useState([]);
    useEffect(()=>{
      user &&  GetCourseList();
    },[user])
    
const GetCourseList=async()=>{
    setLoading(true);
    setCourseList([]);
    try{
    const q= query(collection(db,'Courses'),
    where('createdBy','==',user?.email),
orderBy('createdOn','desc'));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
        // console.log(doc.data());
        setCourseList(prev=>[...prev,doc.data()])
        
    })
    setLoading(false);
}
catch(e)
{
    console.log(e);
    setLoading(false);
    
}
}    
  return (
    <View style={{
      flex:1
    }}>
       
      <Image source={option.image} style={{
        height:200,
        width:'100%',
      }}/>
      <View style={{
        position:'absolute',
        padding:10,
        display:'flex',
        flexDirection:'row',
        gap:10,
        alignItems:'center'
      }}>
         <Pressable onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" 
        style={{
            backgroundColor:Colors.WHITE,
           padding:8,
           borderRadius:10
            
        }} />
        </Pressable>
        <Text style={{
            fontFamily:'outfit-bold',
            fontSize:35,
            color:Colors.WHITE
        }}>{type}</Text>
      </View>

      {loading&&<ActivityIndicator size={'large'}
      color={Colors.PRIMARY}
      style={{
        marginTop:150,
      }} />}

      <CourseListGrid courseList={courseList} option={option}/>
    </View>
  )
}
