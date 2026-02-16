// Toggle sidebar (mobile)
const sidebar = document.getElementById('sidebar');
const btnHamburger = document.getElementById('btnHamburger');

btnHamburger?.addEventListener('click', () => {
  sidebar.classList.toggle('is-hidden');
});

// Accordion sections
document.querySelectorAll('[data-acc]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-acc');
    const body = document.getElementById(id);
    if (!body) return;
    body.classList.toggle('is-open');
  });
});


// --

// Date input: klik icon => ubah ke type date sementara (biar ada picker)
document.querySelectorAll('[data-date-open]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-date-open');
    const inp = document.getElementById(id);
    if (!inp) return;

    // switch to date input, open picker (browser support)
    inp.type = 'date';
    inp.focus();
    inp.showPicker?.();

    inp.addEventListener('blur', () => {
      // balik ke text kalau kosong supaya placeholder dd/mm/yyyy tampil
      if (!inp.value) inp.type = 'text';
    }, { once:true });
  });
});

// Print buttons
document.querySelectorAll('[data-print]').forEach((btn) => {
  btn.addEventListener('click', () => window.print());
});

// --

// Dropdown role
const roleBtn = document.getElementById('roleBtn');
const roleMenu = document.getElementById('roleMenu');

function openMenu(){
  roleMenu.style.display = 'block';
  roleMenu.setAttribute('aria-hidden', 'false');
}
function closeMenu(){
  roleMenu.style.display = 'none';
  roleMenu.setAttribute('aria-hidden', 'true');
}

roleBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  (roleMenu.style.display === 'block') ? closeMenu() : openMenu();
});
document.addEventListener('click', () => closeMenu());
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenu(); });

// Search filter
const q = document.getElementById('q');
const tbody = document.getElementById('deptRows');
q?.addEventListener('input', () => {
  const term = q.value.trim().toLowerCase();
  [...tbody.querySelectorAll('tr')].forEach(tr => {
    tr.style.display = tr.innerText.toLowerCase().includes(term) ? '' : 'none';
  });
});

