import { View, Text, Platform, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Home/Header'
import Colors from '../../constant/Colors'
import NoCourse from '../../components/Home/NoCourse'
import {db} from './../../config/FirebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getLocalStorage } from '../../service/Storage'
import CourseList from '../../components/Home/CourseList'
import PracticeSection from '../../components/Home/PracticeSection'
import CourseProgress from '../../components/Home/CourseProgress'
export default function Home() {
const [user, setUser] = useState();
const [loading,setLoading] = useState(false);

    useEffect(() => {
        GetUserDetail();
       
    }, []);
    const GetUserDetail = async () => {
        const userInfo = await getLocalStorage('userDetail');
        setUser(userInfo);
    }

const [courseList,setCourseList] = useState([]);

useEffect(()=>{
  user && GetCourseList();
},[user])
const GetCourseList =async()=>{
  setLoading(true);
  setCourseList([]);
  const q = query(collection(db,'Courses'),where("createdBy",'==',user?.email));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc)=>{
    console.log('--',doc.data());//
    setCourseList(prev=>[...prev,doc.data()])
  })
  setLoading(false)
}

  return (
    <FlatList
    data={[]}
    showsVerticalScrollIndicator={false}
    onRefresh={()=>GetCourseList()}
    refreshing={loading}
    ListHeaderComponent={
      <View style={{
        flex:1,
        backgroundColor:Colors.WHITE
      }}>
        <Image source={require('./../../assets/images/wave1.png')}
        style={{
          position:'absolute',
          width:'100%',
          height: 700
        }}/>
      <View style={{
        padding:25,
        paddingTop:Platform.OS=='ios' && 45 ,
        
      }}>
        <Header/>
        {courseList?.length==0?
        <NoCourse/>:
        <View>
          <CourseProgress courseList={courseList}/>
          <PracticeSection/>
        <CourseList courseList={courseList}/>
       
        </View>
        }
      </View>
      </View>
    }
    />
    
  )
}