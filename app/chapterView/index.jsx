import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Progress from 'react-native-progress';
import Colors from '../../constant/Colors';
import Button from './../../components/Shared/Button'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import {db} from './../../config/FirebaseConfig'
export default function ChapterView() {
    const {chapterParams,docId,chapterIndex} = useLocalSearchParams();
    const chapters = JSON.parse(chapterParams);
    const [currPage,setCurrPage] = useState(0);
    const[loader,setloader]=useState(false);
    const router= useRouter();

    const GetProgress =(currentPage)=>{
        const perc = (currPage/chapters?.content?.length);
        return perc
    }

    const onChapterCompleted=async()=>{
        //Save Chapter Completed
        setloader(true);
        await updateDoc(doc(db,'Courses',docId),{
            completedChapter:arrayUnion(chapterIndex)
        })

        setloader(false);
        router.replace('/courseView/'+docId)
        //Go back 
    }
  return (
    <View style={{
        padding:25,
        backgroundColor:Colors.WHITE,
        flex:1

    }}>
      <Progress.Bar progress={GetProgress(currPage)} width={Dimensions.get('screen').width*0.85} />

      <View style={{
        marginTop:20
      }}>
        <Text style={{
            fontFamily:'outfit-bold',
            fontSize:25
        }}>{chapters?.content[currPage]?.topic}</Text>

        <Text style={{
            fontFamily:'outfit',
            fontSize:20,
            marginTop:7
        }}>{chapters?.content[currPage]?.explain}</Text>

       {chapters?.content[currPage]?.code &&<Text style={[styles.codeExCont,{backgroundColor:Colors.BLACK,color:Colors.WHITE}]}>{chapters?.content[currPage]?.code}</Text>}
        {chapters?.content[currPage]?.example &&<Text style={styles.codeExCont}>{chapters?.content[currPage]?.example}</Text>}

      </View>
        <View style={{
            position:'absolute',
            bottom:10,
            width:'100%',
            left:25
        }}>
            {chapters?.content?.length-1!=currPage?
      <Button text={'Next'} onPress={()=> setCurrPage(currPage+1)}/>
      :
      <Button text={'Finish'} onPress={()=>onChapterCompleted()} loading={loader}/>
            }
      </View>
            
    </View>
  )
}

const styles = StyleSheet.create({
codeExCont:{
    padding:15,
    backgroundColor:Colors.BG_GRAY,
    borderRadius:15,
    fontFamily:'outfit',
    fontSize:18,
    marginTop:15
}
})