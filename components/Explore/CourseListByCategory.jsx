import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, where } from 'firebase/firestore'
import {db} from '../../config/FirebaseConfig'
import { imageAssets } from '../../constant/Option'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Colors from '../../constant/Colors'
import CourseList from '../Home/CourseList'
export default function CourseListByCategory({category}) {

const router = useRouter();
const [courseList,setCourseList] = useState([])
const [loading,setLoading] = useState(false);
useEffect(()=>{
    GetCourseListByCategory();
},[])

const GetCourseListByCategory =async()=>{
    setLoading(true);
    setCourseList([]);
    const q= query(collection(db,'Courses'),where('category','==',category)
)
        const querySnapshot = await getDocs(q);

        querySnapshot?.forEach((doc)=>{
            // console.log(doc.data());
            setCourseList(prev=>[...prev,doc.data()])
        })
        setLoading(false);

}

  return (
    <View>
      {courseList?.length>0 && <CourseList courseList={courseList} heading={category}
       />}
    </View>
  )
}

const styles = StyleSheet.create({
courseCont:{
    padding:10,
    backgroundColor:Colors.BG_GRAY,
    margin:6,
    borderRadius:15,
    width:260,
    elevation:1,
    borderWidth:0.2
}
})