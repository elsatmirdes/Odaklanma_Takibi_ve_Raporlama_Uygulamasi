import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native'; // Ekran geri gelince yenilemek için
import {
    getDashboardStats,
    getAllSessions,
    formatTime,
    type DashboardStats,
    type FocusSession
} from '../../services/database';

export function ReportsScreen() {
    const db = useSQLiteContext();

    const [stats, setStats] = useState<DashboardStats>({
        todayFocusTime: 0,
        totalFocusTime: 0,
        totalDistractions: 0
    });

    const [history, setHistory] = useState<FocusSession[]>([]);

    const loadData = async () => {
        // 1. İstatistikleri çek
        const dashboardData = await getDashboardStats(db);
        setStats(dashboardData);

        // 2. Tüm geçmiş listesini çek
        const allData = await getAllSessions(db);
        setHistory(allData);
    };

    // Ekran her görüntülendiğinde verileri yenile
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (

        <ScrollView>
            {/* --- İSTATİSTİK KARTLARI --- */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                <View style={{ padding: 20, backgroundColor: '#e0f7fa' }}>
                    <Text>Bugün Odaklanma</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {formatTime(stats.todayFocusTime)}
                    </Text>
                </View>

                <View style={{ padding: 20, backgroundColor: '#fff3e0' }}>
                    <Text>Toplam Odaklanma</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {formatTime(stats.totalFocusTime)}
                    </Text>
                </View>

                <View style={{ padding: 20, backgroundColor: '#ffebee' }}>
                    <Text>Toplam Dikkat Dağınıklığı</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {stats.totalDistractions}
                    </Text>
                </View>
            </View>

            {/* --- GEÇMİŞ LİSTESİ --- */}
            <Text style={{ fontSize: 20, marginTop: 20 }}>Geçmiş Oturumlar</Text>
            {history.map((session) => (
                <View key={session.id} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}>
                    <Text>Tarih: {session.created_at}</Text>
                    <Text>Süre: {formatTime(session.duration_seconds)}</Text>
                    <Text>Dikkat Dağılma: {session.distraction_count}</Text>
                </View>
            ))}
        </ScrollView>
    );
}