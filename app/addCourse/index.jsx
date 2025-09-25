import { View, Text, TextInput, StyleSheet, Pressable ,ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constant/Colors'
import Button from '../../components/Shared/Button'
import { GenerateCourseAIModel, GenerateTopicsAIModel } from '../../config/AiModel';
import Prompt from '../../constant/Prompt';
import { db } from '../../config/FirebaseConfig';
import { getLocalStorage } from '../../service/Storage';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
export default function AddCourse() {

 const [user, setUser] = useState();
    useEffect(() => {
        GetUserDetail();
    }, []);
    const GetUserDetail = async () => {
        const userInfo = await getLocalStorage('userDetail');
        setUser(userInfo);
    }

const router = useRouter();
const [loading,setLoading] = useState(false);
const [userInput,setUserInput] = useState();
const [topics,setTopics] = useState([]);
const [selectedTopic,setSelectedTopic] = useState([]);



const onGenerateTopic =async()=>{
  setLoading(true)
//Get Topi Idea from AI model
const PROMPT = userInput+Prompt.IDEA
const aiResp= await GenerateTopicsAIModel.sendMessage(PROMPT);
const topicIdea = JSON.parse(aiResp.response.text());
console.log(topicIdea);
setTopics(topicIdea?.course_titles)
setLoading(false);

  
}

const onTopicSelect=(topic)=>{
  const isAlreadyExist = selectedTopic.find((item)=>item==topic)
  if(!isAlreadyExist){
    setSelectedTopic(prev=>[...prev,topic])
  }
  else{
    const topics =selectedTopic.filter(item=>item!==topic);
    setSelectedTopic(topics)
  }
}

const isTopicSelected =(topic)=>{
  const selection = selectedTopic.find(item=>item==topic);
  return selection?true:false
}
// use To generate Course using ai model
const onGenerateCourse=async()=>{
  setLoading(true)
  
const PROMPT = selectedTopic+Prompt.COURSE;
try{
const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT)


const resp= JSON.parse(aiResp.response.text());
const courses =  resp.course.courses;
console.log(courses);


console.log(courses);
//Save Info to database
courses?.forEach(async(course)=>{
  const docId = Date.now().toString()
  await setDoc(doc(db,'Courses',docId),{
    ...course,
    createdOn: new Date(),
    createdBy:user?.email,
    docId: docId

  })
})
router.push('/(tabs)')
setLoading(false)
  }
  catch(e){
    console.log(e);
    
    setLoading(false)
  }




}
  return (
    <ScrollView style={{
        padding:25,
        backgroundColor:Colors.WHITE,
        flex:1
    }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,

      }}>Create New Course</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:25,

      }}>What you want to learn today</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:20,
        marginTop:8,
        color:Colors.GRAY
      }}>What course you want to create(ex. learn JavaScript, Trading,12th Maths Chapters, etc)</Text>

      <TextInput placeholder='Learn JavaScript, Learn Java'
      style={styles.textInp}
      numberOfLines={3}
      multiline={true}
      onChangeText={(val)=>setUserInput(val)}/>

      <Button text={'Generate Topic'} type='outline' onPress={()=> onGenerateTopic()} loading={loading}/>

        <View style={{
          marginTop: 15,
          marginBottom:15
        }}>
          <Text style={{
          fontFamily:'outfit',
          fontSize:20
        }}>Select all topics which you want to add in the course</Text>
        <View style={{
          display:'flex',
          flexDirection:'row',
          flexWrap:'wrap',
          gap:10,
          marginTop:6
        }}>
        {topics.map((item,index)=>(
          <Pressable key={index} onPress={()=>onTopicSelect(item)}>
          <Text style={{
            padding:7,
            borderWidth:0.4,
            borderRadius:99,
            paddingHorizontal: 15,
            backgroundColor:isTopicSelected(item)?Colors.PRIMARY:null,
            color:isTopicSelected(item)?Colors.WHITE:Colors.PRIMARY,
          }}>{item}</Text>
          </Pressable>
        ))}
        </View >

        <Button text={'Generate Course'} onPress={()=>onGenerateCourse()} loading={loading}/>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
textInp:{
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    alignItems: 'flex-start',
    fontSize:18
}
})