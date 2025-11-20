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
    const data_ = [
        {
            name: data[0].category,
            population: data[1].duration_seconds,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Kodlama",
            population: data[1],
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Proje",
            population: data[2],
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Kitap Okuma",
            population: data[3],
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Diğer",
            population: data[4],
            color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];
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
