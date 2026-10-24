// =========================================================================
// ANYTHINGDOWN MULTI-UNIVERSE THEME & CANVAS ENGINE
// Shared across Home, Terms, Privacy, and License pages
// =========================================================================

let currentTheme = localStorage.getItem("anythingdown_theme") || "retro";

class SoundFX {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }
      init() {
        try {
          if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
          }
        } catch(e) {}
      }
      playTone(freq = 600, type = 'square', duration = 0.08, vol = 0.1) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(vol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
      }
      playTurn() {
        if (currentTheme === 'retro') {
          this.playTone(300, 'sawtooth', 0.12, 0.15);
          setTimeout(() => this.playTone(700, 'sawtooth', 0.1, 0.1), 60);
        } else if (currentTheme === 'cyber') {
          this.playTone(1800, 'triangle', 0.05, 0.15);
          setTimeout(() => this.playTone(900, 'sawtooth', 0.06, 0.15), 50);
        } else if (currentTheme === 'cs') {
          // Tactical radio click
          this.playTone(1200, 'square', 0.04, 0.12);
          setTimeout(() => this.playTone(800, 'sine', 0.04, 0.08), 40);
        } else {
          // Top Gear 16-bit arcade tire screech / shift
          this.playTone(220, 'sawtooth', 0.15, 0.15);
          setTimeout(() => this.playTone(440, 'square', 0.1, 0.12), 70);
        }
      }
      playNitro() {
        // Top Gear Nitro Blast Sound
        this.playTone(150, 'sawtooth', 0.35, 0.25);
        setTimeout(() => this.playTone(850, 'sine', 0.25, 0.2), 50);
        setTimeout(() => this.playTone(1200, 'triangle', 0.4, 0.2), 120);
      }
      playGunshot() {
        // Counter-Strike AK-47 / M4A1 fire sound
        this.playTone(140, 'sawtooth', 0.12, 0.35);
        setTimeout(() => this.playTone(80, 'square', 0.15, 0.25), 20);
        setTimeout(() => this.playTone(600, 'sine', 0.05, 0.1), 40);
      }
      playC4Beep() {
        // Counter-Strike iconic C4 Armed Beep
        this.playTone(2600, 'sine', 0.08, 0.25);
      }
      playHeadshot() {
        // CS Headshot Ding / Helmet hit
        this.playTone(1850, 'triangle', 0.15, 0.3);
        setTimeout(() => this.playTone(2400, 'sine', 0.12, 0.2), 50);
      }
      playNoirWeb() {
        // High tension web zip / thwip
        this.playTone(1400, 'sine', 0.08, 0.2);
        setTimeout(() => this.playTone(2800, 'triangle', 0.06, 0.15), 30);
      }
      playNoirCamera() {
        // 1930s detective camera shutter / flashbulb click
        this.playTone(400, 'sawtooth', 0.05, 0.25);
        setTimeout(() => this.playTone(180, 'square', 0.08, 0.3), 40);
        setTimeout(() => this.playTone(2200, 'sine', 0.15, 0.1), 80);
      }
      playGTASiren() {
        this.playTone(600, sine, 0.18, 0.25);
        setTimeout(() => this.playTone(950, sine, 0.22, 0.25), 100);
        setTimeout(() => this.playTone(720, sine, 0.18, 0.2), 220);
      }
      playGTACash() {
        this.playTone(987.77, sine, 0.1, 0.18);
        setTimeout(() => this.playTone(1318.51, sine, 0.25, 0.22), 80);
      }
      playDoh() {
        // Homer's classic comic "D'OH!" frequency pitch bend
        if (!this.ctx || !this.enabled) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(360, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } catch(e) {}
      }
      playSimpsonsOpening() {
        // "The Simp-sons!" 4-note motif (C - E - F# - A)
        this.playTone(523.25, 'triangle', 0.16, 0.22); // C5
        setTimeout(() => this.playTone(659.25, 'triangle', 0.16, 0.22), 170); // E5
        setTimeout(() => this.playTone(739.99, 'triangle', 0.18, 0.22), 340); // F#5
        setTimeout(() => this.playTone(880.00, 'triangle', 0.35, 0.26), 510); // A5
      }
      playPacmanWaka() {
        // Iconic 1980 arcade "Waka-Waka" dual-tone chirp
        this.playTone(493.88, 'triangle', 0.07, 0.18); // B4
        setTimeout(() => this.playTone(261.63, 'sawtooth', 0.08, 0.16), 65); // C4
      }
      playPacmanFruit() {
        // Arcade bonus fruit capture / cherry ding
        this.playTone(1046.50, 'square', 0.09, 0.2);
        setTimeout(() => this.playTone(1318.51, 'square', 0.09, 0.2), 80);
        setTimeout(() => this.playTone(1567.98, 'square', 0.16, 0.25), 160);
      }
      playPacmanGhostEat() {
        // Ghost eaten sound (rapid ascending sequence)
        this.playTone(300, 'square', 0.06, 0.22);
        setTimeout(() => this.playTone(600, 'square', 0.06, 0.22), 50);
        setTimeout(() => this.playTone(900, 'square', 0.08, 0.25), 100);
        setTimeout(() => this.playTone(1200, 'square', 0.12, 0.25), 150);
      }
      playSuccess() {
        if (currentTheme === 'cs') {
          // "Counter-Terrorists Win / Bomb Defused" Fanfare
          this.playTone(440, 'square', 0.12, 0.2);
          setTimeout(() => this.playTone(554.37, 'square', 0.12, 0.2), 120);
          setTimeout(() => this.playTone(659.25, 'square', 0.15, 0.2), 240);
          setTimeout(() => this.playTone(880, 'square', 0.35, 0.25), 360);
        } else if (currentTheme === 'topgear') {
          // Top Gear 1st place victory chime
          this.playTone(523.25, 'square', 0.1, 0.15);
          setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.15), 90);
          setTimeout(() => this.playTone(783.99, 'square', 0.12, 0.15), 180);
          setTimeout(() => this.playTone(1046.50, 'square', 0.3, 0.2), 270);
        } else {
          this.playTone(523.25, 'sine', 0.1, 0.12);
          setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.12), 80);
          setTimeout(() => this.playTone(783.99, 'sine', 0.15, 0.15), 160);
          setTimeout(() => this.playTone(1046.50, 'sine', 0.25, 0.15), 240);
        }
      }
      playError() {
        if (currentTheme === 'cs') {
          // "Fire in the hole / Flashbang" or radio static
          this.playTone(120, 'sawtooth', 0.3, 0.25);
          setTimeout(() => this.playTone(90, 'sawtooth', 0.2, 0.2), 80);
        } else {
          this.playTone(180, 'sawtooth', 0.25, 0.2);
          setTimeout(() => this.playTone(120, 'sawtooth', 0.3, 0.2), 120);
        }
      }
    }
    const sfx = new SoundFX();

    // =========================================================================
    // CANVAS WORLD: THEME 1 (TRON), THEME 2 (CYBERPUNK), THEME 3 (TOP GEAR '92)
    // =========================================================================
    const canvas = document.getElementById('worldCanvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNightCityBuildings();
    });

    // -------------------------------------------------------------------------
    // 1. TRON ENGINE: LIGHTCYCLES & GRID
    // -------------------------------------------------------------------------
    let tronGridOffset = 0;

    class Lightcycle {
      constructor(color, trailColor, isEnemy = false) {
        this.reset(isEnemy);
        this.color = color;
        this.trailColor = trailColor;
        this.isEnemy = isEnemy;
      }
      reset(isEnemy = false) {
        this.horizonY = height * 0.52;
        this.z = Math.random() * 0.8 + 0.15;
        this.x = isEnemy ? width * 0.85 : width * 0.15;
        this.y = this.horizonY + this.z * (height - this.horizonY);
        this.speedX = isEnemy ? -3.5 : 4.0;
        this.history = [];
        this.maxTrail = 70;
        this.heading = isEnemy ? 'left' : 'right';
        this.turnTimer = Math.floor(Math.random() * 120) + 90;
      }
      update() {
        this.history.push({ x: this.x, y: this.y, z: this.z });
        if (this.history.length > this.maxTrail) this.history.shift();

        this.turnTimer--;
        if (this.turnTimer <= 0) {
          this.turnTimer = Math.floor(Math.random() * 150) + 100;
          if (this.heading === 'left' || this.heading === 'right') {
            this.heading = Math.random() > 0.5 ? 'forward' : 'backward';
          } else {
            this.heading = Math.random() > 0.5 ? 'left' : 'right';
          }
        }

        const zFactor = 0.4 + this.z * 1.8;
        if (this.heading === 'right') this.x += 4.5 * zFactor;
        else if (this.heading === 'left') this.x -= 4.5 * zFactor;
        else if (this.heading === 'forward') this.z += 0.005;
        else if (this.heading === 'backward') this.z -= 0.004;

        if (this.z < 0.08) { this.z = 0.08; this.heading = 'right'; }
        if (this.z > 0.95) { this.z = 0.95; this.heading = 'left'; }
        this.y = this.horizonY + this.z * (height - this.horizonY);

        if (this.x < -100 || this.x > width + 100) this.reset(this.isEnemy);
      }
      draw() {
        if (this.history.length < 2) return;
        ctx.save();
        ctx.lineWidth = Math.max(2, this.z * 5);
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.trailColor;
        ctx.strokeStyle = this.trailColor;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.lineWidth = Math.max(1, this.z * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.stroke();

        const size = Math.max(8, this.z * 26);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        const dir = (this.heading === 'left') ? -1 : 1;
        ctx.ellipse(this.x, this.y, size * 0.9, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + (size * 0.5 * dir), this.y, size * 0.22, 0, Math.PI * 2);
        ctx.arc(this.x - (size * 0.5 * dir), this.y, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let recognizerX = width * 0.5;
    function drawRecognizer(horizonY) {
      recognizerX += 0.35;
      if (recognizerX > width + 150) recognizerX = -150;
      const rw = 120, rh = 65, rx = recognizerX, ry = horizonY - 80;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 102, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff6600';
      ctx.beginPath();
      ctx.rect(rx - rw/2, ry, rw, 16);
      ctx.rect(rx - rw/2, ry + 16, 22, rh);
      ctx.rect(rx + rw/2 - 22, ry + 16, 22, rh);
      ctx.stroke();
      ctx.restore();
    }

    const tronCycles = [
      new Lightcycle('#00f3ff', '#00d2ff', false),
      new Lightcycle('#ff6600', '#ff3300', true),
      new Lightcycle('#00f3ff', '#00ffff', false)
    ];

    // -------------------------------------------------------------------------
    // 2. CYBERPUNK 2077 ENGINE: NIGHT CITY SKYLINE, FLYING AVS & HOLOGRAMS
    // -------------------------------------------------------------------------
    let buildings = [];
    let holograms = [];
    let rainDrops = [];

    class FlyingAV {
      constructor() {
        this.reset();
      }
      reset() {
        this.dir = Math.random() > 0.5 ? 1 : -1;
        this.x = this.dir === 1 ? -120 : width + 120;
        this.y = Math.random() * (height * 0.45) + 30;
        this.speed = (Math.random() * 2 + 2.5) * this.dir;
        this.altitude = Math.random() * 0.6 + 0.4;
        this.length = 65 * this.altitude;
        this.height = 18 * this.altitude;
        this.isTrauma = Math.random() > 0.6;
      }
      update() {
        this.x += this.speed;
        if ((this.dir === 1 && this.x > width + 150) || (this.dir === -1 && this.x < -150)) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        const thrusterColor = this.isTrauma ? '#00f0ff' : '#ff003c';
        ctx.fillStyle = thrusterColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = thrusterColor;

        const exhaustDir = -Math.sign(this.speed);
        ctx.beginPath();
        ctx.moveTo(exhaustDir * this.length * 0.5, -this.height * 0.2);
        ctx.lineTo(exhaustDir * (this.length * 0.5 + 45), 0);
        ctx.lineTo(exhaustDir * this.length * 0.5, this.height * 0.2);
        ctx.fill();

        ctx.fillStyle = '#0a0d14';
        ctx.strokeStyle = this.isTrauma ? '#00f0ff' : '#fcee0a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (this.dir === 1) {
          ctx.moveTo(-this.length/2, this.height/2);
          ctx.lineTo(-this.length/2, -this.height/3);
          ctx.lineTo(0, -this.height/2);
          ctx.lineTo(this.length/2, 0);
          ctx.lineTo(this.length/3, this.height/2);
        } else {
          ctx.moveTo(this.length/2, this.height/2);
          ctx.lineTo(this.length/2, -this.height/3);
          ctx.lineTo(0, -this.height/2);
          ctx.lineTo(-this.length/2, 0);
          ctx.lineTo(-this.length/3, this.height/2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = this.isTrauma ? '#00f0ff' : '#fcee0a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const f = this.dir === 1 ? 1 : -1;
        ctx.ellipse(f * (this.length * 0.2), -this.height * 0.15, this.length * 0.18, this.height * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        if (Math.floor(Date.now() / 250) % 2 === 0) {
          ctx.fillStyle = '#ff003c';
          ctx.shadowColor = '#ff003c';
          ctx.beginPath();
          ctx.arc(0, -this.height/2 - 2, 2.5, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const cyberAVs = [new FlyingAV(), new FlyingAV(), new FlyingAV()];

    function initNightCityBuildings() {
      buildings = [];
      holograms = [];
      const count = Math.ceil(width / 75) + 4;
      let curX = -20;

      for (let i = 0; i < count; i++) {
        const bWidth = Math.random() * 55 + 50;
        const bHeight = Math.random() * (height * 0.55) + (height * 0.25);
        const hasSpire = Math.random() > 0.6;
        const colorLayer = Math.random() > 0.5 ? '#060810' : '#0b0e17';

        buildings.push({
          x: curX,
          y: height - bHeight,
          w: bWidth,
          h: bHeight,
          hasSpire,
          color: colorLayer,
          windows: generateWindows(bWidth, bHeight)
        });

        if (Math.random() > 0.45) {
          const ads = ['ARASAKA', 'KIROSHI', 'TRAUMA TEAM', 'SAMURAI', 'KANG TAO', 'MILITECH', 'NIGHT CITY'];
          const colors = ['#ff003c', '#00f0ff', '#fcee0a', '#05ffa1', '#ff007f'];
          holograms.push({
            x: curX + 6,
            y: height - bHeight + 25 + Math.random() * 60,
            text: ads[Math.floor(Math.random() * ads.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            flicker: Math.random()
          });
        }
        curX += bWidth - 4;
      }

      rainDrops = [];
      for (let r = 0; r < 90; r++) {
        rainDrops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: Math.random() * 9 + 8,
          len: Math.random() * 18 + 12
        });
      }
    }

    function generateWindows(bw, bh) {
      const wins = [];
      const cols = Math.floor(bw / 10);
      const rows = Math.floor(bh / 16);
      for (let r = 2; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          if (Math.random() > 0.72) {
            wins.push({
              x: c * 10,
              y: r * 16,
              color: Math.random() > 0.4 ? '#fcee0a' : '#00f0ff'
            });
          }
        }
      }
      return wins;
    }

    initNightCityBuildings();

    // -------------------------------------------------------------------------
    // 3. TOP GEAR '92 ENGINE: SNES PSEUDO-3D SPEEDWAY, CARS & NITRO
    // -------------------------------------------------------------------------
    let roadProgress = 0;
    let roadCurveAngle = 0;
    let roadCurveTarget = 0;
    let roadCurveTimer = 0;
    let baseSpeed = 16;
    let nitroActive = false;
    let nitroTimer = 0;
    let nitroCount = 3;

    // Rivals on track
    const topGearRivals = [
      { xOffset: -0.45, z: 0.7, color: '#ffffff', name: 'SIDEWINDER' }, // White Porsche
      { xOffset: 0.5, z: 0.4, color: '#9900ff', name: 'WEASEL' }        // Purple Weasel
    ];

    function drawTopGearScene() {
      const horizonY = height * 0.48;

      // 1. SNES 16-Bit Sky Gradient (Sunset / Dusk Horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#000f2e');
      skyGrad.addColorStop(0.4, '#1b144e');
      skyGrad.addColorStop(0.75, '#872341');
      skyGrad.addColorStop(1, '#e95a32');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant 16-Bit Mountain silhouettes (Parallax Scrolling)
      roadCurveTimer++;
      if (roadCurveTimer > 180) {
        roadCurveTimer = 0;
        roadCurveTarget = (Math.random() - 0.5) * 1.6; // random curves
      }
      roadCurveAngle += (roadCurveTarget - roadCurveAngle) * 0.02;

      ctx.save();
      ctx.fillStyle = '#0a081a';
      ctx.beginPath();
      const mountainOffset = (roadCurveAngle * 80) % 200;
      ctx.moveTo(-100, horizonY);
      for (let mx = -100; mx <= width + 100; mx += 140) {
        const peakX = mx + 70 + mountainOffset;
        const peakY = horizonY - 45 - Math.sin(mx * 0.05) * 25;
        ctx.lineTo(peakX, peakY);
        ctx.lineTo(mx + 140 + mountainOffset, horizonY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. SNES Mode 7 Road Projection
      const currentSpeed = nitroActive ? 42 : baseSpeed;
      roadProgress = (roadProgress + currentSpeed) % 200;

      const numSegments = 120;
      const roadBottomWidth = width * 0.72;
      const roadTopWidth = 14;
      const roadCenterX = width * 0.5;

      for (let i = numSegments - 1; i >= 0; i--) {
        const p1 = Math.pow(i / numSegments, 2.4);
        const p2 = Math.pow((i + 1) / numSegments, 2.4);

        const y1 = horizonY + p1 * (height - horizonY);
        const y2 = horizonY + p2 * (height - horizonY);

        // Curve shift
        const curveOffset1 = Math.pow(p1, 2) * roadCurveAngle * (width * 0.35);
        const curveOffset2 = Math.pow(p2, 2) * roadCurveAngle * (width * 0.35);

        const w1 = roadTopWidth + p1 * (roadBottomWidth - roadTopWidth);
        const w2 = roadTopWidth + p2 * (roadBottomWidth - roadTopWidth);

        const x1 = roadCenterX + curveOffset1;
        const x2 = roadCenterX + curveOffset2;

        // Alternate stripe colors (Top Gear iconic dual asphalt)
        const stripe = Math.floor((i * 8 + roadProgress) / 20) % 2 === 0;
        const asphaltColor = stripe ? '#2b2e38' : '#3c404d';
        const grassColor = stripe ? '#1e7822' : '#145c18';
        const curbColor = stripe ? '#e60012' : '#ffffff';

        // Draw Grass
        ctx.fillStyle = grassColor;
        ctx.fillRect(0, y1, width, y2 - y1 + 1);

        // Draw Curbs (Zebras laterais)
        const curbWidth1 = w1 * 0.12;
        const curbWidth2 = w2 * 0.12;
        ctx.fillStyle = curbColor;
        // Left curb
        ctx.beginPath();
        ctx.moveTo(x1 - w1/2 - curbWidth1, y1);
        ctx.lineTo(x1 - w1/2, y1);
        ctx.lineTo(x2 - w2/2, y2);
        ctx.lineTo(x2 - w2/2 - curbWidth2, y2);
        ctx.fill();
        // Right curb
        ctx.beginPath();
        ctx.moveTo(x1 + w1/2, y1);
        ctx.lineTo(x1 + w1/2 + curbWidth1, y1);
        ctx.lineTo(x2 + w2/2 + curbWidth2, y2);
        ctx.lineTo(x2 + w2/2, y2);
        ctx.fill();

        // Draw Asphalt
        ctx.fillStyle = asphaltColor;
        ctx.beginPath();
        ctx.moveTo(x1 - w1/2, y1);
        ctx.lineTo(x1 + w1/2, y1);
        ctx.lineTo(x2 + w2/2, y2);
        ctx.lineTo(x2 - w2/2, y2);
        ctx.fill();

        // White Center Dash
        if (stripe) {
          const dashW1 = Math.max(2, w1 * 0.025);
          const dashW2 = Math.max(2, w2 * 0.025);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(x1 - dashW1/2, y1);
          ctx.lineTo(x1 + dashW1/2, y1);
          ctx.lineTo(x2 + dashW2/2, y2);
          ctx.lineTo(x2 - dashW2/2, y2);
          ctx.fill();
        }
      }

      // 3. Draw Rivals (Sidewinder, Weasel)
      for (const rival of topGearRivals) {
        rival.z += (Math.random() - 0.48) * 0.003;
        if (rival.z < 0.1) rival.z = 0.8;
        if (rival.z > 0.95) rival.z = 0.2;

        const rP = Math.pow(rival.z, 2.4);
        const rY = horizonY + rP * (height - horizonY);
        const rCurve = Math.pow(rP, 2) * roadCurveAngle * (width * 0.35);
        const rRoadW = roadTopWidth + rP * (roadBottomWidth - roadTopWidth);
        const rX = roadCenterX + rCurve + (rival.xOffset * rRoadW * 0.4);
        const rScale = Math.max(0.2, rP);

        drawPixelCar(rX, rY, rScale, rival.color, false);
      }

      // 4. Draw Player Car: The Legendary Red Cannibal!
      const playerY = height - 75;
      const playerX = roadCenterX + (roadCurveAngle * 60) + (Math.sin(Date.now() * 0.015) * 1.5);
      
      // Nitro effect timer
      if (nitroActive) {
        nitroTimer--;
        if (nitroTimer <= 0) nitroActive = false;
      }

      drawPixelCar(playerX, playerY, 1.15, '#e60012', nitroActive);

      // Speed lines during Nitro
      if (nitroActive) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        for (let s = 0; s < 18; s++) {
          const sx = Math.random() * width;
          const sy = horizonY + Math.random() * (height - horizonY);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - (roadCurveAngle * 40), sy + 35);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update speedometer readout
      const tgSpeedometer = document.getElementById('tgSpeedometer');
      if (tgSpeedometer) {
        const targetKm = nitroActive ? 320 : (270 + Math.floor(Math.sin(Date.now()*0.005)*8));
        tgSpeedometer.textContent = targetKm;
      }
    }

    // Top Gear 16-Bit Pixel Supercar Sprite Renderer
    function drawPixelCar(cx, cy, scale, bodyColor, isNitro) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Tire Ground Shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(0, 16, 52, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wide Low-Profile Racing Tires
      ctx.fillStyle = '#111111';
      ctx.fillRect(-48, 2, 14, 20); // Left rear tire
      ctx.fillRect(34, 2, 14, 20);  // Right rear tire

      // Lower Chassis & Rear Diffuser
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-38, 8, 76, 12);

      // Main Aerodynamic Sports Car Body
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(-42, 8);
      ctx.lineTo(-40, -4);
      ctx.lineTo(-24, -12);
      ctx.lineTo(24, -12);
      ctx.lineTo(40, -4);
      ctx.lineTo(42, 8);
      ctx.closePath();
      ctx.fill();

      // Top Gear High Rear Wing / Spoiler
      ctx.fillStyle = bodyColor;
      ctx.fillRect(-44, -16, 88, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(-44, -10, 88, 2);
      // Wing struts
      ctx.fillRect(-32, -10, 5, 8);
      ctx.fillRect(27, -10, 5, 8);

      // Rear Windshield (Dark Tinted Glass)
      ctx.fillStyle = '#0e1828';
      ctx.beginPath();
      ctx.moveTo(-20, -12);
      ctx.lineTo(-15, -24);
      ctx.lineTo(15, -24);
      ctx.lineTo(20, -12);
      ctx.closePath();
      ctx.fill();
      // Glass highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(-8, -22, 4, 8);

      // Rear Black Bumper Panel
      ctx.fillStyle = '#080808';
      ctx.fillRect(-34, -2, 68, 10);

      // Glowing Dual Tail Lights (Ferrari / Testarossa style)
      ctx.fillStyle = '#ff0033';
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 12;
      ctx.fillRect(-32, 0, 20, 5); // left lights
      ctx.fillRect(12, 0, 20, 5);  // right lights

      // Dual Exhaust Pipes & Nitro Fire Plumes!
      ctx.fillStyle = '#888888';
      ctx.fillRect(-16, 14, 6, 4);
      ctx.fillRect(10, 14, 6, 4);

      if (isNitro) {
        // Blazing Nitro Flames
        const flameLen = Math.random() * 25 + 30;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 20;

        // Cyan / Orange Nitro Core
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.moveTo(-16, 18);
        ctx.lineTo(-13, 18 + flameLen);
        ctx.lineTo(-10, 18);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(10, 18);
        ctx.lineTo(13, 18 + flameLen);
        ctx.lineTo(16, 18);
        ctx.fill();

        // Inner white hot flame
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-14, 18, 2, flameLen * 0.6);
        ctx.fillRect(12, 18, 2, flameLen * 0.6);
      } else {
        // Normal subtle exhaust glow
        ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
        ctx.fillRect(-15, 18, 4, 3);
        ctx.fillRect(11, 18, 4, 3);
      }

      ctx.restore();
    }

    // =========================================================================
    // 4. COUNTER-STRIKE (DE_DUST2 / TACTICAL FPS) ENGINE
    // =========================================================================
    let csDustParticles = [];
    let csSmokeClouds = [];
    let csBulletTracers = [];
    let csKillFeed = [];
    let csCrosshair = { x: width * 0.5, y: height * 0.45, recoil: 0 };
    let csC4Timer = 35;
    let csC4TimerSec = 35;
    let csLastTick = Date.now();
    let csGunRecoilOffset = 0;

    // Track mouse for tactical crosshair
    window.addEventListener('mousemove', (e) => {
      if (currentTheme === 'cs') {
        csCrosshair.x = e.clientX;
        csCrosshair.y = e.clientY;
      }
    });

    // Fire weapon on click in CS theme!
    window.addEventListener('click', (e) => {
      if (currentTheme === 'cs') {
        // Only if not clicking an interactive button/input
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && !e.target.closest('button')) {
          fireCSWeapon(e.clientX, e.clientY);
        }
      }
    });

    function initCSTheme() {
      csDustParticles = [];
      for (let i = 0; i < 70; i++) {
        csDustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 1,
          speedX: Math.random() * 0.8 + 0.2,
          speedY: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.4 + 0.1
        });
      }
      csKillFeed = [
        { killer: 'Player1', weapon: 'ak47', victim: 'Terrorist_01', hs: true, time: Date.now() + 1000 },
        { killer: 'CT_Alpha', weapon: 'm4a1', victim: 'Guerilla_7', hs: false, time: Date.now() + 3500 },
        { killer: 'AWP_God', weapon: 'awp', victim: 'Phoenix_Conn', hs: true, time: Date.now() + 6000 }
      ];
    }

    initCSTheme();

    function fireCSWeapon(targetX, targetY) {
      sfx.playGunshot();
      csCrosshair.recoil = 18;
      csGunRecoilOffset = 22;

      // Create yellow/orange bullet tracer
      const gunMuzzleX = width * 0.5 + 140;
      const gunMuzzleY = height - 70;
      csBulletTracers.push({
        startX: gunMuzzleX,
        startY: gunMuzzleY,
        endX: targetX || (width * 0.5 + (Math.random() - 0.5) * 40),
        endY: targetY || (height * 0.4 + (Math.random() - 0.5) * 40),
        alpha: 1.0,
        sparkTimer: 6
      });

      // Muzzle smoke puff
      csSmokeClouds.push({
        x: gunMuzzleX + (Math.random() - 0.5) * 10,
        y: gunMuzzleY - 15,
        radius: 12,
        maxRadius: 45,
        alpha: 0.8,
        driftX: (Math.random() - 0.3) * 1.5,
        driftY: -1.2
      });

      // Chance for kill feed update
      if (Math.random() > 0.4) {
        setTimeout(() => {
          sfx.playHeadshot();
          const victims = ['Phoenix_Bot', 'Leet_Krew', 'Balkan_Sniper', 'Anarchist_X'];
          const pickedVictim = victims[Math.floor(Math.random() * victims.length)];
          csKillFeed.unshift({
            killer: 'V // ANTIGRAVITY',
            weapon: 'ak47',
            victim: pickedVictim,
            hs: true,
            time: Date.now()
          });
          if (csKillFeed.length > 5) csKillFeed.pop();
        }, 120);
      }
    }

    function drawCSSystem() {
      // 1. Dust II Sky & Desert Sun
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      skyGrad.addColorStop(0, '#c79d5e');
      skyGrad.addColorStop(0.35, '#deb87b');
      skyGrad.addColorStop(0.7, '#edd39d');
      skyGrad.addColorStop(1, '#d8b982');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sun
      ctx.save();
      ctx.fillStyle = '#fff9db';
      ctx.shadowColor = '#ffe28a';
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(width * 0.78, height * 0.18, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Far Distant Middle-Eastern Desert Architecture (Silhouette Mountains & Minarets)
      ctx.fillStyle = '#9c7b4a';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      ctx.lineTo(width * 0.15, height * 0.43);
      ctx.lineTo(width * 0.22, height * 0.46);
      ctx.lineTo(width * 0.38, height * 0.42);
      ctx.lineTo(width * 0.42, height * 0.35); // Minaret 1
      ctx.lineTo(width * 0.43, height * 0.35);
      ctx.lineTo(width * 0.45, height * 0.44);
      ctx.lineTo(width * 0.65, height * 0.42);
      ctx.lineTo(width * 0.72, height * 0.38); // Dome
      ctx.arc(width * 0.74, height * 0.42, 28, Math.PI, 0);
      ctx.lineTo(width * 0.88, height * 0.45);
      ctx.lineTo(width, height * 0.43);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // 3. Middleground: Dust II Iconic Sandstone Walls & Archways (Bombsite A / Long Doors)
      const horizonDust = height * 0.52;
      ctx.fillStyle = '#bda06c';
      ctx.fillRect(0, horizonDust - 10, width, height - horizonDust + 10);

      // Left Sandstone Fortress Wall
      ctx.fillStyle = '#967644';
      ctx.fillRect(0, horizonDust - 140, width * 0.28, 160);
      // Bricks / texture lines
      ctx.strokeStyle = '#7c5f32';
      ctx.lineWidth = 2;
      for (let y = horizonDust - 130; y < horizonDust; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width * 0.28, y);
        ctx.stroke();
      }

      // Middle Archway / Long Doors
      ctx.fillStyle = '#654823';
      ctx.beginPath();
      ctx.arc(width * 0.20, horizonDust - 30, 40, Math.PI, 0);
      ctx.lineTo(width * 0.20 + 40, horizonDust + 10);
      ctx.lineTo(width * 0.20 - 40, horizonDust + 10);
      ctx.closePath();
      ctx.fill();

      // Right Wooden Tactical Crates / Dust II Bombsite Crates
      // Crate 1 (Large)
      const c1X = width * 0.75;
      const c1Y = horizonDust - 65;
      ctx.fillStyle = '#6e4e24';
      ctx.fillRect(c1X, c1Y, 110, 85);
      ctx.strokeStyle = '#3d2b14';
      ctx.lineWidth = 3;
      ctx.strokeRect(c1X, c1Y, 110, 85);
      // Diagonal wooden cross braces
      ctx.beginPath();
      ctx.moveTo(c1X, c1Y); ctx.lineTo(c1X + 110, c1Y + 85);
      ctx.moveTo(c1X + 110, c1Y); ctx.lineTo(c1X, c1Y + 85);
      ctx.stroke();

      // Crate 2 (Small stacked on top)
      ctx.fillStyle = '#7a572a';
      ctx.fillRect(c1X + 25, c1Y - 60, 65, 60);
      ctx.strokeRect(c1X + 25, c1Y - 60, 65, 60);
      ctx.beginPath();
      ctx.moveTo(c1X + 25, c1Y - 60); ctx.lineTo(c1X + 90, c1Y);
      ctx.moveTo(c1X + 90, c1Y - 60); ctx.lineTo(c1X + 25, c1Y);
      ctx.stroke();

      // Bombsite "A" Graffiti on Wall
      ctx.save();
      ctx.font = 'bold 38px "Black Ops One", monospace';
      ctx.fillStyle = '#de3c26';
      ctx.shadowColor = '#de3c26';
      ctx.shadowBlur = 8;
      ctx.fillText('A', width * 0.25, horizonDust - 70);
      ctx.font = 'bold 13px "Share Tech Mono", monospace';
      ctx.fillStyle = '#222';
      ctx.fillText('BOMBSITE // 01', width * 0.25, horizonDust - 50);
      ctx.restore();

      // 4. C4 Explosive Device Planted on Crate
      const c4X = c1X + 45;
      const c4Y = c1Y - 14;
      // C4 Main Plastic Explosive (brown packs)
      ctx.fillStyle = '#c2a649';
      ctx.fillRect(c4X, c4Y, 32, 14);
      // Duct tape / wire
      ctx.fillStyle = '#333';
      ctx.fillRect(c4X + 12, c4Y - 2, 8, 18);
      // Keypad & Red LED Blinking
      const c4Blink = Math.floor(Date.now() / 450) % 2 === 0;
      ctx.fillStyle = c4Blink ? '#ff0000' : '#440000';
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = c4Blink ? 12 : 2;
      ctx.beginPath();
      ctx.arc(c4X + 6, c4Y + 6, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Ambient Sandstorm / Dust Particles
      ctx.save();
      for (const p of csDustParticles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > width) p.x = -10;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;

        ctx.fillStyle = `rgba(235, 205, 150, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 6. Tactical Smoke Grenade Clouds
      for (let i = csSmokeClouds.length - 1; i >= 0; i--) {
        const sm = csSmokeClouds[i];
        sm.radius += 0.8;
        sm.alpha -= 0.015;
        sm.x += sm.driftX;
        sm.y += sm.driftY;

        ctx.save();
        ctx.fillStyle = `rgba(210, 205, 195, ${Math.max(0, sm.alpha)})`;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (sm.alpha <= 0) csSmokeClouds.splice(i, 1);
      }

      // 7. Bullet Tracers
      for (let i = csBulletTracers.length - 1; i >= 0; i--) {
        const tr = csBulletTracers[i];
        tr.alpha -= 0.12;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 220, 100, ${tr.alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(tr.startX, tr.startY);
        ctx.lineTo(tr.endX, tr.endY);
        ctx.stroke();

        // Impact spark at end
        ctx.fillStyle = `rgba(255, 255, 255, ${tr.alpha})`;
        ctx.beginPath();
        ctx.arc(tr.endX, tr.endY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (tr.alpha <= 0) csBulletTracers.splice(i, 1);
      }

      // 8. First Person Viewmodel: CS AK-47 / Tactical Rifle (Right Hand)
      drawCSGun();

      // 9. CS:GO / CS 1.6 Kill Feed (Top Right)
      drawCSKillFeed();

      // 10. Classic CS Dynamic Crosshair
      drawCSCrosshair();

      // Update C4 Timer countdown
      const now = Date.now();
      if (now - csLastTick >= 1000) {
        csLastTick = now;
        if (csC4TimerSec > 0) {
          csC4TimerSec--;
          const bombTimer = document.getElementById('bombTimer');
          if (bombTimer) bombTimer.textContent = `C4: ${csC4TimerSec}s`;
          if (csC4TimerSec % 2 === 0) sfx.playC4Beep();
        } else {
          csC4TimerSec = 35; // Reset round
        }
      }
    }

    // CS Viewmodel Weapon (AK-47 Barrel & Hands)
    function drawCSGun() {
      if (csGunRecoilOffset > 0) csGunRecoilOffset -= 1.8;

      const baseX = width * 0.68;
      const baseY = height - 120 + csGunRecoilOffset;

      ctx.save();
      ctx.translate(baseX, baseY);

      // Gun Body Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 15, 220, 45);

      // Classic Wood Foregrip / Stock
      ctx.fillStyle = '#6a3818';
      ctx.fillRect(10, 0, 75, 28);
      ctx.fillStyle = '#4c250e';
      ctx.fillRect(10, 20, 75, 8);

      // Receiver & Metal Barrel
      ctx.fillStyle = '#1c1f24';
      ctx.fillRect(75, -8, 120, 32);
      ctx.fillRect(195, -2, 60, 14); // Barrel

      // Muzzle Brake / Flash Hider
      ctx.fillStyle = '#111317';
      ctx.fillRect(255, -4, 15, 18);

      // Curved Banana Magazine (AK-47 style)
      ctx.fillStyle = '#2b2c30';
      ctx.beginPath();
      ctx.moveTo(95, 24);
      ctx.quadraticCurveTo(115, 75, 130, 95);
      ctx.lineTo(105, 100);
      ctx.quadraticCurveTo(90, 75, 75, 24);
      ctx.closePath();
      ctx.fill();

      // Muzzle Flash on recoil
      if (csGunRecoilOffset > 10) {
        ctx.save();
        ctx.fillStyle = '#ffff66';
        ctx.shadowColor = '#ff9900';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(270, 5, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(275, 5, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    // Dynamic CS Green / Yellow Crosshair
    function drawCSCrosshair() {
      if (csCrosshair.recoil > 0) csCrosshair.recoil -= 0.9;
      const gap = 6 + csCrosshair.recoil;
      const len = 9;

      ctx.save();
      ctx.strokeStyle = '#52ff33'; // Iconic CS 1.6 green
      ctx.lineWidth = 2;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 3;

      const cx = csCrosshair.x;
      const cy = csCrosshair.y;

      // Top line
      ctx.beginPath(); ctx.moveTo(cx, cy - gap); ctx.lineTo(cx, cy - gap - len); ctx.stroke();
      // Bottom line
      ctx.beginPath(); ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, cy + gap + len); ctx.stroke();
      // Left line
      ctx.beginPath(); ctx.moveTo(cx - gap, cy); ctx.lineTo(cx - gap - len, cy); ctx.stroke();
      // Right line
      ctx.beginPath(); ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + gap + len, cy); ctx.stroke();

      // Center dot
      ctx.fillStyle = '#52ff33';
      ctx.fillRect(cx - 1, cy - 1, 2, 2);

      ctx.restore();
    }

    // CS Kill Feed overlay
    function drawCSKillFeed() {
      ctx.save();
      const startX = width - 20;
      let startY = 35;
      ctx.textAlign = 'right';
      ctx.font = 'bold 12px "Share Tech Mono", monospace';

      for (let i = 0; i < Math.min(4, csKillFeed.length); i++) {
        const item = csKillFeed[i];
        const killerColor = '#5a7742'; // CT / friendly
        const victimColor = '#de3c26'; // Terrorist red

        // Background pill
        ctx.fillStyle = 'rgba(15, 20, 15, 0.75)';
        ctx.fillRect(startX - 260, startY - 14, 260, 22);

        // Text
        ctx.fillStyle = killerColor;
        ctx.fillText(item.killer, startX - 110, startY + 2);

        ctx.fillStyle = '#d49b29';
        ctx.fillText(` [${item.weapon.toUpperCase()}${item.hs ? ' ★ HS' : ''}] `, startX - 50, startY + 2);

        ctx.fillStyle = victimColor;
        ctx.fillText(item.victim, startX - 6, startY + 2);

        startY += 26;
      }
      ctx.restore();
    }

    // =========================================================================
    // 6. SPIDER-MAN NOIR (1933 NEW YORK CITY // FILM NOIR) ENGINE
    // =========================================================================
    let noirRainDrops = [];
    let noirSteamVents = [];
    let noirGargoyleX = 140;
    let noirWebLines = [];
    let noirSpiderPos = { x: width * 0.18, y: height * 0.48, swinging: true, angle: 0 };

    function initNoirTheme() {
      noirRainDrops = [];
      for (let i = 0; i < 110; i++) {
        noirRainDrops.push({
          x: Math.random() * (width + 200),
          y: Math.random() * height,
          len: Math.random() * 24 + 18,
          speed: Math.random() * 9 + 14,
          alpha: Math.random() * 0.45 + 0.25
        });
      }

      noirSteamVents = [];
      for (let i = 0; i < 4; i++) {
        noirSteamVents.push({
          x: width * (0.2 + i * 0.22),
          y: height - 110,
          puffs: []
        });
      }
    }

    initNoirTheme();

    function drawSpiderNoirScene() {
      const now = Date.now();

      // 1. Monochromatic 1933 Night Sky & Heavy Storm Clouds
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      skyGrad.addColorStop(0, '#020203');
      skyGrad.addColorStop(0.5, '#0a0a0d');
      skyGrad.addColorStop(1, '#18181c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Huge Dramatic Full Moon obscured by dark clouds
      const moonX = width * 0.82;
      const moonY = height * 0.22;
      ctx.save();
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 70);
      moonGrad.addColorStop(0, '#ffffff');
      moonGrad.addColorStop(0.35, '#cccccc');
      moonGrad.addColorStop(0.8, '#555555');
      moonGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. 1930s Manhattan Skyline Silhouettes (Empire State, Chrysler, Water Towers)
      drawNoirSkyline();

      // 3. Steam Vents from Subway Grates / Chimneys
      drawNoirSteam(now);

      // 4. Heavy Slanted Cold Rain & Wind
      drawNoirRain();

      // 5. Spider-Man Noir Perched on a Gothic Gargoyle / Rooftop
      drawSpiderNoirHero(now);

      // 6. Vintage Film Grain & Film Scratch Artifacts
      drawNoirFilmGrain();
    }

    // 1930s Gothic Skyscrapers with Water Towers & Clock Spire
    function drawNoirSkyline() {
      ctx.save();
      const buildings = [
        { x: 0.05, w: 0.09, h: 220, spire: false, waterTower: true },
        { x: 0.14, w: 0.12, h: 320, spire: true, waterTower: false }, // Empire-style
        { x: 0.28, w: 0.08, h: 240, spire: false, waterTower: true },
        { x: 0.38, w: 0.10, h: 290, spire: true, waterTower: false },
        { x: 0.50, w: 0.14, h: 340, spire: true, waterTower: false }, // Chrysler spire
        { x: 0.66, w: 0.09, h: 260, spire: false, waterTower: true },
        { x: 0.77, w: 0.11, h: 280, spire: true, waterTower: false },
        { x: 0.90, w: 0.08, h: 230, spire: false, waterTower: true }
      ];

      const horizonY = height - 70;

      for (const b of buildings) {
        const bx = width * b.x;
        const bw = width * b.w;
        const by = horizonY - b.h;

        // Dark stark silhouette
        ctx.fillStyle = '#08080a';
        ctx.fillRect(bx, by, bw, b.h);

        // Building edge white pencil highlight (Comic book noir inking)
        ctx.strokeStyle = '#383838';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, b.h);

        // Water tower on roof
        if (b.waterTower) {
          const wtx = bx + bw * 0.35;
          const wty = by - 32;
          ctx.fillStyle = '#050507';
          // Legs
          ctx.strokeStyle = '#222';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(wtx, by); ctx.lineTo(wtx + 4, wty + 20);
          ctx.moveTo(wtx + 24, by); ctx.lineTo(wtx + 20, wty + 20);
          ctx.stroke();
          // Barrel & Conical roof
          ctx.fillRect(wtx + 2, wty + 6, 20, 15);
          ctx.beginPath();
          ctx.moveTo(wtx, wty + 6);
          ctx.lineTo(wtx + 12, wty);
          ctx.lineTo(wtx + 24, wty + 6);
          ctx.closePath();
          ctx.fill();
        }

        // Art Deco Spire
        if (b.spire) {
          ctx.strokeStyle = '#666';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx + bw / 2, by);
          ctx.lineTo(bx + bw / 2, by - 45);
          ctx.stroke();
        }

        // Sparse flickering warm sepia/white windows in the dark
        ctx.fillStyle = 'rgba(230, 230, 230, 0.4)';
        for (let wy = by + 20; wy < horizonY - 20; wy += 22) {
          for (let wx = bx + 8; wx < bx + bw - 8; wx += 14) {
            if ((wx + wy) % 7 === 0) {
              ctx.fillRect(wx, wy, 4, 8);
            }
          }
        }
      }

      // Foreground Rooftop Ledge
      ctx.fillStyle = '#050506';
      ctx.fillRect(0, horizonY, width, height - horizonY);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      ctx.restore();
    }

    // Atmospheric Steam Puffs
    function drawNoirSteam(now) {
      ctx.save();
      for (const vent of noirSteamVents) {
        if (Math.random() > 0.6) {
          vent.puffs.push({
            x: vent.x + (Math.random() - 0.5) * 12,
            y: vent.y,
            r: 8,
            alpha: 0.35,
            driftX: 0.8 + Math.random() * 0.6,
            driftY: -(1.2 + Math.random() * 0.8)
          });
        }

        for (let i = vent.puffs.length - 1; i >= 0; i--) {
          const p = vent.puffs[i];
          p.x += p.driftX;
          p.y += p.driftY;
          p.r += 0.5;
          p.alpha -= 0.005;

          ctx.fillStyle = 'rgba(180, 180, 185, ' + Math.max(0, p.alpha) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          if (p.alpha <= 0) vent.puffs.splice(i, 1);
        }
      }
      ctx.restore();
    }

    // Heavy Slanted Cold Rain
    function drawNoirRain() {
      ctx.save();
      ctx.strokeStyle = 'rgba(220, 220, 230, 0.3)';
      ctx.lineWidth = 1.2;

      for (const drop of noirRainDrops) {
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.28; // Strong wind angle

        if (drop.y > height) {
          drop.y = -30;
          drop.x = Math.random() * (width + 200);
        }

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.len * 0.28, drop.y + drop.len);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Spider-Man Noir Detective Sprite (Fedora, Trenchcoat Flapping in the Wind, Glowing Goggles)
    function drawSpiderNoirHero(now) {
      const heroX = width * 0.16;
      const heroY = height - 145;

      ctx.save();
      ctx.translate(heroX, heroY);

      // Gothic Stone Gargoyle Pedestal
      ctx.fillStyle = '#08080a';
      ctx.fillRect(-35, 30, 70, 50);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.strokeRect(-35, 30, 70, 50);

      // Gargoyle head silhouette jutting out
      ctx.beginPath();
      ctx.moveTo(10, 30);
      ctx.lineTo(55, 45);
      ctx.lineTo(35, 65);
      ctx.lineTo(10, 55);
      ctx.closePath();
      ctx.fill();

      // Spider-Web Line extending into the rainy sky
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(-70, -300);
      ctx.stroke();

      // Flapping Long Leather Trenchcoat (Simulated Cloth Physics in the Wind)
      const windWave1 = Math.sin(now * 0.008) * 14;
      const windWave2 = Math.cos(now * 0.012) * 18;

      ctx.fillStyle = '#030304';
      ctx.beginPath();
      ctx.moveTo(-10, 0); // shoulders
      ctx.lineTo(-45 + windWave1, 20); // coat blowing back
      ctx.lineTo(-65 + windWave2, 35);
      ctx.lineTo(-30 + windWave1, 38);
      ctx.lineTo(10, 25);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hero Body Crouched (Dark tactical vest)
      ctx.fillStyle = '#09090c';
      ctx.fillRect(-12, -4, 24, 28);

      // Legs in crouch position
      ctx.fillStyle = '#050507';
      ctx.fillRect(-18, 14, 14, 20);
      ctx.fillRect(4, 14, 14, 20);

      // Head & Fedora Hat (1930s Detective Brim)
      ctx.fillStyle = '#040405';
      ctx.beginPath();
      ctx.arc(0, -14, 10, 0, Math.PI * 2);
      ctx.fill();

      // Fedora Crown & Brim
      ctx.fillStyle = '#0a0a0e';
      ctx.fillRect(-8, -30, 16, 12);
      ctx.fillRect(-18, -18, 36, 4); // Wide brim
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, -20, 16, 2); // Hat band

      // Glowing Round Aviator Goggles (Spider-Noir Trademark White Eyes)
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 18;

      // Left Goggle
      ctx.beginPath();
      ctx.arc(-4, -14, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Right Goggle
      ctx.beginPath();
      ctx.arc(6, -14, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    // Vintage 1930s Film Noir Grain & Celluloid Scratch Lines
    function drawNoirFilmGrain() {
      if (Math.random() > 0.4) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        const scratchX = Math.random() * width;
        ctx.beginPath();
        ctx.moveTo(scratchX, 0);
        ctx.lineTo(scratchX + (Math.random() - 0.5) * 10, height);
        ctx.stroke();
        ctx.restore();
      }
    }

    // =========================================================================
    // 7. THE SIMPSONS (SPRINGFIELD // NUCLEAR PLANT & DONUTS) CANVAS ENGINE
    // =========================================================================
    let simpsonsClouds = [];
    let simpsonsDonuts = [];
    let simpsonsSteamPuffs = [];
    let simpsonsRadioactiveGlow = 0;

    function initSimpsonsTheme() {
      // Springfield Opening Sky Clouds (Fluffy White Clouds with Soft Shadow)
      simpsonsClouds = [
        { x: width * 0.08, y: height * 0.12, r: 42, speed: 0.35 },
        { x: width * 0.35, y: height * 0.08, r: 55, speed: 0.45 },
        { x: width * 0.68, y: height * 0.15, r: 48, speed: 0.38 },
        { x: width * 0.90, y: height * 0.10, r: 38, speed: 0.30 }
      ];

      // Giant Homer Pink Frosted Sprinkled Donuts
      simpsonsDonuts = [];
      for (let i = 0; i < 9; i++) {
        simpsonsDonuts.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.85,
          size: Math.random() * 22 + 20, // 20px - 42px
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
          speedY: Math.random() * 0.6 + 0.3,
          wobble: Math.random() * Math.PI * 2
        });
      }

      // Cooling Tower Radioactive Steam Puffs
      simpsonsSteamPuffs = [];
      for (let i = 0; i < 18; i++) {
        simpsonsSteamPuffs.push({
          x: width * 0.82 + (Math.random() - 0.5) * 35,
          y: height * 0.55 - Math.random() * 160,
          r: Math.random() * 18 + 14,
          alpha: Math.random() * 0.6 + 0.2,
          speedY: Math.random() * 0.8 + 0.5,
          grow: 0.15
        });
      }
    }

    initSimpsonsTheme();

    function drawSimpsonsScene() {
      const now = Date.now();

      // 1. Springfield Sunny Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#4fbcf9');
      skyGrad.addColorStop(0.55, '#78d5fd');
      skyGrad.addColorStop(1, '#a6e7ff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Springfield Opening Clouds
      drawSimpsonsClouds();

      // 3. Springfield Hills & Nuclear Cooling Towers
      drawSpringfieldHillsAndPlant(now);

      // 4. Homer's Pink Frosted Sprinkled Donuts (Rotating & Gently Drifting)
      drawSimpsonsDonuts(now);
    }

    // Fluffy Cartoon Springfield Clouds
    function drawSimpsonsClouds() {
      ctx.save();
      for (const cloud of simpsonsClouds) {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.r * 3 > width) {
          cloud.x = -cloud.r * 3;
          cloud.y = Math.random() * (height * 0.28) + 20;
        }

        const cx = cloud.x;
        const cy = cloud.y;
        const r = cloud.r;

        // Cloud Shadow
        ctx.fillStyle = 'rgba(70, 160, 230, 0.25)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.7, cy + 4, r * 0.65, 0, Math.PI * 2);
        ctx.arc(cx, cy + 4, r * 0.9, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.7, cy + 4, r * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Cloud Solid White Body
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.7, cy, r * 0.65, 0, Math.PI * 2);
        ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.7, cy, r * 0.7, 0, Math.PI * 2);
        ctx.arc(cx - r * 0.35, cy - r * 0.45, r * 0.6, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.35, cy - r * 0.45, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Springfield Nuclear Power Plant & Green Hills
    function drawSpringfieldHillsAndPlant(now) {
      ctx.save();

      // Distant Springfield Green Rolling Hills
      const hillBase = height * 0.76;
      ctx.fillStyle = '#6ab04c';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, hillBase);
      ctx.bezierCurveTo(width * 0.25, hillBase - 50, width * 0.45, hillBase + 30, width * 0.7, hillBase - 40);
      ctx.bezierCurveTo(width * 0.85, hillBase - 80, width * 0.95, hillBase - 20, width, hillBase - 30);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#273c10';
      ctx.stroke();

      // Near Foreground Hill
      ctx.fillStyle = '#78c850';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, hillBase + 45);
      ctx.bezierCurveTo(width * 0.3, hillBase + 10, width * 0.6, hillBase + 80, width, hillBase + 35);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Springfield Nuclear Power Plant Cooling Towers (On Right Horizon)
      const towerBaseX = width * 0.82;
      const towerBaseY = hillBase - 25;
      const towerW = Math.min(width * 0.12, 110);
      const towerH = 140;

      // Radioactive Steam Emission from Towers
      for (const puff of simpsonsSteamPuffs) {
        puff.y -= puff.speedY;
        puff.r += puff.grow;
        puff.alpha -= 0.0035;

        if (puff.alpha <= 0 || puff.y < 0) {
          puff.x = towerBaseX + (Math.random() - 0.5) * (towerW * 0.6);
          puff.y = towerBaseY - towerH;
          puff.r = Math.random() * 14 + 10;
          puff.alpha = Math.random() * 0.5 + 0.3;
        }

        ctx.save();
        ctx.fillStyle = `rgba(57, 255, 20, ${puff.alpha * 0.45})`; // Radioactive Green Glow
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, puff.r * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${puff.alpha * 0.8})`; // White Steam Center
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Left Tower Silhouette
      drawCoolingTower(towerBaseX - towerW * 0.6, towerBaseY + 15, towerW * 0.85, towerH * 0.85);

      // Main Front Cooling Tower
      drawCoolingTower(towerBaseX, towerBaseY, towerW, towerH);

      ctx.restore();
    }

    function drawCoolingTower(bx, by, tw, th) {
      ctx.save();
      ctx.fillStyle = '#b0bec5';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;

      const topW = tw * 0.65;
      const waistW = tw * 0.50;
      const topY = by - th;
      const waistY = by - th * 0.58;

      // Hyperbolic Cooling Tower Outline
      ctx.beginPath();
      ctx.moveTo(bx - tw * 0.5, by);
      ctx.quadraticCurveTo(bx - waistW * 0.5, waistY, bx - topW * 0.5, topY);
      ctx.lineTo(bx + topW * 0.5, topY);
      ctx.quadraticCurveTo(bx + waistW * 0.5, waistY, bx + tw * 0.5, by);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top Ring / Rim
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.ellipse(bx, topY, topW * 0.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Radioactive Sector 7G Trefoil Hazard Symbol
      ctx.fillStyle = '#39ff14';
      ctx.beginPath();
      ctx.arc(bx, waistY + 15, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // Homer's Frosted Pink Donuts with Colorful Rainbow Sprinkles
    function drawSimpsonsDonuts(now) {
      ctx.save();
      for (const donut of simpsonsDonuts) {
        donut.y += donut.speedY;
        donut.rotation += donut.rotSpeed;
        donut.wobble += 0.02;

        if (donut.y - donut.size > height) {
          donut.y = -donut.size * 2;
          donut.x = Math.random() * width;
        }

        const dx = donut.x + Math.sin(donut.wobble) * 12;
        const dy = donut.y;
        const R = donut.size;
        const rHole = R * 0.38;

        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(donut.rotation);

        // Donut Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(4, 5, R, 0, Math.PI * 2);
        ctx.fill();

        // 1. Golden Dough Body with Black Cartoon Outline
        ctx.fillStyle = '#e8a853';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 2. Glossy Pink Strawberry Frosting
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.90, 0, Math.PI * 2);
        ctx.fill();

        // Frosting wavy drippings
        ctx.fillStyle = '#ff1493';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const dripX = Math.cos(a) * (R * 0.72);
          const dripY = Math.sin(a) * (R * 0.72);
          ctx.beginPath();
          ctx.arc(dripX, dripY, R * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Center Donut Hole Cutout
        ctx.fillStyle = '#78d5fd'; // Matches Springfield sky
        ctx.beginPath();
        ctx.arc(0, 0, rHole, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        // 4. Multi-color Rainbow Sprinkles (White, Yellow, Lime, Blue, Orange)
        const sprinkles = [
          { x: -R * 0.55, y: -R * 0.25, rot: 0.4, color: '#ffffff' },
          { x: R * 0.45, y: -R * 0.40, rot: -0.6, color: '#39ff14' },
          { x: -R * 0.25, y: R * 0.55, rot: 0.9, color: '#fed90f' },
          { x: R * 0.50, y: R * 0.35, rot: 0.2, color: '#00f0ff' },
          { x: -R * 0.40, y: R * 0.20, rot: -0.8, color: '#ff4081' },
          { x: R * 0.15, y: -R * 0.65, rot: 1.2, color: '#fed90f' },
          { x: -R * 0.60, y: 0, rot: 0.1, color: '#39ff14' },
          { x: 0, y: R * 0.65, rot: -0.4, color: '#ffffff' }
        ];

        for (const sp of sprinkles) {
          ctx.save();
          ctx.translate(sp.x, sp.y);
          ctx.rotate(sp.rot);
          ctx.fillStyle = sp.color;
          ctx.fillRect(-4, -1.8, 8, 3.6);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#000000';
          ctx.strokeRect(-4, -1.8, 8, 3.6);
          ctx.restore();
        }

        ctx.restore();
      }
      ctx.restore();
    }

    // =========================================================================
    // 8. PAC-MAN 1980 (NAMCO / MIDWAY NEON RETRO ARCADE MAZE) ENGINE
    // =========================================================================
    let pacmanX = 0;
    let pacmanY = 120;
    let pacmanDir = 1; // 1 = right, -1 = left
    let pacmanSpeed = 3.6;
    let pacmanMouthAngle = 0.2;
    let pacmanMouthDir = 0.04;
    let pacmanDots = [];
    let pacmanGhosts = [];
    let pacmanFruits = [];
    let pacmanScore = 24500;

    function initPacmanTheme() {
      pacmanX = -50;
      pacmanY = height * 0.78;
      pacmanDir = 1;

      // Generate rows of neon pellets / energizers across the viewport
      pacmanDots = [];
      const dotSpacing = 36;
      const count = Math.ceil(width / dotSpacing) + 2;
      for (let i = 0; i < count; i++) {
        const isEnergizer = (i % 12 === 0);
        pacmanDots.push({
          x: i * dotSpacing,
          y: pacmanY,
          isEnergizer: isEnergizer,
          radius: isEnergizer ? 7 : 3.5,
          eaten: false
        });
      }

      // 4 Famous Ghosts: Blinky (Red), Pinky (Pink), Inky (Cyan), Clyde (Orange)
      pacmanGhosts = [
        { name: 'Blinky', color: '#ff0000', x: -140, y: pacmanY, dir: 1, speed: 3.4, eyeDir: 1 },
        { name: 'Pinky',  color: '#ffb8de', x: -190, y: pacmanY, dir: 1, speed: 3.3, eyeDir: 1 },
        { name: 'Inky',   color: '#00ffff', x: -240, y: pacmanY, dir: 1, speed: 3.2, eyeDir: 1 },
        { name: 'Clyde',  color: '#ffb852', x: -290, y: pacmanY, dir: 1, speed: 3.1, eyeDir: 1 }
      ];

      // Floating Arcade Fruit / Cherry Bonuses
      pacmanFruits = [
        { x: width * 0.25, y: height * 0.32, type: 'cherry', floatOffset: 0 },
        { x: width * 0.75, y: height * 0.28, type: 'strawberry', floatOffset: Math.PI }
      ];
    }

    initPacmanTheme();

    function drawPacmanScene() {
      // 1. Deep Arcade Black Background with Blue Neon Maze Grid Outline
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Neon Arcade Maze Border Lines (Top, Middle, Bottom)
      ctx.save();
      ctx.strokeStyle = '#2121de';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#2121de';
      ctx.shadowBlur = 10;

      // Upper Maze Arch
      const mazeY = pacmanY;
      ctx.beginPath();
      ctx.moveTo(0, mazeY - 35);
      ctx.lineTo(width, mazeY - 35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, mazeY + 35);
      ctx.lineTo(width, mazeY + 35);
      ctx.stroke();

      // Occasional maze block obstacles in background
      ctx.fillStyle = 'rgba(33, 33, 222, 0.12)';
      ctx.fillRect(width * 0.15, mazeY - 110, 80, 50);
      ctx.strokeRect(width * 0.15, mazeY - 110, 80, 50);
      ctx.fillRect(width * 0.55, mazeY - 110, 100, 50);
      ctx.strokeRect(width * 0.55, mazeY - 110, 100, 50);
      ctx.restore();

      // 2. Draw Pac-Dots / Energizers
      ctx.save();
      const now = performance.now() * 0.005;
      for (const dot of pacmanDots) {
        if (dot.eaten) continue;
        ctx.fillStyle = dot.isEnergizer ? '#ffff00' : '#ffb8ae';
        const r = dot.isEnergizer ? (dot.radius + Math.sin(now * 3) * 1.5) : dot.radius;
        if (dot.isEnergizer) {
          ctx.shadowColor = '#ffff00';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw Pac-Man with Chomp Animation
      pacmanX += pacmanSpeed * pacmanDir;
      pacmanMouthAngle += pacmanMouthDir;
      if (pacmanMouthAngle > 0.45 || pacmanMouthAngle < 0.04) {
        pacmanMouthDir = -pacmanMouthDir;
      }

      // Check dot consumption
      for (const dot of pacmanDots) {
        if (!dot.eaten && Math.abs(pacmanX - dot.x) < 18) {
          dot.eaten = true;
          pacmanScore += dot.isEnergizer ? 50 : 10;
          const scoreEl = getEl("pacScore");
          if (scoreEl) scoreEl.textContent = pacmanScore;
        }
      }

      // Wrap around screen
      if (pacmanDir === 1 && pacmanX > width + 100) {
        pacmanX = -80;
        for (const dot of pacmanDots) dot.eaten = false;
      } else if (pacmanDir === -1 && pacmanX < -100) {
        pacmanX = width + 80;
        for (const dot of pacmanDots) dot.eaten = false;
      }

      // Render Pac-Man Body
      ctx.save();
      ctx.translate(pacmanX, pacmanY);
      if (pacmanDir === -1) {
        ctx.scale(-1, 1);
      }
      ctx.fillStyle = '#ffff00';
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(0, 0, 22, pacmanMouthAngle * Math.PI, (2 - pacmanMouthAngle) * Math.PI, false);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Draw The 4 Ghosts Chasing Pac-Man
      for (const ghost of pacmanGhosts) {
        ghost.x += ghost.speed * ghost.dir;
        if (ghost.dir === 1 && ghost.x > width + 150) {
          ghost.x = -150 - Math.random() * 80;
        }

        drawArcadeGhost(ghost.x, ghost.y, ghost.color, ghost.eyeDir);
      }

      // 5. Draw Floating Arcade Fruit Bonuses (Cherries & Strawberries)
      drawPacmanFruits();
    }

    // Helper: Draw Authentic Arcade Ghost with skirt ruffles and googly eyes
    function drawArcadeGhost(x, y, color, eyeDir) {
      ctx.save();
      ctx.translate(x, y);

      const R = 18;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      // Round top dome
      ctx.arc(0, -4, R, Math.PI, 0, false);
      // Sides down
      ctx.lineTo(R, 16);

      // Wavy Skirt feet (3 ruffles)
      const ruffWidth = (R * 2) / 3;
      ctx.quadraticCurveTo(R - ruffWidth * 0.5, 10, R - ruffWidth, 16);
      ctx.quadraticCurveTo(R - ruffWidth * 1.5, 10, R - ruffWidth * 2, 16);
      ctx.quadraticCurveTo(-R + ruffWidth * 0.5, 10, -R, 16);
      ctx.lineTo(-R, -4);
      ctx.closePath();
      ctx.fill();

      // Ghost Eyes (White sclera)
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      const eyeOffsetX = eyeDir * 3;
      ctx.beginPath();
      ctx.arc(-6 + eyeOffsetX, -6, 5, 0, Math.PI * 2);
      ctx.arc(6 + eyeOffsetX, -6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Ghost Pupils (Deep Blue Looking Forward)
      ctx.fillStyle = '#0000aa';
      ctx.beginPath();
      ctx.arc(-5 + eyeOffsetX * 1.3, -6, 2.8, 0, Math.PI * 2);
      ctx.arc(7 + eyeOffsetX * 1.3, -6, 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Helper: Draw Classic 1980 Pixelated Cherries
    function drawPacmanFruits() {
      ctx.save();
      const t = performance.now() * 0.003;
      for (const fruit of pacmanFruits) {
        fruit.floatOffset += 0.03;
        const fy = fruit.y + Math.sin(fruit.floatOffset) * 8;

        ctx.save();
        ctx.translate(fruit.x, fy);

        // Brown Stems
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.quadraticCurveTo(-6, -8, -8, 2);
        ctx.moveTo(0, -16);
        ctx.quadraticCurveTo(6, -8, 8, 4);
        ctx.stroke();

        // Twin Bright Red Cherries
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-8, 5, 7.5, 0, Math.PI * 2);
        ctx.arc(8, 7, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // White Glint Highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-10, 3, 2, 0, Math.PI * 2);
        ctx.arc(6, 5, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();
    }

    // =========================================================================
    // 5. GRAND THEFT AUTO VI (VICE CITY / LEONIDA SUNSET) ENGINE
    // =========================================================================
    let gtaPalmTrees = [];
    let gtaBirds = [];
    let gtaWantedLevel = 3;
    let gtaChopperX = 120;
    let gtaChopperY = 160;
    let gtaChopperBladeAngle = 0;
    let gtaCarX = width * 0.45;

    function initGTATheme() {
      gtaPalmTrees = [
        { x: width * 0.06, h: height * 0.42, curve: 35, scale: 1.1 },
        { x: width * 0.16, h: height * 0.35, curve: 20, scale: 0.9 },
        { x: width * 0.84, h: height * 0.38, curve: -30, scale: 0.95 },
        { x: width * 0.94, h: height * 0.45, curve: -45, scale: 1.15 }
      ];
      gtaBirds = [];
      for (let i = 0; i < 7; i++) {
        gtaBirds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.35) + 40,
          speed: Math.random() * 1.5 + 1.2,
          wingPhase: Math.random() * Math.PI * 2,
          size: Math.random() * 5 + 6
        });
      }
    }

    initGTATheme();

    function drawGTAScene() {
      const now = Date.now();

      // 1. Tropical Sunset Sky (Deep Purple -> Hot Magenta -> Neon Coral -> Golden Orange)
      const sky = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      sky.addColorStop(0, '#1c053a');
      sky.addColorStop(0.25, '#4a0e4e');
      sky.addColorStop(0.55, '#c2185b');
      sky.addColorStop(0.8, '#ff5722');
      sky.addColorStop(1, '#ffb300');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // 2. Huge 80s Synthwave / Vice City Neon Sun
      const sunY = height * 0.42;
      const sunRadius = Math.min(width * 0.16, 95);
      const sunGrad = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
      sunGrad.addColorStop(0, '#fff59d');
      sunGrad.addColorStop(0.4, '#ff4081');
      sunGrad.addColorStop(1, '#d500f9');

      ctx.save();
      ctx.fillStyle = sunGrad;
      ctx.shadowColor = '#ff4081';
      ctx.shadowBlur = 45;
      ctx.beginPath();
      ctx.arc(width * 0.5, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal retro sun stripe cuts
      ctx.fillStyle = '#1c053a';
      const numCuts = 7;
      for (let i = 0; i < numCuts; i++) {
        const cutY = sunY + (i / numCuts) * (sunRadius * 0.85);
        const cutH = (i + 1) * 2.2;
        ctx.fillRect(width * 0.5 - sunRadius - 10, cutY, (sunRadius * 2) + 20, cutH);
      }
      ctx.restore();

      // 3. Ocean / Biscayne Bay Horizon with Sunset Reflection
      const waterY = height * 0.55;
      const waterGrad = ctx.createLinearGradient(0, waterY, 0, height);
      waterGrad.addColorStop(0, '#1a0833');
      waterGrad.addColorStop(0.2, '#38006b');
      waterGrad.addColorStop(0.6, '#0d1b2a');
      waterGrad.addColorStop(1, '#050c14');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterY, width, height - waterY);

      // Neon Sun reflections ripples on water
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 64, 129, 0.4)';
      for (let r = 0; r < 25; r++) {
        const ry = waterY + Math.pow(r / 25, 2) * (height * 0.25);
        const rw = (r + 1) * (sunRadius * 0.12);
        const waveOffset = Math.sin(now * 0.003 + r) * 12;
        ctx.lineWidth = Math.max(1, r * 0.2);
        ctx.beginPath();
        ctx.moveTo(width * 0.5 - rw + waveOffset, ry);
        ctx.lineTo(width * 0.5 + rw + waveOffset, ry);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Distant Ocean Drive / Miami Beach Skyline Silhouettes with Neon Highlights
      drawGTASkyline(waterY);

      // 5. Vice City Police Helicopter (VCPD Chopper circling with spotlight!)
      drawGTAChopper(now);

      // 6. Flying Birds
      drawGTABirds();

      // 7. Coastal Ocean Drive Boulevard (Foreground Road)
      const roadY = height - 90;
      ctx.fillStyle = '#131318';
      ctx.fillRect(0, roadY, width, height - roadY);

      // Curb & Sidewalk with Ocean Drive Pink & Cyan Neon Glow
      ctx.fillStyle = '#262630';
      ctx.fillRect(0, roadY - 12, width, 12);
      ctx.strokeStyle = '#ff007f';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, roadY - 12);
      ctx.lineTo(width, roadY - 12);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Road Dash Marks
      ctx.fillStyle = 'rgba(255, 230, 100, 0.6)';
      const roadDashOffset = (now * 0.15) % 60;
      for (let rx = -60 + roadDashOffset; rx < width + 60; rx += 60) {
        ctx.fillRect(rx, roadY + 38, 30, 4);
      }

      // 8. Lucia & Jason Sports Car (Grotti Cheetah / Testarossa)
      drawGTASupercar(roadY + 18, now);

      // 9. Iconic Florida / Vice City Silhouette Palm Trees
      for (const palm of gtaPalmTrees) {
        drawPalmTree(palm.x, height - 85, palm.h, palm.curve, palm.scale);
      }
    }

    function drawGTASkyline(baseY) {
      ctx.save();
      const buildings = [
        { x: 0.18, w: 0.08, h: 80, neon: '#00f0ff' },
        { x: 0.27, w: 0.06, h: 120, neon: '#ff007f', spire: true },
        { x: 0.34, w: 0.09, h: 95, neon: '#ffcc00' },
        { x: 0.44, w: 0.07, h: 140, neon: '#00f0ff', spire: true },
        { x: 0.52, w: 0.10, h: 110, neon: '#ff007f' },
        { x: 0.63, w: 0.06, h: 85, neon: '#00ff88' },
        { x: 0.70, w: 0.08, h: 130, neon: '#ff007f', spire: true },
        { x: 0.79, w: 0.07, h: 90, neon: '#00f0ff' }
      ];

      for (const b of buildings) {
        const bx = width * b.x;
        const bw = width * b.w;
        const by = baseY - b.h;

        ctx.fillStyle = '#0f051c';
        ctx.fillRect(bx, by, bw, b.h);

        ctx.strokeStyle = b.neon;
        ctx.shadowColor = b.neon;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + bw, by);
        ctx.stroke();

        if (b.spire) {
          ctx.beginPath();
          ctx.moveTo(bx + bw/2, by);
          ctx.lineTo(bx + bw/2, by - 25);
          ctx.stroke();
          ctx.fillStyle = '#ff0033';
          ctx.beginPath();
          ctx.arc(bx + bw/2, by - 25, 2, 0, Math.PI*2);
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(255, 235, 150, 0.5)';
        for (let wy = by + 12; wy < baseY - 10; wy += 14) {
          for (let wx = bx + 6; wx < bx + bw - 6; wx += 10) {
            if ((wx + wy) % 5 === 0) ctx.fillRect(wx, wy, 4, 6);
          }
        }
      }
      ctx.restore();
    }

    function drawGTAChopper(now) {
      gtaChopperX = (gtaChopperX + 1.2);
      if (gtaChopperX > width + 100) gtaChopperX = -100;
      gtaChopperY = 130 + Math.sin(now * 0.003) * 15;
      gtaChopperBladeAngle += 0.8;

      ctx.save();
      ctx.translate(gtaChopperX, gtaChopperY);

      const searchLightTargetX = Math.sin(now * 0.002) * 180;
      const searchLightGrad = ctx.createRadialGradient(0, 0, 10, searchLightTargetX, height - gtaChopperY, 140);
      searchLightGrad.addColorStop(0, 'rgba(255, 255, 220, 0.45)');
      searchLightGrad.addColorStop(1, 'rgba(255, 255, 220, 0)');

      ctx.fillStyle = searchLightGrad;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(searchLightTargetX - 70, height - gtaChopperY);
      ctx.lineTo(searchLightTargetX + 70, height - gtaChopperY);
      ctx.lineTo(10, 15);
      ctx.closePath();
      ctx.fill();

      const strobe = Math.floor(now / 150) % 2 === 0;
      ctx.shadowBlur = 15;
      ctx.shadowColor = strobe ? '#0088ff' : '#ff0033';
      ctx.fillStyle = strobe ? '#00aaff' : '#ff0033';
      ctx.beginPath();
      ctx.arc(0, 12, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0a0a12';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(12, -2, 7, 0, Math.PI * 1.5, true);
      ctx.fill();

      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(-38, -3, 24, 5);
      ctx.fillRect(-42, -12, 6, 16);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const bladeSpan = Math.cos(gtaChopperBladeAngle) * 44;
      ctx.moveTo(-bladeSpan, -13);
      ctx.lineTo(bladeSpan, -13);
      ctx.stroke();

      ctx.fillStyle = '#333';
      ctx.fillRect(-3, -13, 6, 4);

      ctx.restore();
    }

    function drawGTASupercar(baseY, now) {
      gtaCarX = width * 0.48 + Math.sin(now * 0.001) * 35;

      ctx.save();
      ctx.translate(gtaCarX, baseY);

      ctx.fillStyle = 'rgba(255, 0, 127, 0.45)';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.ellipse(0, 14, 60, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#111';
      ctx.fillRect(-48, 4, 18, 14);
      ctx.fillRect(30, 4, 18, 14);

      ctx.fillStyle = '#ddd';
      ctx.fillRect(-44, 8, 10, 6);
      ctx.fillRect(34, 8, 10, 6);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-54, 8);
      ctx.lineTo(-45, -2);
      ctx.lineTo(-24, -12);
      ctx.lineTo(18, -12);
      ctx.lineTo(46, -2);
      ctx.lineTo(54, 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ff007f';
      ctx.fillRect(-20, -1, 35, 3);
      ctx.fillRect(-16, 3, 28, 3);

      ctx.fillStyle = '#0a0d1a';
      ctx.beginPath();
      ctx.moveTo(-18, -12);
      ctx.lineTo(-10, -22);
      ctx.lineTo(14, -22);
      ctx.lineTo(24, -12);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.fillRect(-4, -20, 6, 8);

      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12;
      ctx.fillRect(-52, 0, 8, 6);

      ctx.fillStyle = 'rgba(255, 240, 180, 0.7)';
      ctx.shadowColor = '#ffffaa';
      ctx.shadowBlur = 15;
      ctx.fillRect(50, 0, 5, 5);

      ctx.restore();
    }

    function drawPalmTree(baseX, baseY, trunkHeight, curve, scale) {
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.scale(scale, scale);

      ctx.strokeStyle = '#0a0314';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(curve * 0.4, -trunkHeight * 0.5, curve, -trunkHeight);
      ctx.stroke();

      ctx.strokeStyle = '#180a2b';
      ctx.lineWidth = 11;
      for (let p = 0.2; p < 0.9; p += 0.15) {
        const ringX = curve * Math.pow(p, 1.5);
        const ringY = -trunkHeight * p;
        ctx.beginPath();
        ctx.moveTo(ringX - 4, ringY);
        ctx.lineTo(ringX + 4, ringY);
        ctx.stroke();
      }

      const topX = curve;
      const topY = -trunkHeight;
      const frondAngles = [-130, -100, -70, -40, -10, 20, 50, 80, 110];

      ctx.fillStyle = '#0a0314';
      ctx.strokeStyle = '#0a0314';
      ctx.lineWidth = 3.5;

      for (const deg of frondAngles) {
        const rad = (deg * Math.PI) / 180;
        const len = 48 + Math.random() * 8;
        const endX = topX + Math.cos(rad) * len;
        const endY = topY + Math.sin(rad) * len + (len * 0.35);

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.quadraticCurveTo(topX + Math.cos(rad) * (len * 0.6), topY + Math.sin(rad) * (len * 0.4), endX, endY);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawGTABirds() {
      ctx.save();
      ctx.fillStyle = '#1c053a';
      for (const bird of gtaBirds) {
        bird.x += bird.speed;
        bird.wingPhase += 0.18;
        if (bird.x > width + 40) bird.x = -40;

        const wingY = Math.sin(bird.wingPhase) * (bird.size * 0.5);
        ctx.beginPath();
        ctx.moveTo(bird.x, bird.y);
        ctx.lineTo(bird.x - bird.size, bird.y - wingY);
        ctx.lineTo(bird.x - bird.size * 0.4, bird.y + 2);
        ctx.lineTo(bird.x, bird.y);
        ctx.lineTo(bird.x + bird.size * 0.4, bird.y + 2);
        ctx.lineTo(bird.x + bird.size, bird.y - wingY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // -------------------------------------------------------------------------
    // MASTER RENDER LOOP
    // -------------------------------------------------------------------------
    function renderWorld() {
      ctx.clearRect(0, 0, width, height);

      if (currentTheme === 'retro') {
        // TRON THEME
        const horizonY = height * 0.52;
        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, '#000208');
        skyGrad.addColorStop(0.7, '#020b1f');
        skyGrad.addColorStop(1, '#051838');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, horizonY);

        drawRecognizer(horizonY);

        ctx.save();
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#00f3ff';
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(width, horizonY);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        const gridColor = 'rgba(0, 243, 255, ';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00f3ff';

        const centerX = width * 0.5;
        const numLines = 36;
        for (let i = -numLines; i <= numLines; i++) {
          const xBottom = centerX + i * 50;
          ctx.strokeStyle = gridColor + (0.15 + (1 - Math.abs(i)/numLines) * 0.35) + ')';
          ctx.beginPath();
          ctx.moveTo(centerX, horizonY);
          ctx.lineTo(xBottom, height);
          ctx.stroke();
        }

        tronGridOffset = (tronGridOffset + 1.2) % 40;
        const numZLines = 18;
        for (let j = 0; j < numZLines; j++) {
          const p = Math.pow((j * 40 + tronGridOffset) / (numZLines * 40), 2.2);
          const y = horizonY + p * (height - horizonY);
          ctx.strokeStyle = gridColor + (p * 0.6) + ')';
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.restore();

        for (const cycle of tronCycles) {
          cycle.update();
          cycle.draw();
        }

      } else if (currentTheme === 'cyber') {
        // CYBERPUNK 2077 THEME
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#040508');
        skyGrad.addColorStop(0.5, '#0a0d16');
        skyGrad.addColorStop(1, '#1a0b1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        for (const b of buildings) {
          ctx.save();
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.strokeRect(b.x, b.y, b.w, b.h);

          if (b.hasSpire) {
            ctx.strokeStyle = '#ff003c';
            ctx.shadowColor = '#ff003c';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(b.x + b.w/2, b.y);
            ctx.lineTo(b.x + b.w/2, b.y - 30);
            ctx.stroke();

            if (Math.floor(Date.now() / 400) % 2 === 0) {
              ctx.fillStyle = '#ff003c';
              ctx.beginPath();
              ctx.arc(b.x + b.w/2, b.y - 30, 2, 0, Math.PI*2);
              ctx.fill();
            }
          }

          for (const win of b.windows) {
            ctx.fillStyle = win.color;
            ctx.shadowColor = win.color;
            ctx.shadowBlur = 3;
            ctx.fillRect(b.x + win.x, b.y + win.y, 4, 6);
          }
          ctx.restore();
        }

        for (const holo of holograms) {
          ctx.save();
          const flicker = Math.sin(Date.now() * 0.008 + holo.flicker * 10) > 0.05;
          if (flicker) {
            ctx.font = 'bold 11px "Orbitron", sans-serif';
            ctx.fillStyle = holo.color;
            ctx.shadowColor = holo.color;
            ctx.shadowBlur = 12;
            ctx.fillText(holo.text, holo.x, holo.y);
            ctx.strokeStyle = holo.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(holo.x - 3, holo.y - 12, holo.text.length * 8.5, 16);
          }
          ctx.restore();
        }

        for (const av of cyberAVs) {
          av.update();
          av.draw();
        }

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
        ctx.lineWidth = 1;
        for (const drop of rainDrops) {
          drop.y += drop.speed;
          drop.x -= drop.speed * 0.18;
          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * (width + 100);
          }
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - drop.len * 0.18, drop.y + drop.len);
          ctx.stroke();
        }
        ctx.restore();

      } else if (currentTheme === 'topgear') {
        // TOP GEAR '92 THEME
        drawTopGearScene();
      } else if (currentTheme === 'cs') {
        // COUNTER-STRIKE DE_DUST2 THEME
        drawCSSystem();
      } else if (currentTheme === 'gta') {
        // GRAND THEFT AUTO VI THEME
        drawGTAScene();
      } else if (currentTheme === 'noir') {
        // SPIDER-MAN NOIR THEME
        drawSpiderNoirScene();
      } else if (currentTheme === 'simpsons') {
        // THE SIMPSONS SPRINGFIELD THEME
        drawSimpsonsScene();
      } else if (currentTheme === 'pacman') {
        // PAC-MAN 1980 ARCADE THEME
        drawPacmanScene();
      }

      requestAnimationFrame(renderWorld);
    }

    renderWorld();

// Safe element getters
function getEl(id) {
  return document.getElementById(id);
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("anythingdown_theme", theme);

  const body = document.body;
  const themeName = getEl("themeName");
  const hazardLine = getEl("hazardLine");
  const topgearStrip = getEl("topgearStrip");
  const csStrip = getEl("csStrip");
  const gtaStrip = getEl("gtaStrip");
  const noirStrip = getEl("noirStrip");
  const simpsonsStrip = getEl("simpsonsStrip");
  const pacmanStrip = getEl("pacmanStrip");
  const identityDiscIcon = getEl("identityDiscIcon");
  const tronStatusText = getEl("tronStatusText");
  const cyberdeckBadge = getEl("cyberdeckBadge");
  const topgearBadge = getEl("topgearBadge");
  const csBadge = getEl("csBadge");
  const gtaBadge = getEl("gtaBadge");
  const noirBadge = getEl("noirBadge");
  const simpsonsBadge = getEl("simpsonsBadge");
  const pacmanBadge = getEl("pacmanBadge");
  const spawnIcon = getEl("spawnIcon");
  const spawnText = getEl("spawnText");
  const btnSpawnEntity = getEl("btnSpawnEntity");
  const subTitle = getEl("subTitle");
  const terminalHeader = getEl("terminalHeader");
  const footerUser = getEl("footerUser");
  const footerNode = getEl("footerNode");
  const bottomCredits = getEl("bottomCredits");
  const botsStatusText = getEl("botsStatusText");
  const tgBotTag = getEl("tgBotTag");
  const waBotTag = getEl("waBotTag");

  const page = window.PAGE_TYPE || "home";

  // Hide all strips and badges first
  if (hazardLine) hazardLine.style.display = "none";
  if (topgearStrip) topgearStrip.style.display = "none";
  if (csStrip) csStrip.style.display = "none";
  if (gtaStrip) gtaStrip.style.display = "none";
  if (noirStrip) noirStrip.style.display = "none";
  if (simpsonsStrip) simpsonsStrip.style.display = "none";
  if (pacmanStrip) pacmanStrip.style.display = "none";

  if (identityDiscIcon) identityDiscIcon.style.display = "none";
  if (tronStatusText) tronStatusText.style.display = "none";
  if (cyberdeckBadge) cyberdeckBadge.style.display = "none";
  if (topgearBadge) topgearBadge.style.display = "none";
  if (csBadge) csBadge.style.display = "none";
  if (gtaBadge) gtaBadge.style.display = "none";
  if (noirBadge) noirBadge.style.display = "none";
  if (simpsonsBadge) simpsonsBadge.style.display = "none";
  if (pacmanBadge) pacmanBadge.style.display = "none";

  if (theme === "pacman") {
    body.className = "theme-pacman";
    if (themeName) themeName.textContent = "PAC-MAN '80";
    if (pacmanStrip) pacmanStrip.style.display = "block";
    if (pacmanBadge) pacmanBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-ghost";
    if (spawnText) spawnText.textContent = "WAKA!";
    if (btnSpawnEntity) btnSpawnEntity.title = "Comer Fantasma / Chomp Waka-Waka!";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "PAC-MAN ARCADE • REGRAS DO LABIRINTO 1980 • MOEDA 1UP INSERIDA";
      else if (page === "privacy") subTitle.textContent = "ALTO SCORE PROTEGIDO • NENHUM FANTASMA RASTREIA SEUS DADOS";
      else if (page === "license") subTitle.textContent = "LICENÇA RETRO ARCADE • CÓDIGO ABERTO MIDWAY / NAMCO 1980";
      else subTitle.textContent = "PAC-MAN ARCADE • LABIRINTO NEON 1980 • POWER PELLET MEDIA EXTRACTION";
    }
    if (terminalHeader) terminalHeader.textContent = "> PAC_CPU // 1UP READY: INSERINDO MOEDA NO FLIPERAMA...";
    if (footerUser) footerUser.innerHTML = "PLAYER 1: <b>PAC-MAN (HIGH SCORE: 3,333,360)</b>";
    if (footerNode) footerNode.innerHTML = "CABINET: <b>MIDWAY ARCADE // LEVEL 256 CHERRY</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"WAKA WAKA WAKA!" &bull; PAC-MAN &copy; 1980 BANDAI NAMCO &bull; ANYTHING // DOWN';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // INKY & BLINKY CLOUD DISPATCH";
    if (tgBotTag) tgBotTag.textContent = "ARCADE BOT";
    if (waBotTag) waBotTag.textContent = "WAKA BOT";

  } else if (theme === "simpsons") {
    body.className = "theme-simpsons";
    if (themeName) themeName.textContent = "THE SIMPSONS";
    if (simpsonsStrip) simpsonsStrip.style.display = "block";
    if (simpsonsBadge) simpsonsBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-circle-dot";
    if (spawnText) spawnText.textContent = "+DONUT!";
    if (btnSpawnEntity) btnSpawnEntity.title = "Chuva de Donuts do Homer / D'OH!";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "SPRINGFIELD • REGULAMENTOS DA CIDADE • TERMOS DO PREFEITO QUIMBY";
      else if (page === "privacy") subTitle.textContent = "USINA DE SPRINGFIELD • ZERO VAZAMENTO RADIOATIVO • SIGILO TOTAL";
      else if (page === "license") subTitle.textContent = "LICENÇA ABERTA DE SPRINGFIELD • CÓDIGO LIVRE DO PROFESSOR FRINK";
      else subTitle.textContent = "SPRINGFIELD • USINA NUCLEAR SETOR 7G • CENTRAL DE DOWNLOAD DO HOMER";
    }
    if (terminalHeader) terminalHeader.textContent = "> SETOR_7G // ALERTA: HOMER PRESSIONOU O BOTÃO DE DOWNLOAD...";
    if (footerUser) footerUser.innerHTML = "OPERADOR: <b>HOMER J. SIMPSON (INSPETOR 7G)</b>";
    if (footerNode) footerNode.innerHTML = "LOCAL: <b>SPRINGFIELD NUCLEAR PLANT // SECTOR 7G</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"MMMM... DONUTS." &bull; THE SIMPSONS &copy; 20TH TELEVISION &bull; ANYTHING // DOWN';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // DUFF BEER DELIVERY EXPRESS";
    if (tgBotTag) tgBotTag.textContent = "MOE'S TAVERN";
    if (waBotTag) waBotTag.textContent = "KWIK-E-MART";

  } else if (theme === "noir") {
    body.className = "theme-noir";
    if (themeName) themeName.textContent = "SPIDER-NOIR '33";
    if (noirStrip) noirStrip.style.display = "block";
    if (noirBadge) noirBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-spider";
    if (spawnText) spawnText.textContent = "THWIP!";
    if (btnSpawnEntity) btnSpawnEntity.title = "Disparar Teia de Aranha no Vento / Câmera 1933";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "CASE FILE #1933 • PRIVATE EYE CODE • STREET JUSTICE";
      else if (page === "privacy") subTitle.textContent = "CONFIDENTIAL INTEL • BURN AFTER READING • NYC POLICE BLACKOUT";
      else if (page === "license") subTitle.textContent = "DAILY BUGLE PRESS PASS • 1933 OPEN INVESTIGATION PERMIT";
      else subTitle.textContent = "NEW YORK 1933 • PRIVATE EYE INVESTIGATOR • MEDIA EXTRACTION BUREAU";
    }
    if (terminalHeader) terminalHeader.textContent = "> POLICE SCANNER // 'WHEREVER I GO, THE WIND FOLLOWS...'";
    if (footerUser) footerUser.innerHTML = "DETECTIVE: <b>PETER PARKER (SPIDER-MAN NOIR)</b>";
    if (footerNode) footerNode.innerHTML = "LOCATION: <b>BOWERY DISTRICT // DAILY BUGLE ROOFTOP</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"IS THAT A RUBIK\'S CUBE?" &bull; SPIDER-MAN NOIR &copy; MARVEL &bull; ANYTHING // DOWN';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // INVESTIGAÇÃO POLICIAL 1933";
    if (tgBotTag) tgBotTag.textContent = "CASO EM ANDAMENTO";
    if (waBotTag) waBotTag.textContent = "CONFIDENCIAL";

  } else if (theme === "gta") {
    body.className = "theme-gta";
    if (themeName) themeName.textContent = "GTA VI // LEONIDA";
    if (gtaStrip) gtaStrip.style.display = "block";
    if (gtaBadge) gtaBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-helicopter";
    if (spawnText) spawnText.textContent = "WANTED +1";
    if (btnSpawnEntity) btnSpawnEntity.title = "Aumentar Nível de Procurado / Sirenes da VCPD";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "VICE CITY CODE • STATE OF LEONIDA LAWS • REGULATORY PROTOCOL";
      else if (page === "privacy") subTitle.textContent = "OFF THE GRID • NO PAPER TRAILS • STATE OF LEONIDA ZERO RECORD";
      else if (page === "license") subTitle.textContent = "LEONIDA OPEN PASS • MIT FREE SOFTWARE LICENSE • ROCKSTAR SPIRIT";
      else subTitle.textContent = "VICE CITY 2026 • STATE OF LEONIDA • MEDIA EXTRACTION UNDERWORLD";
    }
    if (terminalHeader) terminalHeader.textContent = "> VCPD SCANNER // 'ALL UNITS, SUSPECT ENGAGED ON OCEAN DRIVE'...";
    if (footerUser) footerUser.innerHTML = "OPERATOR: <b>LUCIA & JASON (BONNIE & CLYDE)</b>";
    if (footerNode) footerNode.innerHTML = "DISTRICT: <b>VICE CITY BEACH // STARFISH ISLAND</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"TRUST?" &bull; GRAND THEFT AUTO VI &copy; ROCKSTAR GAMES &bull; ANYTHING // DOWN';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // CHEGANDO EM VICE CITY 2026";
    if (tgBotTag) tgBotTag.textContent = "EM BREVE";
    if (waBotTag) waBotTag.textContent = "EM BREVE";

  } else if (theme === "cs") {
    body.className = "theme-cs";
    if (themeName) themeName.textContent = "CS 1.6 / DUST II";
    if (csStrip) csStrip.style.display = "block";
    if (csBadge) csBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-crosshairs";
    if (spawnText) spawnText.textContent = "FIRE [AK47]";
    if (btnSpawnEntity) btnSpawnEntity.title = "Disparar Rajada de AK-47 / Headshot";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "DE_DUST2 BRIEFING • RULES OF ENGAGEMENT • TACTICAL PROTOCOL";
      else if (page === "privacy") subTitle.textContent = "BLACK OPS PROTOCOL • ZERO RETENTION • CLASSIFIED OPERATION";
      else if (page === "license") subTitle.textContent = "DEFUSE KIT PERMIT • MIT OPEN SOURCE TACTICAL LICENSE";
      else subTitle.textContent = "DE_DUST2 • COUNTER-TERRORIST OPS • MEDIA EXTRACTION TACTICAL UNIT";
    }
    if (terminalHeader) terminalHeader.textContent = "> RADIO // 'BOMB HAS BEEN PLANTED' - CT FORCES MOVING IN...";
    if (footerUser) footerUser.innerHTML = "OPERATOR: <b>SEAL TEAM 6 (CT)</b>";
    if (footerNode) footerNode.innerHTML = "LOCATION: <b>DE_DUST2 // BOMBSITE A</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"OK, LET\'S GO!" &bull; COUNTER-STRIKE &copy; VALVE &bull; ANYTHING // DOWN';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // REFORÇOS TÁTICOS A CAMINHO";
    if (tgBotTag) tgBotTag.textContent = "ETA: EM BREVE";
    if (waBotTag) waBotTag.textContent = "STANDBY CT";

  } else if (theme === "topgear") {
    body.className = "theme-topgear";
    if (themeName) themeName.textContent = "TOP GEAR '92";
    if (topgearStrip) topgearStrip.style.display = "block";
    if (topgearBadge) topgearBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-fire";
    if (spawnText) spawnText.textContent = "NITRO!";
    if (btnSpawnEntity) btnSpawnEntity.title = "Acionar Nitro no Supercarro";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "SUPER NINTENDO 1992 • TRACK RULES • FAIR PLAY REGULATIONS";
      else if (page === "privacy") subTitle.textContent = "PIT STOP CONFIDENTIAL • ZERO TELEMETRY LOG • DRIVER PRIVACY";
      else if (page === "license") subTitle.textContent = "1ST PLACE TROPHY • 1992 16-BIT PUBLIC DOMAIN LICENSE";
      else subTitle.textContent = "SUPER NINTENDO 1992 • CANNIBAL SPEEDWAY • MEDIA EXTRACTION UNIT";
    }
    if (terminalHeader) terminalHeader.textContent = "> CHECKPOINT 1 // QUALIFYING IN PROGRESS...";
    if (footerUser) footerUser.innerHTML = "DRIVER: <b>PLAYER 1 (RED CANNIBAL)</b>";
    if (footerNode) footerNode.innerHTML = "TRACK: <b>MONACO CIRCUIT LAP 1/3</b>";
    if (bottomCredits) bottomCredits.innerHTML = 'READY... SET... GO! &bull; TOP GEAR &copy; 1992 KEMCO &bull; ANYTHING // DOWN';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // CIRCUITO BÔNUS BLOQUEADO";
    if (tgBotTag) tgBotTag.textContent = "CIRCUITO 2";
    if (waBotTag) waBotTag.textContent = "BLOQUEADO";

  } else if (theme === "cyber") {
    body.className = "theme-cyber";
    if (themeName) themeName.textContent = "CYBERPUNK 2077";
    if (hazardLine) hazardLine.style.display = "block";
    if (cyberdeckBadge) cyberdeckBadge.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-plane-up";
    if (spawnText) spawnText.textContent = "+AV";
    if (btnSpawnEntity) btnSpawnEntity.title = "Disparar Carro Voador (AV) em Night City";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "NIGHT CITY 2077 • NETRUNNER DIRECTIVE • TERMS OF ACCESS";
      else if (page === "privacy") subTitle.textContent = "ICE SHIELD ACTIVATED • ZERO CYBERDECK LOGS • NETRUNNER STEALTH";
      else if (page === "license") subTitle.textContent = "OPEN QUICKHACK CODE • FREE PUBLIC CYBERWARE 2077";
      else subTitle.textContent = "NIGHT CITY 2077 • NETRUNNER PROTOCOL • MEDIA EXTRACTION UNIT";
    }
    if (terminalHeader) terminalHeader.textContent = "> BREACH_PROTOCOL // INITIALIZING QUICKHACK DAEMON...";
    if (footerUser) footerUser.innerHTML = "NETRUNNER: <b>V // ARASAKA INFILTRATOR</b>";
    if (footerNode) footerNode.innerHTML = "SUBNET: <b>PACIFICA ICE GATE 3001</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"WAKE THE F**K UP, SAMURAI." &bull; ANYTHING // DOWN &copy; 2026';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // QUICKHACK EM DESENVOLVIMENTO";
    if (tgBotTag) tgBotTag.textContent = "NETRUNNER // EM BREVE";
    if (waBotTag) waBotTag.textContent = "CORPO // EM BREVE";

  } else {
    // TRON '82 (Default)
    body.className = "theme-retro";
    if (themeName) themeName.textContent = "TRON '82";
    if (identityDiscIcon) identityDiscIcon.style.display = "inline-flex";
    if (tronStatusText) tronStatusText.style.display = "block";

    if (spawnIcon) spawnIcon.className = "fa-solid fa-motorcycle";
    if (spawnText) spawnText.textContent = "+MOTO";
    if (btnSpawnEntity) btnSpawnEntity.title = "Disparar Moto de Luz na Grid";

    if (subTitle) {
      if (page === "terms") subTitle.textContent = "THE GRID • ENCOM MAINFRAME DIRECTIVE • USER TERMS PROTOCOL";
      else if (page === "privacy") subTitle.textContent = "THE GRID • I/O TOWER DATA SHIELD • ZERO AUDIT FOOTPRINT";
      else if (page === "license") subTitle.textContent = "FLYNN LIVES • OPEN SOURCE ENCOM CORE LICENSE 2026";
      else subTitle.textContent = "THE GRID • ENCOM MAINFRAME RECOGNIZER • MEDIA EXTRACTION UNIT";
    }
    if (terminalHeader) terminalHeader.textContent = "> MCP.DEREZ // REQUISITANDO ACESSO AO I/O TOWER...";
    if (footerUser) footerUser.innerHTML = "USER: <b>FLYNN // ACTIVE</b>";
    if (footerNode) footerNode.innerHTML = "MCP GRID: <b>I/O TOWER 3001</b>";
    if (bottomCredits) bottomCredits.innerHTML = '"THE GRID. A DIGITAL FRONTIER." &bull; ANYTHING // DOWN &copy; 2026';
    if (botsStatusText) botsStatusText.textContent = "EM BREVE // SECTOR 7G COMPILING";
    if (tgBotTag) tgBotTag.textContent = "COMPILANDO...";
    if (waBotTag) waBotTag.textContent = "EM BREVE";
  }

  // Update dynamic animated favicon for current theme
  FaviconEngine.setTheme(theme);
}

// =========================================================================
// DYNAMIC ANIMATED FAVICON ENGINE
// Draws canvas frames in memory and updates <link rel="icon">
// =========================================================================
const FaviconEngine = (() => {
  let timer = null;
  let frame = 0;
  let activeTheme = 'retro';
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  function getLink() {
    let link = document.getElementById('dynamic-favicon');
    if (!link) {
      link = document.createElement('link');
      link.id = 'dynamic-favicon';
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }
    return link;
  }

  function updateIcon() {
    ctx.clearRect(0, 0, size, size);
    frame++;

    switch (activeTheme) {
      case 'pacman': {
        // Animated Pac-Man champing mouth + yellow glow
        const mouthAngle = 0.2 + 0.25 * Math.abs(Math.sin(frame * 0.25));
        ctx.fillStyle = '#FFE600';
        ctx.beginPath();
        ctx.arc(16, 16, 14, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
        ctx.lineTo(16, 16);
        ctx.fill();

        // Pac-Man eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(16, 9, 2, 0, Math.PI * 2);
        ctx.fill();

        // Pellet floating ahead
        if (Math.sin(frame * 0.25) > 0) {
          ctx.fillStyle = '#FFB897';
          ctx.beginPath();
          ctx.arc(28, 16, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'simpsons': {
        // Pink Glazed Homer Donut with sprinkles spinning
        const angle = frame * 0.08;
        ctx.save();
        ctx.translate(16, 16);
        ctx.rotate(angle);

        // Dough base
        ctx.fillStyle = '#DE9B52';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Pink frosting
        ctx.fillStyle = '#FF599C';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Donut center hole
        ctx.fillStyle = '#0f1423';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Colorful sprinkles
        const sprinkles = [
          { x: -7, y: -6, color: '#00F0FF', rot: 0.4 },
          { x: 6, y: -6, color: '#FFE600', rot: -0.3 },
          { x: 7, y: 5, color: '#39FF14', rot: 0.6 },
          { x: -6, y: 6, color: '#FFFFFF', rot: -0.8 },
          { x: 0, y: -9, color: '#FF3366', rot: 0.1 },
        ];
        sprinkles.forEach(s => {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.fillStyle = s.color;
          ctx.fillRect(-2, -1, 4, 2);
          ctx.restore();
        });

        ctx.restore();
        break;
      }

      case 'gta': {
        // Vice City Neon Palm Tree + Pink/Cyan sunset pulse
        const pulse = Math.sin(frame * 0.15) * 2;
        ctx.save();
        // Neon gradient circle background
        const grad = ctx.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, '#FF1493');
        grad.addColorStop(1, '#00F5D4');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();

        // Silhouette Palm Tree
        ctx.fillStyle = '#0a0518';
        ctx.beginPath();
        // Trunk
        ctx.moveTo(15, 28);
        ctx.quadraticCurveTo(18, 20, 16, 14);
        ctx.lineTo(14, 14);
        ctx.quadraticCurveTo(16, 20, 13, 28);
        ctx.fill();
        // Palm Fronds
        ctx.beginPath();
        ctx.arc(15, 14, 7 + pulse * 0.3, Math.PI, 0, false);
        ctx.fill();
        ctx.restore();
        break;
      }

      case 'cs': {
        // CS C4 Explosive blinking red diode (Beep... beep... beep!)
        const isBlink = Math.floor(frame / 6) % 2 === 0;
        ctx.fillStyle = '#1c2419';
        // C4 Clay block
        ctx.fillRect(4, 8, 24, 16);
        ctx.strokeStyle = '#3e4a38';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(4, 8, 24, 16);

        // Digital display
        ctx.fillStyle = '#0a0d09';
        ctx.fillRect(7, 11, 10, 10);
        ctx.fillStyle = '#5bf336';
        ctx.font = 'bold 7px monospace';
        ctx.fillText('73', 8, 18);

        // Blinking Red LED Light
        ctx.beginPath();
        ctx.arc(22, 16, isBlink ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isBlink ? '#ff1a1a' : '#550000';
        ctx.shadowColor = isBlink ? '#ff0000' : 'transparent';
        ctx.shadowBlur = isBlink ? 8 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }

      case 'topgear': {
        // Spinning Sports Car Wheel / Tachometer Needle revving
        ctx.save();
        ctx.translate(16, 16);

        // Tire outer ring
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Red racing rim
        ctx.strokeStyle = '#e60000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.stroke();

        // 4 Spinning spokes
        const wheelAngle = frame * 0.25;
        ctx.rotate(wheelAngle);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(10, 0);
          ctx.stroke();
          ctx.rotate(Math.PI / 2);
        }

        // Center hub
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }

      case 'noir': {
        // Spider-Man Noir Spider Insignia pulsing with fedora eye gleam
        const pulse = 13 + Math.sin(frame * 0.15) * 1.5;
        ctx.save();
        // Dark badge
        ctx.fillStyle = '#0a0a0c';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Monochrome glowing spider web / eyes
        ctx.fillStyle = '#f0f0f0';
        // Left Eye Angle
        ctx.beginPath();
        ctx.moveTo(9, 13);
        ctx.lineTo(14, 18);
        ctx.lineTo(13, 11);
        ctx.closePath();
        ctx.fill();
        // Right Eye Angle
        ctx.beginPath();
        ctx.moveTo(23, 13);
        ctx.lineTo(18, 18);
        ctx.lineTo(19, 11);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        break;
      }

      case 'cyber': {
        // Cyberpunk 2077 Glitching Neon Diamond / Samurai skull pulse
        const glitchX = (Math.random() - 0.5) * (frame % 8 === 0 ? 3 : 0);
        ctx.save();
        ctx.translate(16 + glitchX, 16);

        // Yellow diamond background
        ctx.fillStyle = '#FCEE09';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(14, 0);
        ctx.lineTo(0, 14);
        ctx.lineTo(-14, 0);
        ctx.closePath();
        ctx.fill();

        // Cyan cyber circuit slash
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-8, -2);
        ctx.lineTo(8, -2);
        ctx.moveTo(-4, 4);
        ctx.lineTo(6, 4);
        ctx.stroke();

        // Black core dot
        ctx.fillStyle = '#000000';
        ctx.fillRect(-2, -3, 4, 6);

        ctx.restore();
        break;
      }

      case 'retro':
      default: {
        // TRON Identity Disc Pulsing with Cyan Neon Glow
        const pulse = 12 + Math.sin(frame * 0.12) * 1.8;
        ctx.save();
        ctx.translate(16, 16);

        // Dark digital background
        ctx.fillStyle = '#020b14';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Neon Cyan Outer Ring
        ctx.strokeStyle = '#00f2ff';
        ctx.shadowColor = '#00f2ff';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Disc Core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        break;
      }
    }

    try {
      const link = getLink();
      link.href = canvas.toDataURL('image/png');
    } catch(e) {}
  }

  function setTheme(theme) {
    activeTheme = theme;
    frame = 0;
    if (timer) clearInterval(timer);
    updateIcon();
    // 10 FPS is smooth for browser tab icons without CPU load
    timer = setInterval(updateIcon, 100);
  }

  return { setTheme };
})();

// =========================================================================
// ACTIVITY STAGE ANIMATION CONTROLLER (ANALYZE & DOWNLOAD MODES)
// =========================================================================
const ActivityStage = (() => {
  let animId = null;
  let mode = null; // 'analyze' | 'download'
  let progress = 0; // 0 to 100
  let targetProgress = 0;
  let frame = 0;

  function getElements() {
    return {
      stage: document.getElementById('activityStage'),
      title: document.getElementById('activityTitle'),
      percent: document.getElementById('activityPercent'),
      canvas: document.getElementById('activityCanvas'),
      bar: document.getElementById('activityProgressBar'),
      status: document.getElementById('activityStatus')
    };
  }

  function start(activityMode) {
    mode = activityMode;
    progress = 0;
    targetProgress = mode === 'analyze' ? 95 : 99;
    frame = 0;

    const els = getElements();
    if (!els.stage || !els.canvas) return;

    els.stage.style.display = 'block';
    updateThemeLabels();

    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function updateThemeLabels() {
    const els = getElements();
    if (!els.title || !els.status) return;

    if (mode === 'analyze') {
      switch (currentTheme) {
        case 'pacman':
          els.title.textContent = '👾 PAC-RADAR // RASTREANDO STREAM';
          els.status.textContent = 'DEVORANDO PONTOS & DESVENDANDO LABIRINTO...';
          break;
        case 'simpsons':
          els.title.textContent = '🍩 SETOR 7G // PROCESSANDO LINK';
          els.status.textContent = 'HOMER TESTANDO TEMPERATURA DO REATOR NUCLEAR...';
          break;
        case 'cs':
          els.title.textContent = '💣 C4 TACTICAL SCAN // RECONHECIMENTO';
          els.status.textContent = 'VARRENDO BOMBSITE & DECRIPTANDO PAYLOAD...';
          break;
        case 'gta':
          els.title.textContent = '🌴 LEONIDA POLICE SCANNER // INTERCEPT';
          els.status.textContent = 'RASTREANDO FREQUÊNCIA DA MÍDIA EM VICE CITY...';
          break;
        case 'topgear':
          els.title.textContent = '🏎️ TELEMETRIA PIT-STOP // LEITURA ECU';
          els.status.textContent = 'AQUECENDO PNEUS & ANALISANDO DADOS DA PISTA...';
          break;
        case 'noir':
          els.title.textContent = '🕷️ INVESTIGAÇÃO NOIR // ARQUIVO CONFIDENCIAL';
          els.status.textContent = 'SEGUINDO RASTRO NA NOITE CHUVOSA DE NY...';
          break;
        case 'cyber':
          els.title.textContent = '⚡ BREACH PROTOCOL // ARASAKA ICE-BREAKER';
          els.status.textContent = 'INJETANDO QUICKHACK DE DECRIPTAÇÃO NO SUBNET...';
          break;
        case 'retro':
        default:
          els.title.textContent = '🌐 RECOGNIZER SCAN // ENCOM MAINFRAME';
          els.status.textContent = 'DIGITALIZANDO SINAL DO I/O TOWER VIA TRON GRID...';
          break;
      }
    } else { // download
      switch (currentTheme) {
        case 'pacman':
          els.title.textContent = '🍒 BONUS FRUIT EXTRACTION // HIGH SCORE';
          els.status.textContent = 'ENGOLINDO DADOS // FANTASMAS AZUIS DERROTADOS!';
          break;
        case 'simpsons':
          els.title.textContent = '⚡ FLUXO NUCLEAR CONCLUÍDO // D\'OH SALVO!';
          els.status.textContent = 'ENCHENDO OS TANQUES DE ENERGIA... WOO-HOO!';
          break;
        case 'cs':
          els.title.textContent = '🛡️ BOMB DEFUSED // MISSION ACCOMPLISHED';
          els.status.textContent = 'EXTRAINDO ARQUIVO FINAL... COUNTER-TERRORISTS WIN!';
          break;
        case 'gta':
          els.title.textContent = '⭐ 5 ESTRELAS // MISSION PASSED: RESPECT +';
          els.status.textContent = 'DISPARANDO CONTEÚDO VIA RÁDIO FLASH FM...';
          break;
        case 'topgear':
          els.title.textContent = '🏁 BANDEIRA QUADRICULADA // POLE POSITION!';
          els.status.textContent = 'CRUZANDO A LINHA DE CHEGADA A 300 KM/H...';
          break;
        case 'noir':
          els.title.textContent = '📸 CASO ARQUIVADO // EVIDÊNCIA COLETADA';
          els.status.textContent = 'REVELANDO NEGATIVOS NO QUARTO ESCURO...';
          break;
        case 'cyber':
          els.title.textContent = '💾 CYBERDECK BUFFER SYNC // RAM 100%';
          els.status.textContent = 'PAYLOAD BAIXADO PARA MEMÓRIA NEURAL... CHUMBA!';
          break;
        case 'retro':
        default:
          els.title.textContent = '💿 DISC COMPLETED // FLYNN LIVES';
          els.status.textContent = 'TRANSFERINDO BITS DE VÍDEO PELOS CIRCUITOS MCP...';
          break;
      }
    }
  }

  function setProgress(val) {
    targetProgress = Math.min(100, Math.max(0, val));
  }

  function complete(callback) {
    targetProgress = 100;
    progress = 100;
    const els = getElements();
    if (els.bar) els.bar.style.width = '100%';
    if (els.percent) els.percent.textContent = '100%';
    setTimeout(() => {
      stop();
      if (callback) callback();
    }, 600);
  }

  function stop() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    mode = null;
    const els = getElements();
    if (els.stage) els.stage.style.display = 'none';
  }

  function renderCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    frame++;

    const pRatio = progress / 100;
    const activePos = 30 + pRatio * (width - 60);

    switch (currentTheme) {
      case 'pacman': {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#2121de';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, 15); ctx.lineTo(width - 10, 15);
        ctx.moveTo(10, height - 15); ctx.lineTo(width - 10, height - 15);
        ctx.stroke();

        const cy = height / 2;

        if (mode === 'analyze') {
          for (let x = 30; x < width - 20; x += 24) {
            if (x > activePos + 8) {
              ctx.fillStyle = '#FFB897';
              ctx.beginPath();
              ctx.arc(x, cy, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          const chomp = 0.25 * Math.abs(Math.sin(frame * 0.3));
          ctx.fillStyle = '#FFE600';
          ctx.beginPath();
          ctx.arc(activePos, cy, 14, chomp * Math.PI, (2 - chomp) * Math.PI);
          ctx.lineTo(activePos, cy);
          ctx.fill();

          const ghostX = Math.max(20, activePos - 45);
          drawGhost(ctx, ghostX, cy - 10, '#ff0000');
        } else {
          const ghostX = Math.min(width - 25, activePos + 35);
          const isFlashing = Math.floor(frame / 6) % 2 === 0;
          drawGhost(ctx, ghostX, cy - 10, isFlashing ? '#0000ff' : '#ffffff');

          const chomp = 0.3 * Math.abs(Math.sin(frame * 0.35));
          ctx.fillStyle = '#FFE600';
          ctx.beginPath();
          ctx.arc(activePos, cy, 14, chomp * Math.PI, (2 - chomp) * Math.PI);
          ctx.lineTo(activePos, cy);
          ctx.fill();
        }
        break;
      }

      case 'simpsons': {
        ctx.fillStyle = '#001a33';
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        ctx.strokeStyle = '#334d66';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(15, cy); ctx.lineTo(width - 15, cy);
        ctx.stroke();

        ctx.strokeStyle = '#39FF14';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#39FF14';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(15, cy); ctx.lineTo(activePos, cy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.save();
        ctx.translate(activePos, cy);
        ctx.rotate(frame * 0.1);
        ctx.fillStyle = '#DE9B52';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF599C';
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#001a33';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }

      case 'cs': {
        ctx.fillStyle = '#0a0f08';
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        const radarX = 45;
        ctx.strokeStyle = '#2d5a27';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(radarX, cy, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(radarX, cy, 11, 0, Math.PI * 2);
        ctx.stroke();

        const sweepAngle = frame * 0.08;
        ctx.strokeStyle = '#5bf336';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(radarX, cy);
        ctx.lineTo(radarX + Math.cos(sweepAngle) * 22, cy + Math.sin(sweepAngle) * 22);
        ctx.stroke();

        const barX = 85;
        const barW = width - 100;
        ctx.fillStyle = '#1c2618';
        ctx.fillRect(barX, cy - 8, barW, 16);
        ctx.strokeStyle = '#5bf336';
        ctx.strokeRect(barX, cy - 8, barW, 16);

        ctx.fillStyle = '#5bf336';
        ctx.fillRect(barX + 2, cy - 6, (barW - 4) * pRatio, 12);

        const isBlink = Math.floor(frame / 5) % 2 === 0;
        ctx.fillStyle = isBlink ? '#ff2222' : '#550000';
        ctx.shadowColor = isBlink ? '#ff0000' : 'transparent';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(barX + (barW - 4) * pRatio, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }

      case 'gta': {
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#190a2c');
        grad.addColorStop(0.5, '#7b1161');
        grad.addColorStop(1, '#ff6a00');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        ctx.strokeStyle = '#00F5D4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00F5D4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(10, cy + 12); ctx.lineTo(width - 10, cy + 12);
        ctx.stroke();
        ctx.shadowBlur = 0;

        const carX = activePos;
        ctx.fillStyle = '#FF1493';
        ctx.shadowColor = '#FF1493';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(carX - 20, cy + 10);
        ctx.lineTo(carX + 15, cy + 10);
        ctx.lineTo(carX + 8, cy + 2);
        ctx.lineTo(carX - 8, cy + 2);
        ctx.lineTo(carX - 16, cy + 6);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
        ctx.beginPath();
        ctx.moveTo(carX + 15, cy + 7);
        ctx.lineTo(carX + 50, cy + 3);
        ctx.lineTo(carX + 50, cy + 11);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'topgear': {
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(10, cy - 14, width - 20, 28);

        const finX = width - 25;
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = (i % 2 === 0) ? '#ffffff' : '#000000';
          ctx.fillRect(finX, cy - 14 + i * 7, 10, 7);
        }

        const carX = activePos;
        ctx.fillStyle = '#e60000';
        ctx.fillRect(carX - 18, cy - 7, 24, 14);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(carX - 2, cy - 5, 8, 10);

        const flameLength = 12 + Math.random() * 10;
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.moveTo(carX - 18, cy - 4);
        ctx.lineTo(carX - 18 - flameLength, cy);
        ctx.lineTo(carX - 18, cy + 4);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'noir': {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, cy - 18, width - 20, 36);

        for (let x = 16; x < width - 15; x += 16) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, cy - 16, 6, 4);
          ctx.fillRect(x, cy + 12, 6, 4);
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(activePos, cy, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText('NOIR', activePos - 12, cy + 3);
        break;
      }

      case 'cyber': {
        ctx.fillStyle = '#050608';
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        ctx.fillStyle = 'rgba(252, 238, 9, 0.25)';
        ctx.font = '9px monospace';
        for (let x = 15; x < width - 20; x += 35) {
          const char = String.fromCharCode(48 + ((frame + x) % 10));
          ctx.fillText(`0x${char}A`, x, cy - 8);
          ctx.fillText(`F${char}`, x, cy + 16);
        }

        ctx.strokeStyle = '#FCEE09';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FCEE09';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(10, cy); ctx.lineTo(activePos, cy);
        ctx.stroke();

        ctx.fillStyle = '#00F0FF';
        ctx.shadowColor = '#00F0FF';
        ctx.fillRect(activePos - 4, cy - 10, 8, 20);
        ctx.shadowBlur = 0;
        break;
      }

      case 'retro':
      default: {
        ctx.fillStyle = '#010612';
        ctx.fillRect(0, 0, width, height);

        const cy = height / 2;

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, cy - 15); ctx.lineTo(width - 10, cy - 15);
        ctx.moveTo(10, cy + 15); ctx.lineTo(width - 10, cy + 15);
        ctx.stroke();

        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(10, cy); ctx.lineTo(activePos, cy);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fillRect(activePos - 12, cy - 6, 16, 12);
        ctx.shadowBlur = 0;
        break;
      }
    }
  }

  function drawGhost(ctx, x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 10, Math.PI, 0, false);
    ctx.lineTo(x + 20, y + 20);
    ctx.lineTo(x + 15, y + 16);
    ctx.lineTo(x + 10, y + 20);
    ctx.lineTo(x + 5, y + 16);
    ctx.lineTo(x, y + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 7, y + 8, 3, 0, Math.PI * 2);
    ctx.arc(x + 13, y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(x + 8, y + 8, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 14, y + 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    if (!mode) return;

    if (progress < targetProgress) {
      progress += (targetProgress - progress) * 0.08 + 0.15;
      if (progress > targetProgress) progress = targetProgress;
    }

    const els = getElements();
    if (els.bar) els.bar.style.width = `${Math.floor(progress)}%`;
    if (els.percent) els.percent.textContent = `${Math.floor(progress)}%`;

    if (els.canvas) {
      const ctx = els.canvas.getContext('2d');
      renderCanvas(ctx, els.canvas.width, els.canvas.height);
    }

    animId = requestAnimationFrame(loop);
  }

  return {
    start,
    setProgress,
    complete,
    stop,
    updateThemeLabels
  };
})();

// Global exposure
window.applyTheme = applyTheme;
window.FaviconEngine = FaviconEngine;
window.ActivityStage = ActivityStage;
window.sfx = sfx;

// Event Listeners for Theme Switching and Controls
document.addEventListener("DOMContentLoaded", () => {
  const btnThemeToggle = getEl("btnThemeToggle");
  const btnAudioToggle = getEl("btnAudioToggle");
  const btnSpawnEntity = getEl("btnSpawnEntity");

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener("click", () => {
      sfx.playTurn();
      let nextTheme = "retro";
      if (currentTheme === "retro") nextTheme = "cyber";
      else if (currentTheme === "cyber") nextTheme = "topgear";
      else if (currentTheme === "topgear") nextTheme = "cs";
      else if (currentTheme === "cs") nextTheme = "gta";
      else if (currentTheme === "gta") nextTheme = "noir";
      else if (currentTheme === "noir") nextTheme = "simpsons";
      else if (currentTheme === "simpsons") nextTheme = "pacman";
      else if (currentTheme === "pacman") nextTheme = "retro";
      applyTheme(nextTheme);
    });
  }

  if (btnSpawnEntity) {
    btnSpawnEntity.addEventListener("click", () => {
      if (currentTheme === "retro") {
        sfx.playTurn();
        const isOrange = Math.random() > 0.5;
        const newCycle = new Lightcycle(
          isOrange ? "#ff6600" : "#00f3ff",
          isOrange ? "#ff3300" : "#00d2ff",
          isOrange
        );
        tronCycles.push(newCycle);
        if (tronCycles.length > 8) tronCycles.shift();
      } else if (currentTheme === "cyber") {
        sfx.playTurn();
        cyberAVs.push(new FlyingAV());
        if (cyberAVs.length > 8) cyberAVs.shift();
      } else if (currentTheme === "topgear") {
        sfx.playNitro();
        nitroActive = true;
        nitroTimer = 110;
        if (nitroCount > 0) nitroCount--;
        const nitroText = getEl("nitroText");
        if (nitroText) nitroText.textContent = "NITRO x" + nitroCount;
      } else if (currentTheme === "cs") {
        fireCSWeapon(width * 0.25 + (Math.random() - 0.5) * 50, height * 0.45 + (Math.random() - 0.5) * 30);
      } else if (currentTheme === "gta") {
        sfx.playGTASiren();
        gtaWantedLevel = (gtaWantedLevel % 5) + 1;
        const stars = document.querySelectorAll("#wantedStars .wanted-star");
        stars.forEach((star, idx) => {
          if (idx < gtaWantedLevel) star.classList.add("active");
          else star.classList.remove("active");
        });
        gtaChopperX = -80;
        sfx.playGTACash();
      } else if (currentTheme === "noir") {
        sfx.playNoirWeb();
        setTimeout(() => sfx.playNoirCamera(), 120);
        for (let i = 0; i < 40; i++) {
          noirRainDrops.push({
            x: Math.random() * (width + 200),
            y: Math.random() * height,
            len: Math.random() * 35 + 25,
            speed: Math.random() * 12 + 18,
            alpha: 0.6
          });
        }
        if (noirRainDrops.length > 200) noirRainDrops.splice(0, 40);
      } else if (currentTheme === "simpsons") {
        sfx.playDoh();
        // Homer Donut Explosion
        for (let i = 0; i < 6; i++) {
          simpsonsDonuts.push({
            x: width * 0.5 + (Math.random() - 0.5) * (width * 0.6),
            y: -50 - Math.random() * 120,
            size: Math.random() * 26 + 22,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            speedY: Math.random() * 2.5 + 2.0,
            wobble: Math.random() * Math.PI * 2
          });
        }
        if (simpsonsDonuts.length > 25) simpsonsDonuts.splice(0, 6);
      } else if (currentTheme === "pacman") {
        sfx.playPacmanWaka();
        setTimeout(() => sfx.playPacmanGhostEat(), 80);
        // Turbo Pac-Man Boost & Score Frenzy
        pacmanSpeed = 7.5;
        setTimeout(() => { pacmanSpeed = 3.6; }, 1200);
        pacmanScore += 200;
        const scoreEl = getEl("pacScore");
        if (scoreEl) scoreEl.textContent = pacmanScore;
        // Re-spawn bonus fruit
        pacmanFruits.push({
          x: width * 0.5 + (Math.random() - 0.5) * (width * 0.5),
          y: height * 0.35 + (Math.random() - 0.5) * (height * 0.2),
          type: 'cherry',
          floatOffset: Math.random() * Math.PI
        });
        if (pacmanFruits.length > 6) pacmanFruits.shift();
      }
    });
  }

  if (btnAudioToggle) {
    btnAudioToggle.addEventListener("click", () => {
      sfx.enabled = !sfx.enabled;
      btnAudioToggle.innerHTML = sfx.enabled 
        ? '<i class="fa-solid fa-volume-high"></i> SFX' 
        : '<i class="fa-solid fa-volume-xmark"></i> MUTE';
      if (sfx.enabled) sfx.playTone(880);
    });
  }

  // Update ActivityStage on theme switch
  if (window.ActivityStage) window.ActivityStage.updateThemeLabels();

  // Initial theme application
  applyTheme(currentTheme);
});

// Immediate execution fallback
if (document.readyState !== "loading") {
  applyTheme(currentTheme);
}
