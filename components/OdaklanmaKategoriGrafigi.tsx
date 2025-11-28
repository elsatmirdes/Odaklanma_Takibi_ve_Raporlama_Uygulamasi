import {
    PieChart
} from "react-native-chart-kit";
import {Dimensions, StyleSheet, View, Text,ViewStyle,TextStyle } from "react-native";
import {FunctionComponent} from "react";
import {white} from "nativewind/dist/metro/picocolors";
import { useEffect, useState, useCallback } from 'react';

const { width: screenWidth } = Dimensions.get('window');


export type pieChartData = {
    category: string;
    duration_seconds: number;
}

export type DataSetKategorik = {
    data: Array<pieChartData>
};

const chartConfig = {
    backgroundGradientFrom: '#Ffffff',
    backgroundGradientTo: '#ffffff',
    barPercentage: 1.3,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,

    style: {
        borderRadius: 16,
        fontFamily: 'Bogle-Regular',
    },
    propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: '#efefef',
        strokeDasharray: '0',
    },
    propsForLabels: {
        fontFamily: 'Bogle-Regular',
    },
};

export function OdaklanmaKategoriPieChart(props: DataSetKategorik){

    const chartData = props.data;
    // Sabit renk ve font ayarları

    // her render’da yeni rastgele renkler üretmek için fonksiyon
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 1)`; // tam opak renk
    };

    // Gelen diziyi map (dönüştür) ederek istenen yapıyı oluştururuz
    const data_ = chartData.map((item) => {
        return {
            // Dinamik veriler
            name: item.category,              // Kategori Adı
            population: item.duration_seconds,  // Toplam Süre (Büyüklük)
            // Sabit veriler
            color: getRandomColor(), // Sabit Dilim Rengi
            legendFontColor: "#7F7F7F",      // Sabit Etiket Rengi
            legendFontSize: 15
        };
    });

    return(
        <View>
            <Text style={styles.chartTitle}> Odaklanma Kategorik Grafiği </Text>
            <PieChart
                data={data_}
                width={screenWidth}
                height={200}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"-15"}
                center={[5, 5]}
                absolute={false}
                hasLegend
            />
        </View>
    );
}

const styles = StyleSheet.create<{
    graphStyle: ViewStyle;
    chartTitle: TextStyle;
}>({
    graphStyle: {
        flex: 1,
        paddingRight: 35,
    },
    chartTitle: {
        color: "white",
        paddingLeft: 50,
        paddingBottom: 20,
        paddingTop: 10,
        fontFamily: 'Bogle-Regular',
        fontSize: 16,
    },
})
