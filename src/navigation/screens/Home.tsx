import { Text } from '@react-navigation/elements';
import {AppState, Button,StyleSheet, View,Pressable  } from 'react-native';
import PrimaryButton from "../../../components/PrimaryButton";
import React, { useRef, useState, useEffect } from "react";
import Constants from 'expo-constants';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import {black} from "nativewind/dist/metro/picocolors";
import CategoryPicker from '../../../components/CategoryPicker';

export function Home() {
    // dakika ayarı (1–25 arası)
    const [minutes, setMinutes] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [key, setKey] = useState(0); // reset için

    const [running, setRunning] = useState(false);

    const [category, setCategory] = useState('Kodlama');
    const [startedAt, setStartedAt] = useState(null);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);



    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);

        });
    }, []);


    const totalSeconds = minutes * 60;

    // dakika artır/azalt fonksiyonları
    const increaseTime = () => {
        if (minutes < 25 && !isPlaying) setMinutes(minutes + 1);
    };

    const decreaseTime = () => {
        if (minutes > 1 && !isPlaying) setMinutes(minutes - 1);
    };

    // yeniden başlat
    const resetTimer = () => {
        setIsPlaying(false);
        setKey((prev) => prev + 1); // yeniden render
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Odaklanma Zamanlayıcısı</Text>

            {/* Süre ayarlama butonları */}
            <View style={styles.timeAdjustRow}>
                <Pressable style={styles.adjustBtn} onPress={decreaseTime}>
                    <Text style={styles.adjustText}>-</Text>
                </Pressable>

                <Text style={styles.minutesLabel}>{minutes} dk</Text>

                <Pressable style={styles.adjustBtn} onPress={increaseTime}>
                    <Text style={styles.adjustText}>+</Text>
                </Pressable>
            </View>

            <CategoryPicker
            />

            <CountdownCircleTimer
                key={key}
                isPlaying={isPlaying}
                duration={totalSeconds}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"] as const}
                colorsTime={[totalSeconds, totalSeconds * 0.6, totalSeconds * 0.3, 0]}
                onComplete={() => ({ shouldRepeat: false })}
                updateInterval={1}
                size={200}
                strokeWidth={12}
            >
                {({ remainingTime, color }) => {
                    const minutesLeft = Math.floor(remainingTime / 60);
                    const secondsLeft = remainingTime % 60;
                    return (
                        <Text style={[styles.timerText, { color }]}>
                            {String(minutesLeft).padStart(2, "0")}:
                            {String(secondsLeft).padStart(2, "0")}
                        </Text>
                    );
                }}
            </CountdownCircleTimer>

            {/* Başlat / Duraklat ve Sıfırla */}
            <View style={styles.buttonRow}>
                <Button
                    title={isPlaying ? "Duraklat" : "Başlat"}
                    onPress={() => setIsPlaying((prev) => !prev)}
                />
                <Button title="Sıfırla" onPress={resetTimer} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1",
    },
    title: {
        color: "#004777",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
    },
    timerText: {
        fontSize: 40,
        fontWeight: "bold",
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 20,
        gap: 12,
    },
    timeAdjustRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        gap: 20,
    },
    adjustBtn: {
        backgroundColor: "#004777",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
    },
    adjustText: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
    },
    minutesLabel: {
        color: "#004777",
        fontSize: 20,
        fontWeight: "600",
    },
});