import {
    BarChart
} from "react-native-chart-kit";
import {Dimensions, StyleSheet, View, Text,ViewStyle,TextStyle } from "react-native";
import {FunctionComponent} from "react";
import {white} from "nativewind/dist/metro/picocolors";

const { width: screenWidth } = Dimensions.get('window');

export type DataSet = {
    data: Array<number>;
};

export type BarChartData = {
    labels: Array<string>;
    datasets: Array<DataSet>;
};

export interface OdaklanmaSuresiChartProps {
    data_: BarChartData;
}

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

export const OdaklanmaSonHaftaBarChart: FunctionComponent<OdaklanmaSuresiChartProps> = (
    props: OdaklanmaSuresiChartProps,
) => (
    <>
        <Text style={styles.chartTitle}> Odaklanma Grafiği Son 7 Gün </Text>
        <BarChart
            style={styles.graphStyle}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            segments={4}
            data={props.data_}
            width={screenWidth}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={-90}
        />
    </>
);

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
