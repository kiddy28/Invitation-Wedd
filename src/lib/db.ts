import { createClient } from "@libsql/client";

// Inisialisasi koneksi ke Turso Cloud Database via Environment Variables
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// Penyiapan tabel utama di Cloud Database
await db.executeMultiple(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_name TEXT NOT NULL,
    phone TEXT,
    attendance TEXT,
    guest_count INTEGER,
    message TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Data Default Konfigurasi Undangan
const DEFAULT_CONFIG: Record<string, string> = {
  BRIDE_NICKNAME: "Fey",
  BRIDE_FULLNAME: "Fera Oktapia",
  BRIDE_PARENTS: "Putri tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]",
  BRIDE_INSTAGRAM: "feraoktapia___",
  BRIDE_IMAGE: "https://placehold.co/600x800?text=Fey+Portrait",
  GROOM_NICKNAME: "Yaya",
  GROOM_FULLNAME: "Yahya Zulfikri",
  GROOM_PARENTS: "Putra tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]",
  GROOM_INSTAGRAM: "zulfikriyahya_",
  GROOM_IMAGE: "https://placehold.co/600x800?text=Yaya+Portrait",
  VENUE_NAME: "The Royal Azure Ballroom",
  VENUE_ADDRESS: "Jl. Taman Makam Pahlawan No.48, Kab. Pandeglang, Banten",
  VENUE_LAT: "-6.3032707",
  VENUE_LNG: "106.1011039",
  AKAD_TITLE: "Akad Nikah",
  AKAD_DAY: "Minggu",
  AKAD_DATE: "11 Oktober 2025",
  AKAD_START: "08:00",
  AKAD_END: "10:00",
  AKAD_ISO_START: "2025-10-11T08:00:00+07:00",
  AKAD_ISO_END: "2025-10-11T10:00:00+07:00",
  RESEPSI_TITLE: "Resepsi Pernikahan",
  RESEPSI_DAY: "Minggu",
  RESEPSI_DATE: "11 Oktober 2025",
  RESEPSI_START: "11:00",
  RESEPSI_END: "14:00",
  RESEPSI_ISO_START: "2025-10-11T11:00:00+07:00",
  RESEPSI_ISO_END: "2025-10-11T14:00:00+07:00",
  HERO_IMAGE:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
  HERO_CITY: "Kab. Pandeglang, Banten",
  MUSIC_URL: "https://www.bensound.com/bensound-music/bensound-forever.mp3",
  RSVP_MAX_GUESTS: "20",
  BANK_ACCOUNTS: JSON.stringify([
    { bank: "Bank BCA", number: "1234567890", name: "Fera Oktapia" },
    { bank: "Bank Mandiri", number: "0987655432", name: "Yahya Zulfikri" },
  ]),
  LOVE_STORY: JSON.stringify([
    {
      date: "2020",
      title: "Awal Pertemuan",
      desc: "Atas izin Allah, kami dipertemukan dalam suasana yang sederhana namun penuh makna.",
    },
    {
      date: "2022",
      title: "Menjalin Harapan",
      desc: "Dengan niat baik, kami memutuskan untuk saling mengenal dan membangun komitmen menuju ridho-Nya.",
    },
    {
      date: "2025",
      title: "Ikatan Suci",
      desc: "Insya Allah, kami memantapkan hati untuk menyempurnakan separuh agama dalam ikatan pernikahan.",
    },
  ]),
  GALLERY_IMAGES: JSON.stringify([
    "https://placehold.co/800x1200?text=Moment+1",
    "https://placehold.co/1200x800?text=Moment+2",
    "https://placehold.co/800x800?text=Moment+3",
    "https://placehold.co/800x1200?text=Moment+4",
    "https://placehold.co/1200x800?text=Moment+5",
    "https://placehold.co/800x1200?text=Moment+6",
  ]),
  TEXT_SALAM_OPENING: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
  TEXT_QUOTE_AR_RUM: `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."`,
  TEXT_QUOTE_SOURCE: "QS. Ar-Rum: 21",
  TEXT_INVITATION:
    "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, kawan, dan sahabat, untuk memberikan doa restu pada acara pernikahan kami:",
  TEXT_CLOSING:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.",
  TEXT_SALAM_CLOSING: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  TEXT_SIGNATURE: "Kami yang berbahagia,",
  TEXT_FAMILY: "Kel. Bpk [Ayah Pria] & Kel. Bpk [Ayah Wanita]",
  TEXT_GIFT_TITLE: "Tanda Kasih",
  TEXT_GIFT_DESC:
    "Kehadiran dan doa restu Anda adalah hadiah terbaik bagi kami. Namun, jika Anda ingin memberikan tanda kasih dalam bentuk lain, kami menerimanya dengan segala kerendahan hati.",
  TELEGRAM_BOT_TOKEN: "",
  TELEGRAM_CHAT_ID: "",
};

// Inisialisasi Data Default ke Turso Database secara Async
for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
  await db.execute({
    sql: "INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)",
    args: [key, value],
  });
}

// Fungsi Async untuk Membaca Konfigurasi dari Turso
export const getConfig = async (): Promise<Record<string, string>> => {
  const result = await db.execute("SELECT key, value FROM config");
  const configMap: Record<string, string> = {};
  for (const row of result.rows) {
    configMap[String(row.key)] = String(row.value);
  }
  return configMap;
};

// Fungsi Async untuk Mengubah/Menyimpan Konfigurasi ke Turso
export const setConfig = async (key: string, value: string): Promise<void> => {
  await db.execute({
    sql: "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)",
    args: [key, value],
  });
};

export default db;