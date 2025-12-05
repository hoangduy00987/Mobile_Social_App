import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Community {
  community_id: number
  name: string
  avatar: string
  created_by: number
  type_id: number
  created_at: string
  updated_at: string
}

export default function CustomDrawer(props: any) {
    const router = useRouter();
    const { authUser } = useAuth();
    const [myCommunity, setMyCommunity] = useState<Community[]>([]);
    const [joinedCommunity, setJoinedCommunity] = useState<Community[]>([]);

    const fetchDataMyCommunity = async () => {
        if (!authUser?.user_id) return;
        try {
            const data = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community/by-created/${authUser.user_id}`);
            setMyCommunity(data.data || []);
        } catch(error: any) {
            console.log(">>> Error: ", error);
        }
    }

    const fetchDataJoinedCommunity = async () => {
        if (!authUser?.user_id) return;
        try {
            const data = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community/joined-community/${authUser.user_id}`);
            setJoinedCommunity(data.data || []);
        } catch(error: any) {
            console.log(">>> Error: ", error);
        }        
    }

    useEffect(() => {
        if (authUser?.user_id) {
            fetchDataMyCommunity()
            fetchDataJoinedCommunity()
        }
    }, [authUser?.user_id]);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label="Explore Communities"
                icon={({ color, size }) => (
                    <AntDesign name="global" size={22} color="black" />
                )}
                onPress={() => router.push('/(protected)/(tabs)/communities')}
            />
            <DrawerItem
                label="Start a Community"
                icon={({ color, size }) => (
                    <AntDesign name="plus-circle" size={22} color="black" />
                )}
                onPress={() => router.push('/(community)/createCommunity')}
            />
            <View
                style={{
                    height: 1,
                    backgroundColor: '#ccc',
                    width: '100%',
                    marginVertical: 10,
                }}
            />
            <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: 600 }}>Communities</Text>
            </View>
            <View style={{ 
                paddingHorizontal: 12, 
                flexDirection: 'row', 
                alignItems: 'center',
                gap: 2,
            }}>
                <AntDesign name="caret-right" size={18} color="black" />
                <Text style={{ fontSize: 14, fontWeight: '600', marginLeft: 8 }}>
                    My Communities
                </Text>
            </View>
            <View style={{
                paddingHorizontal: 20
            }}>
                {myCommunity.map((item) => (
                    <TouchableOpacity 
                        key={item?.community_id}
                        style={{ 
                            paddingHorizontal: 12, 
                            flexDirection: 'row', 
                            alignItems: 'center',
                            paddingLeft: 30,
                            marginVertical: 5,
                            gap: 5,
                            width: '100%',
                            paddingVertical: 10,
                            backgroundColor: '#fafafaff',
                            borderRadius: 10
                        }}
                        onPress={() => router.push({
                            pathname: '/(community)/community',
                            params: { name: item.name, community_id: item.community_id, created_by: item.created_by }
                        })}
                    >
                        <Image
                            source={
                                item.avatar && item.avatar !== ""
                                ? { uri: item.avatar }
                                : require('../../assets/header.png')
                            }
                            style={{
                                width: 25,
                                height: 25,
                                borderRadius: '50%',
                            }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: 600, color: '#868282ff' }}>
                            r/{item?.name}
                        </Text>
                    </TouchableOpacity>                
                ))}                
            </View>

            <View style={{ 
                paddingHorizontal: 12, 
                flexDirection: 'row', 
                alignItems: 'center',
                gap: 5,
                marginTop: 20
            }}>
                <AntDesign name="caret-right" size={18} color="black" />
                <Text style={{ fontSize: 14, fontWeight: '600', marginLeft: 8 }}>
                    Joined Communities
                </Text>
            </View>
            <View style={{
                paddingHorizontal: 20
            }}>
                {joinedCommunity.map((item) => (
                    <TouchableOpacity 
                        key={item?.community_id}
                        style={{ 
                            paddingHorizontal: 12, 
                            flexDirection: 'row', 
                            alignItems: 'center',
                            paddingLeft: 30,
                            marginVertical: 5,
                            gap: 5,
                            width: '100%',
                            paddingVertical: 10,
                            backgroundColor: '#fafafaff',
                            borderRadius: 10
                        }}
                        onPress={() => router.push({
                            pathname: '/(community)/community',
                            params: { name: item.name, community_id: item.community_id, created_by: item.created_by }
                        })}
                    >
                        <Image
                            source={
                                item.avatar && item.avatar !== ""
                                ? { uri: item.avatar }
                                : require('../../assets/header.png')
                            }
                            style={{
                                width: 25,
                                height: 25,
                                borderRadius: '50%',
                            }}
                        />
                        <Text style={{ fontSize: 14, fontWeight: 600, color: '#868282ff' }}>
                            r/{item?.name}
                        </Text>
                    </TouchableOpacity>                
                ))}                
            </View>
        </DrawerContentScrollView>
    );
}