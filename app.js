// ==========================================
// 1. INTERAKTIVITAS MENU HP (MOBILE MENU)
// ==========================================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (menuIcon) {
            menuIcon.className = mobileMenu.classList.contains('hidden') ? 'fa-solid fa-bars text-xl' : 'fa-solid fa-xmark text-xl';
        }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (menuIcon) menuIcon.className = 'fa-solid fa-bars text-xl';
        });
    });
}

// ==========================================
// 2. FORMULIR KONTAK INTEGRASI NETLIFY FORMS
// ==========================================
const contactForm = document.getElementById('contact-form');
const formAlert = document.getElementById('form-alert');

if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name').value;

        // Ubah tombol menjadi loading animasi
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Mengirim...`;

        // Bungkus data untuk Netlify
        const formData = new FormData(contactForm);

        // Kirim data form ke sistem internal Netlify (AJAX)
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        })
        .then(() => {
            // Berhasil terkirim ke dashboard Netlify Anda
            formAlert.className = "mt-4 p-4 rounded-lg text-sm bg-green-100 text-green-800 border border-green-200";
            formAlert.innerHTML = `<strong>Pesan Terkirim!</strong> Terima kasih ${name}, pesan Anda telah tersimpan dengan aman di sistem Netlify sekolah.`;
            formAlert.classList.remove('hidden');
            contactForm.reset();
        })
        .catch((error) => {
            console.error("Netlify Form Error:", error);
            formAlert.className = "mt-4 p-4 rounded-lg text-sm bg-red-100 text-red-800 border border-red-200";
            formAlert.innerHTML = `<strong>Gagal Mengirim!</strong> Koneksi terganggu, silakan coba lagi.`;
            formAlert.classList.remove('hidden');
        })
        .finally(() => {
            // Kembalikan tombol ke keadaan semula
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Kirim Pesan`;
            
            // Sembunyikan notifikasi setelah 5 detik
            setTimeout(() => {
                if (formAlert) formAlert.classList.add('hidden');
            }, 5000);
        });
    });
}

// ==========================================
// 3. STATISTIK INTERN SEKOLAH (DATA LOKAL)
// ==========================================
function loadLocalDashboard() {
    const totalSiswa = document.getElementById('totalSiswa');
    const totalGuru = document.getElementById('totalGuru');
    
    // Anda bisa mengubah angka statistik sekolah ini kapan saja di sini secara manual
    if (totalSiswa) totalSiswa.innerText = "156"; // Contoh jumlah siswa SDN 1 Sukarami
    if (totalGuru) totalGuru.innerText = "12";    // Contoh jumlah guru & staf
}

// ==========================================
// 4. GRAFIK AKTIVITAS (CHART.JS MURNI)
// ==========================================
function initSyncChart() {
    const canvas = document.getElementById('syncChart');
    const btn30Hari = document.getElementById('btn30Hari');
    const btn7Hari = document.getElementById('btn7Hari');
    if (!canvas || typeof Chart === "undefined") return;

    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    const chartData = {
        "30": {
            labels: ['07 Apr', '10 Apr', '13 Apr', '16 Apr', '19 Apr', '22 Apr', '25 Apr', '28 Apr', '01 Mei', '04 Mei', '07 Mei'],
            data: [6173, 6269, 5605, 6533, 1808, 7267, 2137, 11161, 6024, 31606, 28563]
        },
        "7": {
            labels: ['01 Mei', '02 Mei', '03 Mei', '04 Mei', '05 Mei', '06 Mei', '07 Mei'],
            data: [6024, 8450, 12430, 31606, 21900, 29840, 28563]
        }
    };

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData["30"].labels,
            datasets: [{
                label: 'Jumlah Sinkronisasi',
                data: chartData["30"].data,
                borderColor: '#10b981',
                borderWidth: 4,
                fill: true,
                backgroundColor: gradient,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#10b981',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } }
            }
        }
    });

    const activeClasses = ['bg-white', 'shadow-sm', 'rounded-lg', 'text-emerald-600'];
    const inactiveClasses = ['text-slate-400', 'hover:text-slate-600'];

    function setActiveButton(activeButton, inactiveButton) {
        activeButton.classList.add(...activeClasses);
        activeButton.classList.remove(...inactiveClasses);
        inactiveButton.classList.remove(...activeClasses);
        inactiveButton.classList.add(...inactiveClasses);
    }

    function updateChart(periodKey) {
        chart.data.labels = chartData[periodKey].labels;
        chart.data.datasets[0].data = chartData[periodKey].data;
        chart.update();
    }

    if (btn30Hari && btn7Hari) {
        btn30Hari.addEventListener('click', () => {
            setActiveButton(btn30Hari, btn7Hari);
            updateChart("30");
        });

        btn7Hari.addEventListener('click', () => {
            setActiveButton(btn7Hari, btn30Hari);
            updateChart("7");
        });
    }
}

// ==========================================
// 5. RANKING PROVINSI (DATA LOKAL)
// ==========================================
function initRankings() {
    const rankingList = document.getElementById('rankingList');
    if (!rankingList) return;

    // Data tiruan lokal yang langsung dicetak rapi tanpa Firebase
    const dataRankingsLokal = [
        { nama: "Lampung", skor: 98 },
        { nama: "Jawa Barat", skor: 92 },
        { nama: "Jawa Tengah", skor: 89 },
        { nama: "Sumatera Selatan", skor: 85 },
        { nama: "Banten", skor: 83 },
        { nama: "DKI Jakarta", skor: 81 },
        { nama: "Jawa Timur", skor: 79 },
        { nama: "DI Yogyakarta", skor: 78 },
        { nama: "Bali", skor: 74 },
        { nama: "Bengkulu", skor: 70 }
    ];

    rankingList.innerHTML = dataRankingsLokal.map((item, index) => `
        <div class="flex justify-between items-center border-b border-slate-50 pb-2">
            <span class="text-sm font-bold text-slate-700">${index + 1}. ${item.nama}</span>
            <span class="text-xs font-black text-emerald-600">${item.skor}%</span>
        </div>
    `).join('');
}

// ==========================================
// INTI JALANNYA PROGRAM (APLIKASI START)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portal SDN 1 SUKARAMI Online (Mode Data Lokal - Bebas Firebase)");
    loadLocalDashboard();
    initSyncChart();
    initRankings();
});
