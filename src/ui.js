import * as THREE from 'three';
import { SOLAR_SYSTEM_DATA } from './planetsData.js';

export class UIManager {
  constructor(solarSystem, cameraController, camera, renderer) {
    this.solarSystem = solarSystem;
    this.cameraController = cameraController;
    this.camera = camera;
    this.renderer = renderer;

    this.showLabels = true;
    this.labels = []; // { id, element, mesh/position }
    this.selectedBodyId = null;

    this.labelsContainer = document.getElementById('labels-container');
    this.infoPanel = document.getElementById('info-panel');

    this.initControls();
    this.initBottomNav();
    this.createLabels();
    this.initRaycaster();
    this.initKeyboardShortcuts();
  }

  // 상단 제어 바 이벤트 등록
  initControls() {
    // 1. 일시정지 / 재생
    const pauseBtn = document.getElementById('btn-pause');
    pauseBtn.addEventListener('click', () => {
      this.togglePause();
    });

    // 2. 전체 보기 리셋
    const resetBtn = document.getElementById('btn-reset');
    resetBtn.addEventListener('click', () => {
      this.cameraController.resetToOverview();
      this.selectedBodyId = null;
      this.updateActiveNavItem(null);
      this.hideInfoPanel();
    });

    // 3. 궤도선 토글
    const orbitsBtn = document.getElementById('btn-toggle-orbits');
    orbitsBtn.addEventListener('click', () => {
      const isVisible = !this.solarSystem.showOrbits;
      this.solarSystem.setOrbitVisibility(isVisible);
      orbitsBtn.classList.toggle('active', isVisible);
      orbitsBtn.innerHTML = isVisible ? '<span>🌐</span> 궤도선 ON' : '<span>🌐</span> 궤도선 OFF';
    });

    // 4. 라벨 토글
    const labelsBtn = document.getElementById('btn-toggle-labels');
    labelsBtn.addEventListener('click', () => {
      this.showLabels = !this.showLabels;
      this.labelsContainer.style.display = this.showLabels ? 'block' : 'none';
      labelsBtn.classList.toggle('active', this.showLabels);
      labelsBtn.innerHTML = this.showLabels ? '<span>🏷️</span> 라벨 ON' : '<span>🏷️</span> 라벨 OFF';
    });

    // 5. 시뮬레이션 속도 슬라이더
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    speedSlider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      this.setSpeed(speed);
    });

    // 6. 프리셋 배속 버튼
    const presetBtns = document.querySelectorAll('.speed-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        speedSlider.value = speed;
        this.setSpeed(speed);
      });
    });

    // 7. 정보 패널 닫기 버튼
    const closeBtn = document.getElementById('btn-close-panel');
    closeBtn.addEventListener('click', () => {
      this.hideInfoPanel();
    });

    // 8. 정보 패널 내 초점 이동 버튼
    const focusBtn = document.getElementById('btn-panel-focus');
    focusBtn.addEventListener('click', () => {
      if (this.selectedBodyId) {
        this.cameraController.focusOn(this.selectedBodyId);
      }
    });

    // 9. 정보 패널 내 전체보기 버튼
    const overviewBtn = document.getElementById('btn-panel-overview');
    overviewBtn.addEventListener('click', () => {
      this.cameraController.resetToOverview();
      this.selectedBodyId = null;
      this.updateActiveNavItem(null);
      this.hideInfoPanel();
    });
  }

  // 일시정지 상태 토글
  togglePause() {
    const isPaused = !this.solarSystem.isPaused;
    this.solarSystem.setPaused(isPaused);
    const pauseBtn = document.getElementById('btn-pause');
    if (isPaused) {
      pauseBtn.innerHTML = '<span>▶</span> 재생';
      pauseBtn.classList.add('btn-primary');
    } else {
      pauseBtn.innerHTML = '<span>⏸</span> 일시정지';
      pauseBtn.classList.remove('btn-primary');
    }
  }

  // 배속 설정
  setSpeed(speed) {
    this.solarSystem.setSimulationSpeed(speed);
    document.getElementById('speed-val').textContent = `${speed.toFixed(1)}x`;

    const presetBtns = document.querySelectorAll('.speed-btn');
    presetBtns.forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });
  }

  // 하단 네비게이션 행성 목록 생성
  initBottomNav() {
    const navContainer = document.getElementById('bottom-nav');
    navContainer.innerHTML = '';

    SOLAR_SYSTEM_DATA.forEach(data => {
      const item = document.createElement('div');
      item.className = 'nav-item';
      item.dataset.id = data.id;

      const indicator = document.createElement('span');
      indicator.className = 'color-indicator';
      indicator.style.backgroundColor = data.color;

      const label = document.createElement('span');
      label.textContent = data.nameKo;

      item.appendChild(indicator);
      item.appendChild(label);

      item.addEventListener('click', () => {
        this.selectBody(data.id);
      });

      navContainer.appendChild(item);
    });
  }

  // 행성 선택 시 카메라 이동 및 정보 패널 표시
  selectBody(id) {
    this.selectedBodyId = id;
    this.cameraController.focusOn(id);
    this.updateActiveNavItem(id);
    this.showInfoPanel(id);
  }

  // 하단 활성 탭 하이라이트
  updateActiveNavItem(id) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => {
      item.classList.toggle('active', item.dataset.id === id);
    });
  }

  // 3D 뷰 위에 띄울 2D 인터랙티브 라벨 생성
  createLabels() {
    this.labelsContainer.innerHTML = '';
    this.labels = [];

    SOLAR_SYSTEM_DATA.forEach(data => {
      const labelEl = document.createElement('div');
      labelEl.className = 'planet-label';
      labelEl.innerHTML = `<span class="dot" style="background: ${data.color}; box-shadow: 0 0 6px ${data.color}"></span><span>${data.nameKo}</span>`;

      labelEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectBody(data.id);
      });

      this.labelsContainer.appendChild(labelEl);
      this.labels.push({
        id: data.id,
        element: labelEl,
        radius: data.radius
      });
    });
  }

  // 매 프레임 라벨 화면 좌표 투영 및 위치 갱신
  updateLabels() {
    if (!this.showLabels) return;

    const widthHalf = this.renderer.domElement.clientWidth / 2;
    const heightHalf = this.renderer.domElement.clientHeight / 2;
    const tempV = new THREE.Vector3();

    this.labels.forEach(label => {
      const pos = this.solarSystem.getBodyPosition(label.id);
      // 행성 크기 상단 약간 위에 라벨 띄움
      tempV.copy(pos);
      tempV.y += label.radius * 1.35 + 2.0;

      // 3D -> 2D 정규화 좌표 (-1 ~ 1)
      tempV.project(this.camera);

      // 카메라 뒤에 있는 천체는 라벨 숨김 (z > 1.0)
      if (tempV.z > 1.0) {
        label.element.style.display = 'none';
        return;
      }

      // 화면 픽셀 좌표 계산
      const x = (tempV.x * widthHalf) + widthHalf;
      const y = -(tempV.y * heightHalf) + heightHalf;

      label.element.style.display = 'flex';
      label.element.style.left = `${x}px`;
      label.element.style.top = `${y}px`;
    });
  }

  // 행성 클릭 감지를 위한 마우스 레이캐스터
  initRaycaster() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let downPos = { x: 0, y: 0 };

    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      isDragging = false;
      downPos = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('pointermove', (e) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 5) {
        isDragging = true;
      }
    });

    this.renderer.domElement.addEventListener('pointerup', (e) => {
      // 드래그(시점 회전)한 경우 클릭으로 처리하지 않음
      if (isDragging) return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const selectables = this.solarSystem.getSelectableMeshes();
      const intersects = raycaster.intersectObjects(selectables, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.id) {
          this.selectBody(hit.userData.id);
        }
      }
    });
  }

  // 키보드 단축키 지원 (스페이스바: 일시정지/재생)
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePause();
      } else if (e.code === 'Escape') {
        this.hideInfoPanel();
      }
    });
  }

  // 상세 정보 패널 표시
  showInfoPanel(id) {
    const data = this.solarSystem.getBodyData(id);
    if (!data) return;

    document.getElementById('panel-name-ko').textContent = data.nameKo;
    document.getElementById('panel-name-en').textContent = data.nameEn;
    document.getElementById('panel-type').textContent = data.type;

    const r = data.realData;
    const metricsHtml = `
      <div class="metric-item">
        <div class="metric-label">태양과의 거리</div>
        <div class="metric-val">${r.distanceFromCenter || '-'}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">지름 크기</div>
        <div class="metric-val">${r.diameter || '-'}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">공전 주기</div>
        <div class="metric-val">${r.orbitPeriod || (id === 'sun' ? '은하 공전 2.3억년' : '-')}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">자전 주기</div>
        <div class="metric-val">${r.rotationPeriod || '-'}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">표면 온도</div>
        <div class="metric-val">${r.surfaceTemp || '-'}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">보유 위성</div>
        <div class="metric-val">${r.moons || '-'}</div>
      </div>
    `;

    document.getElementById('panel-metrics').innerHTML = metricsHtml;
    document.getElementById('panel-facts-text').textContent = r.facts || '';

    this.infoPanel.classList.remove('hidden');
  }

  hideInfoPanel() {
    this.infoPanel.classList.add('hidden');
  }
}
