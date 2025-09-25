import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function QuestionAnswer() {

    const router=useRouter();
    const {courseParams} = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const qaList = course?.qa
    const [selectedQues,setSelectedQues] = useState();

    const OnQuesSelect=(index)=>{
        if(selectedQues==index)
        {
            setSelectedQues(null);
        }
        else{
            setSelectedQues(index)
        }
    }

  return (
    <View>
       <Image source={require('./../../assets/images/wave.png')}
           style={{
             height:800,
             width:'100%',
           }} />

           <View style={{
            position:'absolute',
            width:'100%',
            padding:20,
            marginTop:35,
            height:'100%'
           }}>
            <View style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                gap:7
            }}>
             <Pressable onPress={()=>router.back()}>
            <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
            </Pressable>

            <Text style={{
                fontFamily:'outfit-bold',
                color:Colors.WHITE,
                fontSize:28,

                }}>Question & Answers</Text>
             </View>   
            <Text style={{
                fontFamily:'outfit',
                color:Colors.WHITE,
                fontSize:20
            }}>{course?.courseTitle}</Text>
            
           
            <FlatList 
            data={qaList}
            showsVerticalScrollIndicator={false}
            renderItem={({item,index})=>(
                <Pressable style={styles.card}
                onPress={()=>OnQuesSelect(index)}>
                    <Text style={{
                        fontFamily:'outfit-bold',
                        fontSize:20
                    }}>{item?.question}</Text>

                    {selectedQues==index&&
                    <View style={{
                        borderTopWidth:0.4,
                        marginVertical:10,
                        marginBottom:10
                    }}>
                        <Text style={{
                            fontFamily:'outfit',
                            fontSize:17,
                            color:Colors.GREEN,
                            marginTop:10
                        }}>{item?.answer}</Text>
                    </View>
                    }
                     
                </Pressable>
            )}
            />
          

           </View>

    </View>
  )
}

const styles = StyleSheet.create({
    card:{
        padding:20,
        backgroundColor:Colors.WHITE,
        marginTop:6,
        borderRadius:15,
        marginTop:15,
        elevation:1

    }
})