import { View, Text, TextInput, StyleSheet, Pressable ,ScrollView, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constant/Colors'
import Button from '../../components/Shared/Button'
import { GenerateCourseAIModel, GenerateTopicsAIModel, sendAIMessage } from '../../config/AiModel';
import Prompt from '../../constant/Prompt';
import { db } from '../../config/FirebaseConfig';
import { getLocalStorage } from '../../service/Storage';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { jsonrepair } from "jsonrepair";
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
  try {
    if (!userInput || userInput.trim() === '') {
      Alert.alert('Error', 'Please enter a topic description');
      return;
    }

    setLoading(true);
    //Get Topic Idea from AI model
    const PROMPT = userInput + Prompt.IDEA;
    const aiResp = await sendAIMessage(GenerateTopicsAIModel, PROMPT);
    const responseText = aiResp.response.text();
    
    console.log('Raw Response:', responseText.substring(0, 200));

    // Parse JSON with fallback handling
    let topicIdea;
    try {
      topicIdea = extractValidJSON(responseText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError.message);
      console.error('Full response:', responseText);
      Alert.alert('Error', 'Invalid response format from AI. Please try again.');
      return;
    }

    console.log('Topics Generated:', topicIdea);
    setTopics(topicIdea?.course_titles || []);
  } catch (error) {
    console.error('Topic Generation Error:', error);
    Alert.alert('Error', `Failed to generate topics: ${error.message}`);
  } finally {
    setLoading(false);
  }
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
// Helper function to extract and parse JSON from response
// const extractValidJSON = (responseText) => {
//   if (!responseText) {
//     throw new Error('Response text is empty');
//   }

//   try {
//     // Trim and clean the response
//     let cleanedText = responseText.trim();
    
//     // Remove any markdown code block formatting
//     cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
//     cleanedText = cleanedText.trim();
    
//     console.log('Cleaned text length:', cleanedText.length);

//     // First try direct parsing on cleaned text
//     try {
//       const parsed = JSON.parse(cleanedText);
//       console.log('Successfully parsed JSON directly');
//       return parsed;
//     } catch (directError) {
//       console.log('Direct parsing failed');
//     }

//     // Extract JSON object - find the outermost braces more carefully
//     let startIndex = cleanedText.indexOf('{');
//     let endIndex = -1;
//     let braceCount = 0;
    
//     if (startIndex !== -1) {
//       // Count braces to find the matching closing brace
//       for (let i = startIndex; i < cleanedText.length; i++) {
//         if (cleanedText[i] === '{') braceCount++;
//         if (cleanedText[i] === '}') braceCount--;
//         if (braceCount === 0 && i > startIndex) {
//           endIndex = i;
//           break;
//         }
//       }
//     }
    
//     if (startIndex !== -1 && endIndex !== -1) {
//       const jsonString = cleanedText.substring(startIndex, endIndex + 1);
//       console.log('Extracted JSON length:', jsonString.length);
      
//       try {
//         const parsed = JSON.parse(jsonString);
//         console.log('Successfully parsed extracted JSON');
//         return parsed;
//       } catch (extractError) {
//         console.log('Failed to parse extracted JSON:', extractError.message);
        
//         // Try to fix and retry
//         let fixed = jsonString
//           .replace(/'/g, '"')
//           .replace(/\n\s*/g, ' ')
//           .replace(/:\s*'/g, ': "')
//           .replace(/,\s*"/g, '", "')
//           .replace(/,\s*}/g, '}')
//           .replace(/,\s*]/g, ']');
        
//         try {
//           const parsedFixed = JSON.parse(fixed);
//           console.log('Successfully parsed fixed JSON');
//           return parsedFixed;
//         } catch (fixError) {
//           console.log('Failed to parse fixed JSON');
//         }
//       }
//     }

//     console.error('Could not extract complete JSON. Response length:', responseText.length);
//     throw new Error(`Incomplete or invalid JSON response. Length: ${responseText.length} chars`);
//   } catch (error) {
//     console.error('extractValidJSON error:', error.message);
//     throw error;
//   }
// };




function extractValidJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const repaired = jsonrepair(cleaned);

    return JSON.parse(repaired);

  } catch (error) {
    console.error("JSON parse failed:", error);
    console.log("Bad response:", text);
    return null;
  }
}

// use To generate Course using ai model
const onGenerateCourse=async()=>{
  try{
    if (!selectedTopic || selectedTopic.length === 0) {
      Alert.alert('Error', 'Please select at least one topic');
      return;
    }

    setLoading(true);
    const PROMPT = selectedTopic + Prompt.COURSE;
    const aiResp = await sendAIMessage(GenerateCourseAIModel, PROMPT);
    const responseText = aiResp.response.text();
    
    console.log('Raw Response:', responseText.substring(0, 200)); // Log first 200 chars for debugging

    // Parse JSON with fallback handling
    let resp;
    try {
      resp =  extractValidJSON(responseText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError.message);
      console.error('Full response:', responseText);
      Alert.alert('Error', 'Invalid response format from AI. Please try again.');
      return;
    }

    const courses = resp.course?.courses || resp.courses || [];
    
    if (!courses || courses.length === 0) {
      throw new Error('No courses generated from AI');
    }

    console.log('Courses Generated:', courses);

    //Save Info to database
    let firstCourseId = null;
    courses?.forEach(async(course)=>{
      const docId = Date.now().toString();
      if (!firstCourseId) {
        firstCourseId = docId;
      }
      await setDoc(doc(db,'Courses',docId),{
        ...course,
        createdOn: new Date(),
        createdBy:user?.email,
        docId: docId
      });
    });
    
    Alert.alert('Success', 'Courses created successfully!');
    // Navigate to the first generated course page
    if (firstCourseId) {
      setTimeout(() => {
        router.push({
          pathname: '/courseView/[courseId]',
          params: { courseId: firstCourseId }
        });
      }, 500);
    } else {
      router.push('/(tabs)');
    }
  }
  catch(error){
    console.error('Course Generation Error:', error);
    Alert.alert('Error', `Failed to generate courses: ${error.message}`);
  }
  finally {
    setLoading(false);
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