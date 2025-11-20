import {
    PieChart
} from "react-native-chart-kit";
import {Dimensions, StyleSheet, View, Text,ViewStyle,TextStyle } from "react-native";
import {FunctionComponent} from "react";
import {white} from "nativewind/dist/metro/picocolors";

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

export function OdaklanmaKategoriPieChart({data}: DataSetKategorik){
    // Sabit renk ve font ayarları
    const FIXED_CHART_PROPS = {
        color: "rgba(131, 167, 234, 1)", // Sabit Dilim Rengi
        legendFontColor: "#7F7F7F",      // Sabit Etiket Rengi
        legendFontSize: 15               // Sabit Etiket Yazı Boyutu
    };

    // Gelen diziyi map (dönüştür) ederek istenen yapıyı oluştururuz
    const data_ = data.map((item) => {
        return {
            // Dinamik veriler
            name: item.category,              // Kategori Adı
            population: item.duration_seconds,  // Toplam Süre (Büyüklük)
            // Sabit veriler
            ...FIXED_CHART_PROPS,
        };
    });

    return(
        <View>
            <Text style={styles.chartTitle}> Odaklanma Grafiği Son 7 Gün </Text>
            <PieChart
                data={data_}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 50]}
                absolute
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
