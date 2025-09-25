import { View, Text, Image, FlatList, TouchableOpacity,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLocalStorage } from '../../service/Storage';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import CourseProgressCard from './../../components/Shared/CourseProgressCard'
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
export default function Progress() {

  const router = useRouter();

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
    const q = query(collection(db,'Courses'),where("createdBy",'==',user?.email),orderBy('createdOn','desc'));
    const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach((doc)=>{
      // console.log('--',doc.data());
      setCourseList(prev=>[...prev,doc.data()])
    })
    setLoading(false)
  }
  return (
  <FlatList 
   data={[]}
   showsVerticalScrollIndicator={false}
   ListHeaderComponent={
    <View>
    <Image source={require('./../../assets/images/wave1.png')}
            style={{
              position:'absolute',
              width:'100%',
              height: 700
      }}/>

      <View style={{
        
        width:'100%',
        padding:20,
       height:'100%'
      }}>
        <Text style={{
          fontFamily:'outfit-bold',
          fontSize:30,
          color:Colors.WHITE,
          marginBottom:10
        }}>Course Progress</Text>
        <FlatList
        showsVerticalScrollIndicator={false}
        data={courseList}
        onRefresh={()=>GetCourseList()}
        refreshing={loading}
        renderItem={({item,index})=>(
          <TouchableOpacity 
          onPress={()=>router.push({
            pathname:'/courseView/'+item?.docId,
            params:{
              courseParams:JSON.stringify(item)
            }
          })}
          >
            <CourseProgressCard item={item} width={'96%'}/>
          </TouchableOpacity>
        )}
        />

      </View>
  </View>

   }/>
   
  )
}