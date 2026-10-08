import * as THREE from 'three';
import { SolarSystem } from './solarSystem.js';
import { CameraController } from './cameraController.js';
import { UIManager } from './ui.js';
import './styles.css';

class App {
  constructor() {
    this.container = document.getElementById('canvas-container');

    // 1. Scene 설정
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030509, 0.0006);

    // 2. Camera 설정
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 3000);

    // 3. Renderer 설정 (고화질 안티앨리어싱 및 색상 보정)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. 모듈 초기화
    this.solarSystem = new SolarSystem(this.scene);
    this.cameraController = new CameraController(this.camera, this.renderer.domElement, this.solarSystem);
    this.uiManager = new UIManager(this.solarSystem, this.cameraController, this.camera, this.renderer);

    this.clock = new THREE.Clock();

    // 5. 윈도우 리사이즈 대응
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 6. 애니메이션 루프 시작
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // 태양계 공전/자전 업데이트
    this.solarSystem.update(delta);

    // 카메라 부드러운 전환 및 타깃 추적 업데이트
    this.cameraController.update(delta);

    // 2D 라벨 투영 위치 업데이트
    this.uiManager.updateLabels();

    // 렌더링
    this.renderer.render(this.scene, this.camera);
  }
}

// 애플리케이션 시작
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
