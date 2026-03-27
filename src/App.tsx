/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Hammer, 
  Menu, 
  X, 
  ShieldCheck, 
  Calculator, 
  Home, 
  PencilRuler, 
  Building, 
  Umbrella, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRICES = { 
  rumah_standar: 4200000, 
  rumah_menengah: 6000000, 
  rumah_mewah: 9600000, 
  renovasi_ringan: 3400000, 
  renovasi_berat: 5400000, 
  ruko: 5000000 
};

const LABELS = { 
  rumah_standar: 'Rumah Standar', 
  rumah_menengah: 'Rumah Menengah', 
  rumah_mewah: 'Rumah Mewah', 
  renovasi_ringan: 'Renovasi Ringan', 
  renovasi_berat: 'Renovasi Berat', 
  ruko: 'Ruko / Komersial' 
};

const LOC_MULTI = { 
  jabodetabek: 1.0, 
  jawa: 0.9, 
  sumatera: 1.05, 
  kalimantan: 1.15, 
  sulawesi: 1.1, 
  bali_ntt: 1.08 
};

const FLOOR_MULTI = { 
  1: 1.0, 
  2: 1.15, 
  3: 1.25 
};

const INFLATION = 1.05;

const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(Math.round(n));

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [calcType, setCalcType] = useState('rumah_standar');
  const [calcArea, setCalcArea] = useState(100);
  const [calcFloors, setCalcFloors] = useState(1);
  const [calcLocation, setCalcLocation] = useState('jabodetabek');
  const [opts, setOpts] = useState({ canopy: false, fence: false, sumur: false, taman: false });
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const toggleOpt = (o: keyof typeof opts) => {
    setOpts(prev => ({ ...prev, [o]: !prev[o] }));
  };

  const calculateCost = () => {
    const base = PRICES[calcType as keyof typeof PRICES] * INFLATION * LOC_MULTI[calcLocation as keyof typeof LOC_MULTI];
    const totalArea = calcArea * calcFloors;
    const structCost = base * totalArea * FLOOR_MULTI[calcFloors as keyof typeof FLOOR_MULTI];
    
    let extras = 0;
    if (opts.canopy) extras += 15000000;
    if (opts.fence) extras += 20000000;
    if (opts.sumur) extras += 12000000;
    if (opts.taman) extras += 18000000;
    
    const total = structCost + extras;

    setResultData({
      type: LABELS[calcType as keyof typeof LABELS],
      area: totalArea,
      floors: calcFloors,
      perM2: base * FLOOR_MULTI[calcFloors as keyof typeof FLOOR_MULTI],
      structCost,
      extras,
      total,
      low: total * 0.85,
      high: total * 1.15
    });
    setShowResult(true);
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const project = formData.get('project');
    const message = formData.get('message');

    const waNum = '628988934644';
    const text = encodeURIComponent(`Halo Ardhi Construction,\n\nNama: ${name}\nHP: ${phone}\nProyek: ${project}\n${message ? 'Pesan: ' + message : ''}\n\nMohon informasi lebih lanjut. Terima kasih!`);
    window.open(`https://wa.me/${waNum}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <header className="fixed top-0 left-0 w-full z-50 bg-navy/95 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded gradient-gold flex items-center justify-center">
              <Hammer className="w-5 h-5 text-navy" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Ardhi Construction</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#layanan" className="text-white/70 hover:text-gold text-sm font-medium transition">Layanan</a>
            <a href="#kalkulator" className="text-white/70 hover:text-gold text-sm font-medium transition">Kalkulator</a>
            <a href="#proses" className="text-white/70 hover:text-gold text-sm font-medium transition">Proses</a>
            <a href="#kontak" className="text-white/70 hover:text-gold text-sm font-medium transition">Kontak</a>
            <a href="#kontak" className="bg-gold hover:bg-yellow-600 text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition">Konsultasi Gratis</a>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-navy border-t border-white/10 px-4 pb-4 overflow-hidden"
            >
              <a href="#layanan" onClick={() => setIsMenuOpen(false)} className="block py-3 text-white/80 hover:text-gold text-sm border-b border-white/5">Layanan</a>
              <a href="#kalkulator" onClick={() => setIsMenuOpen(false)} className="block py-3 text-white/80 hover:text-gold text-sm border-b border-white/5">Kalkulator</a>
              <a href="#proses" onClick={() => setIsMenuOpen(false)} className="block py-3 text-white/80 hover:text-gold text-sm border-b border-white/5">Proses</a>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="block py-3 text-white/80 hover:text-gold text-sm">Kontak</a>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="mt-3 block text-center bg-gold text-navy font-semibold text-sm px-5 py-2.5 rounded-lg">Konsultasi Gratis</a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* HERO */}
        <section id="hero" className="hero-bg pt-32 sm:pt-40 pb-20 sm:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M30 0L60 30L30 60L0 30Z%22 fill=%22none%22 stroke=%22%23d4a843%22 stroke-width=%220.5%22/%3E%3C/svg%3E')", backgroundSize: '60px 60px' }}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6"
              >
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs font-semibold tracking-wide uppercase">Terpercaya Sejak 1991</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6"
              >
                Bangun Rumah Impian<br />
                dengan Biaya Transparan
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/60 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed"
              >
                Jasa konstruksi profesional untuk rumah, renovasi, dan bangunan komersial. Hitung estimasi biaya langsung di sini.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <a href="#kalkulator" className="bg-gold hover:bg-yellow-600 text-navy font-bold px-8 py-3.5 rounded-lg transition flex items-center gap-2">
                  <Calculator className="w-5 h-5" /> Hitung Biaya
                </a>
                <a href="#kontak" className="border-2 border-white/30 hover:border-gold text-white hover:text-gold font-semibold px-8 py-3.5 rounded-lg transition">Hubungi Kami</a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex flex-wrap gap-8"
              >
                <div>
                  <span className="text-3xl font-bold text-gold">500+</span>
                  <p className="text-white/50 text-sm mt-1">Proyek Selesai</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-gold">35+</span>
                  <p className="text-white/50 text-sm mt-1">Tahun Pengalaman</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-gold">98%</span>
                  <p className="text-white/50 text-sm mt-1">Klien Puas</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* LAYANAN */}
        <section id="layanan" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">Layanan Kami</span>
              <h2 className="font-display text-3xl sm:text-4xl mt-3 text-navy">Solusi Konstruksi Lengkap</h2>
              <div className="h-1 w-20 bg-gold mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Home, title: 'Rumah Tinggal', desc: 'Pembangunan rumah baru dari standar hingga mewah dengan material berkualitas dan desain modern.', price: 'Mulai Rp 4,2jt/m²' },
                { icon: PencilRuler, title: 'Renovasi', desc: 'Perbaikan ringan hingga berat, termasuk perluasan ruangan dan modernisasi bangunan lama.', price: 'Mulai Rp 3,4jt/m²' },
                { icon: Building, title: 'Ruko & Komersial', desc: 'Bangunan komersial, ruko, gudang, dan fasilitas bisnis dengan struktur kuat dan fungsional.', price: 'Mulai Rp 5jt/m²' },
                { icon: Umbrella, title: 'Pagar & Canopy', desc: 'Pemasangan pagar, canopy, carport, dan eksterior pelengkap rumah Anda.', price: 'Harga Proyek' },
                { icon: FileText, title: 'Desain & RAB', desc: 'Konsultasi desain arsitektur dan pembuatan Rencana Anggaran Biaya yang detail dan transparan.', price: 'Konsultasi Gratis' },
                { icon: ShieldCheck, title: 'Garansi Struktur', desc: 'Jaminan kualitas struktur bangunan dengan garansi resmi dan maintenance berkala.', price: 'Garansi 2 Tahun' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-cream rounded-2xl p-8 border border-gray-100 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mb-5">
                    <item.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  <p className="mt-4 text-gold font-semibold text-sm">{item.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* KALKULATOR */}
        <section id="kalkulator" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">Estimasi Biaya</span>
              <h2 className="font-display text-3xl sm:text-4xl mt-3 text-navy">Kalkulator Biaya Bangun</h2>
              <div className="h-1 w-20 bg-gold mx-auto mt-4 rounded-full"></div>
              <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm">Hitung perkiraan biaya konstruksi berdasarkan tipe, luas, lokasi, dan tambahan fasilitas.</p>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-10">
                <label className="block text-sm font-semibold text-navy mb-2">Tipe Bangunan</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                  {Object.entries(LABELS).map(([key, label]) => (
                    <button 
                      key={key}
                      onClick={() => setCalcType(key)}
                      className={`text-xs sm:text-sm font-medium py-3 px-3 rounded-xl border-2 transition ${calcType === key ? 'bg-navy text-gold border-navy' : 'border-gray-200 text-gray-600 hover:border-gold'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-semibold text-navy mb-2">Luas Bangunan: <span className="text-gold">{calcArea}</span> m²</label>
                <input 
                  type="range" 
                  min="36" 
                  max="500" 
                  value={calcArea} 
                  onChange={(e) => setCalcArea(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold mb-8" 
                />

                <label className="block text-sm font-semibold text-navy mb-2">Jumlah Lantai</label>
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map(f => (
                    <button 
                      key={f}
                      onClick={() => setCalcFloors(f)}
                      className={`font-semibold py-2.5 px-6 rounded-xl border-2 transition text-sm ${calcFloors === f ? 'bg-navy text-gold border-navy' : 'border-gray-200 text-gray-600 hover:border-gold'}`}
                    >
                      {f} Lantai
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-semibold text-navy mb-2">Lokasi Proyek</label>
                <select 
                  value={calcLocation}
                  onChange={(e) => setCalcLocation(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm mb-8 focus:border-gold focus:outline-none transition"
                >
                  <option value="jabodetabek">Jabodetabek</option>
                  <option value="jawa">Jawa (Non-Jakarta)</option>
                  <option value="sumatera">Sumatera</option>
                  <option value="kalimantan">Kalimantan</option>
                  <option value="sulawesi">Sulawesi</option>
                  <option value="bali_ntt">Bali & NTT</option>
                </select>

                <label className="block text-sm font-semibold text-navy mb-2">Tambahan Fasilitas</label>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {[
                    { id: 'canopy', label: '🅿️ Canopy / Carport' },
                    { id: 'fence', label: '🧱 Pagar' },
                    { id: 'sumur', label: '💧 Sumur Bor' },
                    { id: 'taman', label: '🌿 Taman / Landscape' },
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => toggleOpt(opt.id as keyof typeof opts)}
                      className={`border-2 rounded-xl py-3 px-4 text-sm font-medium text-left transition ${opts[opt.id as keyof typeof opts] ? 'bg-navy text-gold border-navy' : 'border-gray-200 text-gray-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={calculateCost}
                  className="w-full gradient-gold text-navy font-bold py-4 rounded-xl text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" /> Hitung Estimasi Biaya
                </button>
              </div>

              <AnimatePresence>
                {showResult && resultData && (
                  <motion.div 
                    ref={resultRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-navy p-6 sm:p-10"
                  >
                    <h3 className="text-gold font-display text-2xl mb-6">Estimasi Biaya</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-white/70">
                        <span>Tipe</span><span className="text-white font-medium">{resultData.type}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Total Luas</span><span className="text-white font-medium">{resultData.area} m²</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Jumlah Lantai</span><span className="text-white font-medium">{resultData.floors} Lantai</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Harga per m²</span><span className="text-white font-medium">Rp {fmt(resultData.perM2)}/m²</span>
                      </div>
                      <div className="border-t border-white/10 my-3"></div>
                      <div className="flex justify-between text-white/70">
                        <span>Biaya Struktur</span><span className="text-white font-medium">Rp {fmt(resultData.structCost)}</span>
                      </div>
                      {resultData.extras > 0 && (
                        <div className="flex justify-between text-white/70">
                          <span>Tambahan Fasilitas</span><span className="text-white font-medium">Rp {fmt(resultData.extras)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 my-3"></div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gold font-bold">Total Estimasi</span><span className="text-gold font-bold">Rp {fmt(resultData.total)}</span>
                      </div>
                    </div>
                    <div className="mt-6 bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-white/50 text-xs mb-1">Rentang Estimasi</p>
                      <p className="text-white font-semibold text-sm">Rp {fmt(resultData.low)} — Rp {fmt(resultData.high)}</p>
                    </div>
                    <p className="text-white/40 text-xs mt-4 text-center">* Estimasi berdasarkan harga pasar 2025. Harga aktual dapat berbeda tergantung spesifikasi material dan kondisi lapangan.</p>
                    <a href="#kontak" className="mt-6 block text-center bg-gold hover:bg-yellow-600 text-navy font-bold py-3 rounded-xl transition">Konsultasi Detail →</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* PROSES */}
        <section id="proses" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">Cara Kerja</span>
              <h2 className="font-display text-3xl sm:text-4xl mt-3 text-navy">Proses Kerja Kami</h2>
              <div className="h-1 w-20 bg-gold mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Konsultasi', desc: 'Diskusi kebutuhan, survei lokasi, dan perencanaan awal proyek Anda.' },
                { step: '02', title: 'Desain & RAB', desc: 'Pembuatan desain arsitektur dan rincian anggaran biaya transparan.' },
                { step: '03', title: 'Pembangunan', desc: 'Pelaksanaan konstruksi dengan tim profesional dan laporan berkala.' },
                { step: '04', title: 'Serah Terima', desc: 'Pengecekan kualitas, serah terima kunci, dan garansi struktur.' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-gold font-display text-2xl">{item.step}</span>
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KONTAK */}
        <section id="kontak" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">Hubungi Kami</span>
              <h2 className="font-display text-3xl sm:text-4xl mt-3 text-navy">Konsultasi Gratis</h2>
              <div className="h-1 w-20 bg-gold mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6">Kirim Pesan via WhatsApp</h3>
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                    <input type="text" name="name" required className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-gold focus:outline-none transition" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nomor HP / WhatsApp *</label>
                    <input type="tel" name="phone" required className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-gold focus:outline-none transition" placeholder="08xxxxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipe Proyek</label>
                    <select name="project" className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-gold focus:outline-none transition">
                      <option>Bangun Rumah Baru</option>
                      <option>Renovasi</option>
                      <option>Ruko / Komersial</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pesan (Opsional)</label>
                    <textarea name="message" rows={3} className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-gold focus:outline-none transition resize-none" placeholder="Ceritakan kebutuhan proyek Anda..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                    <Phone className="w-5 h-5" /> Kirim via WhatsApp
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-6">Informasi Kontak</h3>
                  <div className="space-y-5">
                    {[
                      { icon: Phone, label: 'Telepon / WhatsApp', value: '0898-8934-644 / 0823-3491-0530' },
                      { icon: Mail, label: 'Email', value: 'rizky042103@gmail.com' },
                      { icon: MapPin, label: 'Alamat Kantor', value: 'Jln H.J. Paten RT 01 RW 10, Pondok Karya, Pondok Aren, Tangerang Selatan' },
                      { icon: Clock, label: 'Jam Operasional', value: 'Senin - Sabtu, 08:00 - 17:00' },
                      { icon: Users, label: 'Area Layanan', value: 'Jabodetabek, Jawa, Sumatera, Kalimantan, Sulawesi, Bali & NTT' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-gray-500 text-sm">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-navy rounded-2xl p-8 text-center">
                  <Calculator className="w-10 h-10 text-gold mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">Sudah Hitung Estimasi?</h3>
                  <p className="text-white/60 text-sm mb-4">Gunakan kalkulator kami untuk mendapat gambaran biaya sebelum konsultasi.</p>
                  <a href="#kalkulator" className="inline-block bg-gold hover:bg-yellow-600 text-navy font-bold px-6 py-2.5 rounded-xl text-sm transition">Buka Kalkulator</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-navy py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded gradient-gold flex items-center justify-center">
              <Hammer className="w-4 h-4 text-navy" />
            </div>
            <span className="text-white font-bold">Ardhi Construction</span>
          </div>
          <p className="text-white/40 text-sm">© 2025 Ardhi Construction. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
