import * as React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CardForum from '../../components/forum/card';

export default function HomeScreen({ navigation }) {
  return (
    <>
      <View style={{ backgroundColor: "white", paddingBottom: 20 }}>
        <View style={{marginLeft: 10, marginTop: 20}}>
          <Text style={{fontSize: 40, fontWeight: "500", marginBottom: 5}}>Forum</Text>
          <Text style={{ color: "grey", fontWeight: "300", fontSize: 15}}>this is the detail</Text>
          <View style={{ borderColor: "#004aad", borderWidth: 2, width: 70, borderRadius: 20, marginTop: 20}}>
            <Text style={{margin: 10, color: "#004aad"}}> Forum </Text>
          </View>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: "#F6F1F1", paddingTop: 20}}>
        <CardForum navigation={navigation}/>
      </ScrollView>
    </>
  );
}