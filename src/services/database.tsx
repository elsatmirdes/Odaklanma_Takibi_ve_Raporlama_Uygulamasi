import * as SQLite from 'expo-sqlite';
import { type SQLiteDatabase } from 'expo-sqlite';


// --- 1. TİP TANIMLAMALARI (TYPES) ---

// Veritabanına kaydedilen her bir oturumun yapısı
export interface FocusSession {
    id: number;
    duration_seconds: number; // Saniye cinsinden odaklanma süresi
    distraction_count: number; // Dikkat dağılma sayısı
    created_at: string; // Kayıt tarihi (ISO formatında)
    category: string;
}

// Dashboard ekranında göstereceğin istatistik objesi
export interface DashboardStats {
    todayFocusTime: number;    // Bugün toplam saniye
    totalFocusTime: number;    // Tüm zamanlar toplam saniye
    totalDistractions: number; // Tüm zamanlar toplam dikkat dağınıklığı
}

// --- 2. VERİTABANI KURULUMU (MIGRATION) ---

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1; // Versiyonu 1'den başlatıyoruz, sıfırdan kuruyoruz.

    const result = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );

    let currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 0) {
        console.log('Veritabanı oluşturuluyor: Tablo focus_sessions');
        await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        duration_seconds INTEGER NOT NULL,
        distraction_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        category TEXT NOT NULL
      );
      
      
    `);
        console.log('Veritabanı OLUŞTURULDUU');
        currentDbVersion = 1;
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// --- 3. CRUD VE İSTATİSTİK FONKSİYONLARI ---

/**
 * CREATE: Yeni bir odaklanma oturumu kaydeder.
 * Örn: Sayaç bittiğinde çağırılır.
 */
export async function addFocusSession(
    db: SQLiteDatabase,
    durationSeconds: number,
    distractionCount: number,
    category: string

) {
    // Basit bir unique ID oluşturma (UUID kütüphanesi yoksa bu yeterlidir)

    console.log('✅ Oturum kaydedildi1.');
    const statement = await db.prepareAsync(
        `INSERT INTO focus_sessions (duration_seconds, distraction_count, category) VALUES ($durationSeconds, $distractionCount, $category)`
    );
    console.log('✅ Oturum kaydedildi2.');
    console.log(durationSeconds,  distractionCount,  category );
    try {
        await statement.executeAsync({
            $durationSeconds: durationSeconds,
            $distractionCount: distractionCount,
            $category: category,
        });
        console.log('✅ Oturum kaydedildi3.');
    } catch (e) {
        console.error('Kayıt hatası:', e);
    } finally {
        await statement.finalizeAsync();
    }
}

/**
 * READ (DASHBOARD): İstenen 3 temel istatistiği tek sorguda hesaplar.
 * 1. Bugün Toplam Odaklanma
 * 2. Tüm Zamanlar Toplam Odaklanma
 * 3. Toplam Dikkat Dağınıklığı
 */
export async function getDashboardStats(db: SQLiteDatabase): Promise<DashboardStats> {
    // 1. Tüm zamanların toplamları
    const allTimeResult = await db.getFirstAsync<{ total_time: number, total_distractions: number }>(
        `SELECT 
            SUM(duration_seconds) as total_time, 
            SUM(distraction_count) as total_distractions 
         FROM focus_sessions`
    );

    // 2. Bugünün toplamı (Localtime kullanarak gün karşılaştırması)
    const todayResult = await db.getFirstAsync<{ today_time: number }>(
        `SELECT 
            SUM(duration_seconds) as today_time
         FROM focus_sessions
         WHERE date(created_at) = date('now', 'localtime')`
    );

    return {
        todayFocusTime: todayResult?.today_time ?? 0,
        totalFocusTime: allTimeResult?.total_time ?? 0,
        totalDistractions: allTimeResult?.total_distractions ?? 0
    };
}

/**
 * READ (LIST): Kaydedilmiş tüm verileri listelemek için (Geçmiş Ekranı için).
 * En yeniden en eskiye doğru sıralar.
 */
export async function getAllSessions(db: SQLiteDatabase): Promise<FocusSession[]> {
    return await db.getAllAsync<FocusSession>(
        'SELECT * FROM focus_sessions ORDER BY created_at DESC'
    );
}

/**
 * DELETE: Hatalı girilmiş bir kaydı silmek için.
 */
export async function deleteSession(db: SQLiteDatabase, id: string) {
    await db.runAsync('DELETE FROM focus_sessions WHERE id = ?', [id]);
    console.log(`🗑️ Oturum ${id} silindi.`);
}

/**
 * UPDATE: (Gerekirse) Bir oturumun notunu veya süresini düzeltmek için.
 */
export async function updateSession(
    db: SQLiteDatabase,
    id: number,
    data: Partial<Pick<FocusSession, 'duration_seconds' | 'distraction_count'>>
) {
    // Sadece değişen alanları güncellemek için dinamik sorgu
    const fields: string[] = [];
    const values: any[] = [];

    if (data.duration_seconds !== undefined) { fields.push('duration_seconds = ?'); values.push(data.duration_seconds); }
    if (data.distraction_count !== undefined) { fields.push('distraction_count = ?'); values.push(data.distraction_count); }


    if (fields.length === 0) return;

    values.push(id);
    const query = `UPDATE focus_sessions SET ${fields.join(', ')} WHERE id = ?`;

    await db.runAsync(query, values);
    console.log(`✏️ Oturum ${id} güncellendi.`);
}

// --- 4. YARDIMCI FORMAT FONKSİYONLARI ---

/**
 * Saniyeyi okunaklı formata çevirir.
 * Örn: 3665 sn -> "1s 1dk" (Saat varsa saati, yoksa dakikayı gösterir)
 * Bunu UI tarafında kullanabilirsin.
 */
export function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds} sn`;

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) {
        return `${h} sa ${m} dk`;
    } else {
        return `${m} dk`;
    }
}