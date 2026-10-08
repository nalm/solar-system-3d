import * as THREE from 'three';

// 캔버스 기반 프로시저럴 텍스처 생성기 (외부 이미지 의존성 없이 즉시 고화질 렌더링)
export class TextureGenerator {
  // 공통 헬퍼: 노이즈 느낌의 펄린 유사 프랙탈 노이즈
  static createNoisePattern(ctx, width, height, density = 0.5) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 50 * density;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 1. 태양 텍스처 (글로잉 플라즈마, 흑점, 난류)
  static createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 기본 불타는 오렌지/옐로우 그라데이션
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ff9900');
    grad.addColorStop(0.3, '#ffcc00');
    grad.addColorStop(0.5, '#ffdd33');
    grad.addColorStop(0.7, '#ffaa00');
    grad.addColorStop(1, '#ff6600');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 플라즈마 대류 세포 무늬
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 15 + Math.random() * 45;
      const pGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      pGrad.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
      pGrad.addColorStop(0.5, 'rgba(255, 140, 0, 0.25)');
      pGrad.addColorStop(1, 'rgba(200, 50, 0, 0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 흑점 몇 개 배치
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 1024;
      const y = 150 + Math.random() * 200;
      const r = 6 + Math.random() * 12;
      const sGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      sGrad.addColorStop(0, 'rgba(80, 20, 0, 0.7)');
      sGrad.addColorStop(0.7, 'rgba(180, 60, 0, 0.4)');
      sGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // 2. 수성 텍스처 (회색 크레이터, 충돌 분지)
  static createMercuryTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8e8c89';
    ctx.fillRect(0, 0, 1024, 512);

    // 어두운 분지 영역
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 40 + Math.random() * 80;
      const radGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      radGrad.addColorStop(0, '#5a5856');
      radGrad.addColorStop(1, 'rgba(142, 140, 137, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 크레이터들
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = 2 + Math.random() * 8;
      ctx.strokeStyle = 'rgba(230, 230, 230, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(60, 60, 60, 0.3)';
      ctx.beginPath();
      ctx.arc(x + 1, y + 1, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    this.createNoisePattern(ctx, 1024, 512, 0.3);
    return new THREE.CanvasTexture(canvas);
  }

  // 3. 금성 텍스처 (두꺼운 황산 구름 띠)
  static createVenusTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#d1a868');
    grad.addColorStop(0.2, '#eac88a');
    grad.addColorStop(0.5, '#f4dca6');
    grad.addColorStop(0.8, '#deb071');
    grad.addColorStop(1, '#cb9a56');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 대기 소용돌이 밴드
    for (let i = 0; i < 40; i++) {
      const y = Math.random() * 512;
      const h = 10 + Math.random() * 40;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 240, 200, 0.15)' : 'rgba(180, 120, 50, 0.15)';
      ctx.beginPath();
      ctx.ellipse(512, y, 600, h, (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    this.createNoisePattern(ctx, 1024, 512, 0.15);
    return new THREE.CanvasTexture(canvas);
  }

  // 4. 지구 텍스처 (푸른 바다, 대륙, 극지방 얼음)
  static createEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 바다 기본 베이스
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#102e5b');
    oceanGrad.addColorStop(0.5, '#0b407a');
    oceanGrad.addColorStop(1, '#102e5b');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // 대륙 형태 (유라시아/아프리카, 아메리카, 호주 대략적 모사)
    ctx.fillStyle = '#2d6a36'; // 녹색 식생
    const drawLandmass = (cx, cy, rx, ry) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    // 아프리카 & 유라시아
    drawLandmass(550, 240, 160, 110);
    drawLandmass(640, 180, 180, 90);
    // 아메리카
    drawLandmass(240, 180, 120, 80);
    drawLandmass(300, 330, 90, 120);
    // 호주
    drawLandmass(820, 360, 60, 45);

    // 건조 지대 (사하라/내륙 사막 황토색)
    ctx.fillStyle = '#8f7743';
    drawLandmass(520, 220, 80, 40);
    drawLandmass(230, 200, 40, 30);
    drawLandmass(810, 360, 35, 25);

    // 북극 & 남극 빙하
    ctx.fillStyle = '#eef6fc';
    ctx.fillRect(0, 0, 1024, 35);
    ctx.fillRect(0, 475, 1024, 37);

    // 옅은 대기 구름 효과
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * 1024;
      const y = 80 + Math.random() * 340;
      ctx.beginPath();
      ctx.ellipse(x, y, 60 + Math.random() * 90, 15 + Math.random() * 20, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    this.createNoisePattern(ctx, 1024, 512, 0.15);
    return new THREE.CanvasTexture(canvas);
  }

  // 4-1. 달 텍스처
  static createMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#a6a8ab';
    ctx.fillRect(0, 0, 512, 256);

    // 마리아(바다) 어두운 반점
    ctx.fillStyle = '#5f6164';
    for (let i = 0; i < 8; i++) {
      const x = 50 + Math.random() * 400;
      const y = 50 + Math.random() * 150;
      ctx.beginPath();
      ctx.ellipse(x, y, 30 + Math.random() * 40, 20 + Math.random() * 30, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 밝은 크레이터
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + Math.random() * 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.createNoisePattern(ctx, 512, 256, 0.25);
    return new THREE.CanvasTexture(canvas);
  }

  // 5. 화성 텍스처 (녹슨 산화철 붉은 사막, 어두운 고원, 극관)
  static createMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#c1440e');
    grad.addColorStop(0.5, '#d65b20');
    grad.addColorStop(1, '#9e340a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 시르티스 메이저 등 어두운 현무암 지대
    ctx.fillStyle = '#6e2b10';
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * 1024;
      const y = 160 + Math.random() * 200;
      ctx.beginPath();
      ctx.ellipse(x, y, 70 + Math.random() * 90, 40 + Math.random() * 50, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 북극관 / 남극관 (드라이아이스와 얼음)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(512, 15, 280, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(512, 495, 200, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    this.createNoisePattern(ctx, 1024, 512, 0.25);
    return new THREE.CanvasTexture(canvas);
  }

  // 6. 목성 텍스처 (줄무늬 띠, 대적점, 난류 소용돌이)
  static createJupiterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 다양한 색조의 가스 밴드
    const bands = [
      '#a8896c', '#caa685', '#7a5135', '#dfc4a2',
      '#995837', '#e8d7be', '#b26842', '#d5b998',
      '#663f25', '#e0c9ad', '#965a39', '#caa685'
    ];

    let currentY = 0;
    while (currentY < 512) {
      const h = 15 + Math.random() * 35;
      const color = bands[Math.floor(Math.random() * bands.length)];
      ctx.fillStyle = color;
      ctx.fillRect(0, currentY, 1024, h);
      currentY += h;
    }

    // 줄무늬 사이 경계의 웨이브/난류
    for (let i = 0; i < 20; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = 'rgba(240, 220, 190, 0.4)';
      ctx.lineWidth = 4 + Math.random() * 6;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < 1024; x += 40) {
        ctx.lineTo(x, y + Math.sin(x * 0.05) * 6);
      }
      ctx.stroke();
    }

    // 대적점 (Great Red Spot)
    const grsX = 650;
    const grsY = 320;
    const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, 50);
    grsGrad.addColorStop(0, '#c0392b');
    grsGrad.addColorStop(0.6, '#d35400');
    grsGrad.addColorStop(1, 'rgba(211, 84, 0, 0)');
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, 65, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    this.createNoisePattern(ctx, 1024, 512, 0.15);
    return new THREE.CanvasTexture(canvas);
  }

  // 7. 토성 텍스처 (부드러운 황금빛 가스 밴드)
  static createSaturnTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#8c7d58');
    grad.addColorStop(0.2, '#d1be8e');
    grad.addColorStop(0.4, '#e8d4a7');
    grad.addColorStop(0.6, '#ccb682');
    grad.addColorStop(0.8, '#deb97d');
    grad.addColorStop(1, '#9e895c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 섬세하고 균일한 대기 밴드
    for (let y = 0; y < 512; y += 8) {
      ctx.fillStyle = y % 16 === 0 ? 'rgba(255, 245, 215, 0.1)' : 'rgba(100, 80, 40, 0.08)';
      ctx.fillRect(0, y, 1024, 4);
    }

    this.createNoisePattern(ctx, 1024, 512, 0.1);
    return new THREE.CanvasTexture(canvas);
  }

  // 7-1. 토성 고리 텍스처 (카시니 간극, 투명도 그라데이션)
  static createSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // 반경 방향 그라데이션 (안쪽에서 바깥쪽으로)
    const ringGrad = ctx.createLinearGradient(0, 0, 1024, 0);
    ringGrad.addColorStop(0, 'rgba(0,0,0,0)'); // 최내측 투명
    ringGrad.addColorStop(0.08, 'rgba(150, 130, 95, 0.3)'); // C고리
    ringGrad.addColorStop(0.25, 'rgba(215, 195, 145, 0.9)'); // B고리
    ringGrad.addColorStop(0.55, 'rgba(180, 160, 115, 0.85)');
    ringGrad.addColorStop(0.58, 'rgba(0, 0, 0, 0.05)'); // 카시니 간극 (어두움/비어있음)
    ringGrad.addColorStop(0.62, 'rgba(0, 0, 0, 0.05)');
    ringGrad.addColorStop(0.66, 'rgba(200, 180, 135, 0.75)'); // A고리
    ringGrad.addColorStop(0.92, 'rgba(170, 150, 110, 0.6)');
    ringGrad.addColorStop(0.96, 'rgba(90, 80, 60, 0.2)');
    ringGrad.addColorStop(1, 'rgba(0,0,0,0)'); // 최외측 투명

    ctx.fillStyle = ringGrad;
    ctx.fillRect(0, 0, 1024, 64);

    // 미세 홈 텍스처링
    for (let x = 80; x < 980; x += 3) {
      if (Math.random() > 0.4) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fillRect(x, 0, 1.5, 64);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.rotation = Math.PI / 2; // 원형 매핑용
    return texture;
  }

  // 8. 천왕성 텍스처 (신비로운 아쿠아마린/청록색 대기)
  static createUranusTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#58c7db');
    grad.addColorStop(0.5, '#7ee0ea');
    grad.addColorStop(1, '#50bed1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    for (let y = 0; y < 256; y += 12) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, y, 512, 6);
    }

    this.createNoisePattern(ctx, 512, 256, 0.08);
    return new THREE.CanvasTexture(canvas);
  }

  // 8-1. 천왕성 고리 텍스처 (가늘고 희미한 얼음 고리)
  static createUranusRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.3, 'rgba(160, 220, 240, 0.4)');
    grad.addColorStop(0.7, 'rgba(180, 240, 255, 0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.rotation = Math.PI / 2;
    return texture;
  }

  // 9. 해왕성 텍스처 (선명한 딥 블루 및 밝은 메탄 얼음 구름 띠)
  static createNeptuneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#2445b3');
    grad.addColorStop(0.5, '#3863d9');
    grad.addColorStop(1, '#1e389e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 대암점 (Great Dark Spot)
    const dsX = 700;
    const dsY = 220;
    ctx.fillStyle = 'rgba(10, 25, 75, 0.6)';
    ctx.beginPath();
    ctx.ellipse(dsX, dsY, 50, 25, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // 밝은 흰색 초고속 권운 스트릭
    ctx.fillStyle = 'rgba(210, 235, 255, 0.45)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 1024;
      const y = 140 + Math.random() * 220;
      ctx.beginPath();
      ctx.ellipse(x, y, 70 + Math.random() * 110, 3 + Math.random() * 5, 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    this.createNoisePattern(ctx, 1024, 512, 0.1);
    return new THREE.CanvasTexture(canvas);
  }

  // 10. 명왕성 텍스처 (하트 모양 스푸트니크 평원)
  static createPlutoTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b79a7f';
    ctx.fillRect(0, 0, 512, 256);

    // 밝은 하트 모양(질소 빙하)
    ctx.fillStyle = '#ebdccf';
    ctx.beginPath();
    ctx.ellipse(230, 120, 55, 45, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(270, 130, 45, 40, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 어두운 크톨리아 반점
    ctx.fillStyle = '#5c4533';
    ctx.beginPath();
    ctx.ellipse(140, 160, 60, 30, 0.1, 0, Math.PI * 2);
    ctx.fill();

    this.createNoisePattern(ctx, 512, 256, 0.2);
    return new THREE.CanvasTexture(canvas);
  }

  // 발광용 부드러운 원형 스프라이트 텍스처
  static createGlowTexture(colorHex = '#ffaa33') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, colorHex);
    grad.addColorStop(0.5, 'rgba(255, 140, 0, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }
}