// Add row (UI mock)
document.getElementById('saveBtn')?.addEventListener('click', () => {
  const nama = document.getElementById('nama').value.trim();
  const desc = document.getElementById('desc').value.trim();
  if(!nama) return;

  const idx = tbody.querySelectorAll('tr').length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="tc">${idx}</td>
    <td class="tc link"><a href="#">${esc(nama)}</a></td>
    <td class="tc link"><a href="#">${esc(desc || '-')}</a></td>
    <td class="tc">
      <div class="aksi">
        <button class="act actBlue" type="button" aria-label="Edit">
          <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.95l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.4l-1.35-1.35a1 1 0 0 0-1.4 0l-1.1 1.1 3.75 3.75 1.1-1.1Z"/></svg>
        </button>
        <button class="act actRed" type="button" aria-label="Hapus">
          <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Z"/></svg>
        </button>
      </div>
    </td>
  `;
  tbody.appendChild(tr);

  document.getElementById('nama').value = '';
  document.getElementById('desc').value = '';
});

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}


// ---

// ===== Mini calendar render (default: Januari 2026, select day 5) =====
const miniDays = document.getElementById('bmcalMiniDays');
const monthLabel = document.getElementById('bmcalMonthLabel');

let state = { y: 2026, m: 0 }; // 0 = Januari

const bulanID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

function renderMini(){
  if(!miniDays) return;
  miniDays.innerHTML = '';

  const y = state.y;
  const m = state.m;
  monthLabel.textContent = `${bulanID[m]} ${y}`;

  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const startDow = first.getDay(); // 0=Sun
  const daysInMonth = last.getDate();

  let day = 1;
  for(let r=0; r<6; r++){
    const tr = document.createElement('tr');

    for(let c=0; c<7; c++){
      const td = document.createElement('td');
      const idx = r*7 + c;

      if(idx < startDow || day > daysInMonth){
        td.innerHTML = '&nbsp;';
      }else{
        td.textContent = String(day);

        if(c === 0 || c === 6) td.classList.add('bmcalWknd');
        if(y === 2026 && m === 0 && day === 5) td.classList.add('bmcalSel');

        day++;
      }
      tr.appendChild(td);
    }
    miniDays.appendChild(tr);
  }
}

document.getElementById('bmcalPrev')?.addEventListener('click', () => {
  state.m--;
  if(state.m < 0){ state.m = 11; state.y--; }
  renderMini();
});
document.getElementById('bmcalNext')?.addEventListener('click', () => {
  state.m++;
  if(state.m > 11){ state.m = 0; state.y++; }
  renderMini();
});

renderMini();

// --

// Klik tombol -> arahkan ke halaman sesuai data-go
document.querySelectorAll('.roleBtn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-go');
    if (!target) return;
    window.location.href = target;
  });
});

// STAFF

// biar sama persis screenshot: time & date fixed (DEMO)
const DEMO = true;

const demoDate = new Date('2025-12-12T07:59:00');
const demoMasuk = '07:58 AM';
const demoKeluar = 'Belum Absen';

const elTime = document.getElementById('bigTime');
const elDate = document.getElementById('bigDate');
const elMasuk = document.getElementById('absenMasuk');
const elKeluar = document.getElementById('absenKeluar');

const hariMap = {
  Sunday: 'Minggu',
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: "Jum’at",
  Saturday: 'Sabtu',
};

function pad2(n){ return String(n).padStart(2,'0'); }

function formatTime12(d){
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return `${pad2(h)}:${pad2(m)} ${ampm}`;
}

function formatDateID(d){
  const engDay = d.toLocaleDateString('en-US', { weekday:'long' });
  const hari = hariMap[engDay] || engDay;
  return `${hari}, ${pad2(d.getDate())}-${pad2(d.getMonth()+1)}-${d.getFullYear()}`;
}

function render(d){
  elTime.textContent = formatTime12(d);
  elDate.textContent = formatDateID(d);

  elMasuk.textContent = DEMO ? demoMasuk : '—';
  elKeluar.textContent = DEMO ? demoKeluar : '—';
}

if (DEMO){
  render(demoDate);
} else {
  const tick = () => render(new Date());
  tick();
  setInterval(tick, 1000);
}

// demo klik menu
document.querySelectorAll('[data-nav]').forEach(el=>{
  el.addEventListener('click',(e)=>{
    e.preventDefault();
    // ganti jadi location.href = '...'
    // location.href = `${el.dataset.nav}.html`;
  });
});


// -----

// dropdown role
const roleBtn = document.getElementById('roleBtn');
const roleMenu = document.getElementById('roleMenu');

roleBtn?.addEventListener('click', () => {
  const open = roleMenu.style.display === 'block';
  roleMenu.style.display = open ? 'none' : 'block';
  roleMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
});

document.addEventListener('click', (e) => {
  if (!roleMenu || !roleBtn) return;
  if (roleMenu.contains(e.target) || roleBtn.contains(e.target)) return;
  roleMenu.style.display = 'none';
  roleMenu.setAttribute('aria-hidden', 'true');
});

// back button
document.getElementById('btnBack')?.addEventListener('click', () => history.back());

// hamburger (opsional)
document.getElementById('hamburger')?.addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  const isHidden = getComputedStyle(sb).display === 'none';
  sb.style.display = isHidden ? 'block' : 'none';
});


// ===

// dropdown role
const roleBtn = document.getElementById('roleBtn');
const roleMenu = document.getElementById('roleMenu');

roleBtn?.addEventListener('click', () => {
  const open = roleMenu.style.display === 'block';
  roleMenu.style.display = open ? 'none' : 'block';
  roleMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
});

document.addEventListener('click', (e) => {
  if (!roleMenu || !roleBtn) return;
  if (roleMenu.contains(e.target) || roleBtn.contains(e.target)) return;
  roleMenu.style.display = 'none';
  roleMenu.setAttribute('aria-hidden', 'true');
});

// hamburger (optional)
document.getElementById('hamburger')?.addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  const isHidden = getComputedStyle(sb).display === 'none';
  sb.style.display = isHidden ? 'block' : 'none';
});


// ----

const roleBtn = document.getElementById('roleBtn');
const roleMenu = document.getElementById('roleMenu');

roleBtn?.addEventListener('click', () => {
  const open = roleMenu.style.display === 'block';
  roleMenu.style.display = open ? 'none' : 'block';
  roleMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
});

document.addEventListener('click', (e) => {
  if (!roleMenu || !roleBtn) return;
  if (roleMenu.contains(e.target) || roleBtn.contains(e.target)) return;
  roleMenu.style.display = 'none';
  roleMenu.setAttribute('aria-hidden', 'true');
});


// ====

