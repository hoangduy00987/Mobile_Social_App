import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

type Community = {
    community_id: number
    name: string
    created_by: number
    avatar: string
    members: number
    created_at: string
    status: string
}

type Member = {
    community_id: number,
    user_id: number,
    role: string
    status: string
    joined_at: string
    avatar: string
}

const CommunityScreen = () => {
    const router = useRouter();
    const [infoCommunity, setInfoCommunity] = useState<Community>();
    const [infoMember, setInfoMember] = useState<Member[]>([]);
    const [infoMemberPending, setInfoMemberPending] = useState<Member[]>([]);
    const [openOptions, setOpenOptions] = useState(false);
    const [openPanel, setOpenPanel] = useState(false);
    const { community_id ,name, created_by } = useLocalSearchParams();
    const [panelType, setPanelType] = useState<"members" | "requests">("members");
    const { authUser } = useAuth();

    const fetchDataCommunity = async () => {
        try {
            const data = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community/${name}`);
            setInfoCommunity(data.data);
        } catch(error: any) {
            console.log(">>> Error: ", error);
        }
    }

    const fetchMemberCommunity = async () => {
        try {
            const data = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community-member/${community_id}`);
            setInfoMember(data?.data?.members);
        } catch(error: any) {
            console.log(">>> Error: ", error);
        }
    }

    const fetchMemberPendingCommunity = async () => {
        try {
            const data = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community-member/pending/${community_id}`);
            setInfoMemberPending(data?.data?.members);
        } catch(error: any) {
            console.log(">>> Error: ", error);
        }
    }

    useEffect(() => {
        fetchDataCommunity();
        fetchMemberCommunity();
        fetchMemberPendingCommunity();
    }, [name, community_id]);

    const handleOpenPanel = (type: "members" | "requests") => {
        setPanelType(type);
        setOpenPanel(true);
        setOpenOptions(false);
    };
    const formatDateUTC = (dateString: string) => {
        if (!dateString) return "Unknown date";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Unknown date";

        const year = date.getUTCFullYear();
        const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const day = String(date.getUTCDate()).padStart(2, '0');

        return `Created ${month} ${day}, ${year}`;
    };

    const PanelContent = () => (
        <View style={styles.containerPanel}>
            <TouchableOpacity
                style={styles.btnClose}
                onPress={() => setOpenPanel(false)}
            >
                <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>

            <View style={styles.containerMember}>
                <Text style={{ fontSize: 18, fontWeight: 700 }}>
                    {panelType === "members" ? `` : `Requests: ${infoMemberPending.length}`}
                </Text>

                {panelType === 'members' && infoMember.map((item, index) => (
                    <View style={[styles.cardMember, item?.user_id === authUser?.user_id && styles.cardMemberAd]} key={`idx-${index}-${item?.community_id}`}>
                        <Image
                            source={ item?.avatar && item.avatar !== "" ? { uri: item.avatar } : require('../../../assets/header.png') }
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                        />

                        <View style={styles.infoMember}>
                            <Text style={{ fontWeight: 600 }}>u/user{index}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 600, color: '#9c9c9cff' }}>
                                {formatDateUTC(item?.joined_at)}
                            </Text>
                        </View>

                        {item?.user_id !== authUser?.user_id && (
                            <TouchableOpacity style={styles.btnDeleMem}>
                                <AntDesign name="close-circle" size={20} color="black" />
                            </TouchableOpacity>                         
                        )}
                    </View>                    
                ))}

                {panelType === 'requests' && infoMemberPending.map((item, index) => (
                    <View style={[styles.cardMember, item?.user_id === authUser?.user_id && styles.cardMemberAd]} key={`idx-${index}-${item?.community_id}`}>
                        <Image
                            source={ item?.avatar && item.avatar !== "" ? { uri: item.avatar } : require('../../../assets/header.png') }
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                        />

                        <View style={styles.infoMember}>
                            <Text style={{ fontWeight: 600 }}>u/user{index}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 600, color: '#9c9c9cff' }}>
                                {formatDateUTC(item?.joined_at)}
                            </Text>
                        </View>

                        <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 5 }}>
                            <TouchableOpacity style={styles.btnDeleMem}>
                                <AntDesign name="close-circle" size={20} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnDeleMem}>
                                <AntDesign name="check-circle" size={20} color="black" />
                            </TouchableOpacity>                        
                        </View>  
                    </View>                    
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            
            {openOptions && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setOpenOptions(false)}
                >
                    <View style={styles.options}>
                        <TouchableOpacity
                            style={styles.btnOptions}
                            onPress={() => handleOpenPanel("members")}
                        >
                            <Text style={{ fontWeight: 600 }}>Members</Text>
                        </TouchableOpacity>

                        {Number(created_by) === authUser?.user_id && (
                            <TouchableOpacity
                                style={styles.btnOptions}
                                onPress={() => handleOpenPanel("requests")}
                            >
                                <Text style={{ fontWeight: 600 }}>Request</Text>
                            </TouchableOpacity>                            
                        )}

                        <TouchableOpacity style={styles.btnOptions}>
                            <Text style={{ fontWeight: 600, color: '#ff6363ff' }}>Leave</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}

            {openPanel && (
                <View style={styles.overlayScreen}>
                    <PanelContent />
                </View>
            )}

            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => {router.back(), setInfoCommunity(undefined)}}>
                    <AntDesign name="caret-left" size={22} color="black" />
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.more} onPress={() => setOpenOptions(!openOptions)}>
                    <Text>•••</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.info}>
                <Image
                    source={ infoCommunity?.avatar && infoCommunity.avatar !== "" ? { uri: infoCommunity.avatar } : require('../../../assets/header.png') }
                    style={{ width: 70, height: 70, borderRadius: '50%' }}
                />
                <View style={styles.personalInfo}>
                    <Text style={styles.name}>u/{name}</Text>
                    <Text style={styles.dateOfBirth}>{formatDateUTC(infoCommunity?.created_at!)}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.joinButton, infoCommunity?.status === 'APPROVED' && styles.joinedButton]}
                    disabled={infoCommunity?.status === 'APPROVED' ? true : false}
                >
                    <Text style={{ color: infoCommunity?.status === 'APPROVED' ? '#adadadff' : '#fff', fontWeight: 600 }}>{infoCommunity?.status === 'APPROVED' ? 'Joined' : 'Join'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CommunityScreen;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 5,
    },
    options: {
        position: 'absolute',
        top: 85,
        right: 10,
        backgroundColor: '#e7e7e7ff',
        borderRadius: 10,
        width: 150,
        zIndex: 10,
    },
    btnOptions: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    overlayScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
        justifyContent: 'flex-end',
    },
    containerPanel: {
        position: 'relative',
        backgroundColor: '#fff',
        width: '80%',
        height: '100%',
        marginLeft: 'auto'
    },
    btnClose: {
        position: 'absolute',
        padding: 5,
        borderRadius: '50%',
        top: 50,
        left: -15,
        backgroundColor: '#fff',
        borderWidth: 1
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#5e87e0ff', 
        height: 100, 
        paddingHorizontal: 10 
    },
    back: { flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 20 },
    more: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 9, borderRadius: '50%', marginTop: 20 },
    info: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    personalInfo: {
        gap: 5,
        paddingLeft: 10
    },
    name: {
        fontSize: 16,
        fontWeight: 700,
        color: '#000'
    },
    dateOfBirth: {
        fontWeight: 600,
        color: '#818181ff'
    },
    joinButton: {
        marginLeft: 'auto',
        backgroundColor: '#5e87e0ff',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
    },
    joinedButton: {
        marginLeft: 'auto',
        backgroundColor: '#e4e4e4ff',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#CCC'
    },
    containerMember: {
        paddingLeft: 30,
        paddingRight: 10,
        marginTop: 50,
    },
    cardMember: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#f3f3f3ff',
        padding: 7,
        borderRadius: 15
    },
    cardMemberAd: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#ffd7c7ff',
        padding: 7,
        borderRadius: 15
    },
    infoMember: {},
    btnDeleMem: {
        marginLeft: 'auto',
        transform: [{ translateX: -10 }]
    }
});