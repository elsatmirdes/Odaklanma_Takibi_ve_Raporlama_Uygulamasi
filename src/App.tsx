
import { Assets as NavigationAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';

import * as React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// SQLiteProvider'ı ve 'type' olarak db'yi import ediyoruz
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

import { Navigation } from './navigation';
import './globals.css';

Asset.loadAsync([
    ...NavigationAssets,
    require('./assets/newspaper.png'),
    require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

// --- ÇÖZÜM BURADA ---
// 1. Veritabanını başlatan (tabloları oluşturan) fonksiyonu tanımla
const initializeDB = async (db: SQLiteDatabase) => {
    // WAL modunu etkinleştirmek performansı artırır (önerilir)
    await db.execAsync('PRAGMA journal_mode = WAL;');


    // ReportsScreen'deki veriye göre tablo şemasını oluştur
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      duration_seconds INTEGER NOT NULL,
      distraction_count INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL
    );
  `);

    // Buraya başka 'CREATE TABLE...' sorguları da ekleyebilirsiniz
    console.log("Veritabanı tabloları başarıyla oluşturuldu/kontrol edildi.");
};
// --- ÇÖZÜM BİTTİ ---


export function App() {
    const colorScheme = useColorScheme(); // <-- 3. SİLİNDİ
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme; // <-- 4. SİLİNDİ
    return (
        <React.Suspense fallback={<View />}>

            {/* 2. 'initializeDB' fonksiyonunu 'onInit' prop'una ata */}
            <SQLiteProvider
                databaseName="focus_sessions.db"
                onInit={initializeDB} // <-- HATA DÜZELTMESİ
            >

                <Navigation
                    theme={theme} // <-- 5. HATA VEREN PROP SİLİNDİ
                    linking={{
                        enabled: 'auto',
                        prefixes: [prefix],
                    }}
                    onReady={() => {
                        SplashScreen.hideAsync();
                    }}
                />

            </SQLiteProvider>
        </React.Suspense>
    );
}