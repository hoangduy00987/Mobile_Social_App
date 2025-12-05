import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { showSuccess } from '../../utils/toastMessage';

type DataType = {
  type_id: number;
  type: string;
  description: string;
};

const CommunityTypeScreen = () => {
  const [selected, setSelected] = useState<number>(1);
  const [communityName, setCommunityName] = useState("");
  const router = useRouter();
  const [dataType, setDataType] = useState<DataType[]>([]);

  const fetchData = async () => {
    try {
      const data = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community-type`);
      setDataType(data?.data || []);
    } catch (error: any) {
      console.log(">>> Error: ", error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  const renderIcon = (type: string) => {
    if (type === "Public") {
      return <AntDesign name="plus-circle" size={22} color="black" />;
    }
    if (type === "Private") {
      return <Feather name="lock" size={22} color="black" />;
    }
    return <Feather name="eye" size={22} color="black" />;
  };

  const handleCreateCommunity = async () => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community`, {
        name: communityName,
        type_id: selected,
        created_by: 1
      });
      const community_id = response?.data?.community_id;
      showSuccess('Created successfully', 'Explore and post in new communities now!');
      setCommunityName('');
      setSelected(1);
      router.push({
        pathname: '/(community)/community',
        params: { name: communityName, community_id: community_id, created_by: 1 }
      })
    } catch(error: any) {
      console.log(">>> Error: ", error);
    }
  }

  return (
    <>
      <View style={{
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 50,
        paddingHorizontal: 10,
        justifyContent: 'center'
      }}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <AntDesign name="caret-left" size={22} color="black" />
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Create Community</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>Select community type</Text>
        <Text style={styles.description}>
          Decide who can view and contribute in your community. Only public communities show up in search.
        </Text>

        {dataType.map((item) => (
          <TouchableOpacity
            key={item.type_id}
            style={styles.optionContainer}
            onPress={() => setSelected(item.type_id)}
          >
            <View style={styles.iconBox}>
              {renderIcon(item.type)}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>{item.type}</Text>
              <Text style={styles.optionDesc}>{item.description || "No description"}</Text>
            </View>

            {selected === item.type_id ? (
              <FontAwesome name="dot-circle-o" size={22} color="#007AFF" />
            ) : (
              <FontAwesome name="circle-o" size={22} color="#808080" />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <Text style={styles.inputLabel}>Community name</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 30,
            borderColor: "#CCC"
          }}
        >
          <Text style={{ fontSize: 16, color: "#000" }}>r/</Text>
          <TextInput
            style={{ flex: 1, fontSize: 16, paddingVertical: 10 }}
            value={communityName}
            onChangeText={setCommunityName}
            placeholder="community-name"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={() => handleCreateCommunity()}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CommunityTypeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  back: { flexDirection: 'row', gap: 5, alignItems: 'center', position: 'absolute', left: 15, top: 0 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  description: { fontSize: 14, color: "#555", marginBottom: 20 },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  iconBox: { width: 35 },
  optionTitle: { fontSize: 16, fontWeight: "500" },
  optionDesc: { fontSize: 12, color: "#555" },
  divider: {
    height: 1,
    backgroundColor: "#E3E3E3",
    marginVertical: 20
  },
  inputLabel: { fontSize: 15, fontWeight: "500", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: "auto",
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});