import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from '../../constant/Colors'
import { useRouter } from "expo-router";
export default function Index() {

const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE
      }}
    >
      <Image source ={require('./../../assets/images/landing.png')}
       style ={{
      width:'100%',
      height: 300,
      marginTop:70,
       }}
      />

      <View style ={{
        padding:25,
        backgroundColor:Colors.PRIMARY,
        height:'100%',
        borderTopLeftRadius:35,
        borderTopRightRadius:35,
      }}>
        <Text style={{
          fontSize:30,
          textAlign:'center',
          color:Colors.WHITE,
          fontFamily:'outfit-bold',

        }}>Welcome to CodeDev Expert</Text>
        <Text style={{
           fontSize:20,
            color:Colors.WHITE,
            marginTop:20,
            textAlign:'center',
            fontFamily:'outfit'
        }}>Transform your ideas into engaging educational content effortlessly with AI 📚💻</Text>

      <TouchableOpacity style ={styles.button}
      onPress={()=>router.push('/auth/signUp')}
      >
      <Text style ={[styles.buttonText,{color:Colors.PRIMARY}]}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>router.push('/auth/signIn')} style ={[styles.button,{
        backgroundColor:Colors.PRIMARY,
        borderWidth:1,
        borderColor: Colors.WHITE
      }]}>
      <Text style ={styles.buttonText}>Already hav an account</Text>
      </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet
.create({
  button:{
    padding:15,
    backgroundColor:Colors.WHITE,
    marginTop:20,
    borderRadius:30,
  },
  buttonText:{
    textAlign:'center',
    fontSize: 18,
    fontFamily:'outfit',
  }
})