import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native'; // Ekran geri gelince yenilemek için
import {
    getDashboardStats,
    getAllSessions,
    formatTime,
    getCategoryData,
    type DashboardStats,
    type FocusSession, getLatestSession
} from '../../services/database';
import {FunctionComponent} from "react";

import {OdaklanmaSonHaftaBarChart,DataSet,BarChartData,OdaklanmaSuresiChartProps} from "../../../components/OdaklanmaSureGrafigi";
import {OdaklanmaKategoriPieChart, DataSetKategorik,pieChartData} from "../../../components/OdaklanmaKategoriGrafigi"
import {BarChart} from "react-native-chart-kit";
import {SafeAreaConsumer,SafeAreaView} from "react-native-safe-area-context";


// Veritabanına kaydedilen her bir oturumun yapısı
export interface chartData {
    record_date: string; // Kayıt tarihi (ISO formatında)
    total_duration: number; // Saniye cinsinden odaklanma süresi

}

export function ReportsScreen() {
    const db = useSQLiteContext();

    const [stats, setStats] = useState<DashboardStats>({
        todayFocusTime: 0,
        totalFocusTime: 0,
        totalDistractions: 0
    });
// 1. BarChartData için boş bir başlangıç yapısı
    const initialBarChartData: BarChartData = {
        labels: [],
        datasets: [{ data: [] }],
    };

// 2. OdaklanmaSuresiChartProps için başlangıç yapısı
    const initialChartProps: OdaklanmaSuresiChartProps = {
        data_: initialBarChartData,
    };

    const initialPieChartData: Array<pieChartData> = [];
// 2. DataSetKategorik için başlangıç yapısı
    const initialPieChartProps: DataSetKategorik = {
        data: initialPieChartData,
    };


    const [history, setHistory] = useState<FocusSession[]>([]);
    const [dataLatestSeven, setDataLatestSeven] = useState<OdaklanmaSuresiChartProps>(initialChartProps);
    const [kategorikDaata_, setKategorikDaata] = useState<DataSetKategorik>(initialPieChartProps);

    const finalize7DaySummary = (sqlResults : Array<FocusSession>) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const summaryMap = new Map();

        // SQL sonuçlarını, hızlı arama için bir Harita'ya (Map) dönüştür
        const focusMap = new Map();
        sqlResults.forEach(row => {
            // row.record_date ve row.total_duration SQL'den gelir
            if (focusMap.has(row.created_at)) {
                // 2. Eğer o gün için zaten bir toplam varsa, yeni süreyi üzerine ekle
                const currentTotal = focusMap.get(row.created_at)!;
                focusMap.set(row.created_at, currentTotal + row.duration_seconds);
            } else {
                // 3. Eğer o gün için ilk kayıt ise, süreyi başlangıç değeri olarak ayarla
                focusMap.set(row.created_at, row.duration_seconds);
            }
        });
        // Son 7 günün tarihlerini belirle ve haritayı tamamla
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // SQL sonucunda o gün varsa süreyi al, yoksa 0 ata
            const duration = focusMap.has(formattedDate)
                ? focusMap.get(formattedDate)
                : 0;

            summaryMap.set(formattedDate, duration);
        }

        // Sonucu tarihe göre sıralı bir diziye dönüştür
        return Array.from(summaryMap.entries()).sort(([dateA], [dateB]) =>
            dateA.localeCompare(dateB)
        );
    }

    const loadData = async () => {
        // 1. İstatistikleri çek
        const dashboardData = await getDashboardStats(db);
        setStats(dashboardData);

        // 2. Tüm geçmiş listesini çek
        const allData = await getAllSessions(db);
        setHistory(allData);

        const latestData = await getLatestSession(db);

// 3. Son 7 günlük özet veriyi al
        const finalData = finalize7DaySummary(latestData); // Ör: [["2025-11-13", 0], ["2025-11-14", 120], ...]

        // 4. Etiketleri ve Veriyi Ayırma
        const labels: string[] = finalData.map(([date, _]) => {
            // Tarih formatını kısaltabilirsiniz (örneğin sadece MM/DD)
            const parts = date.split('-');
            return `${parts[1]}/${parts[2]}`; // Örn: "11/13"
        });

        const dataNumbers: number[] = finalData.map(([_, duration]) => duration);

        const DataSets : DataSet = {
            data: dataNumbers
        }

        console.log(dataNumbers);
        // 5. BarChartData yapısını oluşturma
        const barChartData: BarChartData = {
            labels: labels,
            datasets: [DataSets]
        };
        const odaklanmaSuresi:OdaklanmaSuresiChartProps = {
            data_: barChartData
        }

        // Pie Chart formatına dönüştürülmüş dilimleri tutacak dizi
        const transformedSlices: Array<pieChartData> = [];

        /** katgorik grafik işlemleri bu kısımda */
        const kategorikData = await getCategoryData(db);
        kategorikData.forEach((kategorik) => {
            const sliceData:pieChartData = {
                category: kategorik.category,
                duration_seconds: kategorik.duration_seconds,
            }

            transformedSlices.push(sliceData);
        })
// 3. DataSetKategorik yapısını oluşturma
        const dataSet: DataSetKategorik = {
            data: transformedSlices // Dönüştürülmüş dizi buraya yerleştirilir
        };
        console.log("Kategorik data: ",kategorikData);

        // 6. State'i Güncelleme
        setDataLatestSeven(odaklanmaSuresi);
        setKategorikDaata(dataSet);


    };

    // Ekran her görüntülendiğinde verileri yenile
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <SafeAreaView>
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

            <View>
                <OdaklanmaSonHaftaBarChart data_={dataLatestSeven.data_}/>
            </View>
            <View style={{ padding: 20}}>
                <OdaklanmaKategoriPieChart data={kategorikDaata_.data}/>
            </View>



        </ScrollView>
        </SafeAreaView>
    );
}