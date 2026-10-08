import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement, solarSystem) {
    this.camera = camera;
    this.domElement = domElement;
    this.solarSystem = solarSystem;

    // OrbitControls 초기화
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 1200;
    this.controls.minDistance = 5;

    // 기본 전체 뷰 좌표
    this.defaultPosition = new THREE.Vector3(0, 240, 340);
    this.defaultTarget = new THREE.Vector3(0, 0, 0);

    // 추적 타깃 상태
    this.targetId = null; // null 이면 전체 조망 모드
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.transitionDuration = 1.2; // 초 단위

    this.startCamPos = new THREE.Vector3();
    this.startTargetPos = new THREE.Vector3();
    this.endCamOffset = new THREE.Vector3(0, 8, 16); // 타깃 대비 카메라 상대 오프셋

    // 초기 카메라 위치 설정
    this.camera.position.copy(this.defaultPosition);
    this.controls.target.copy(this.defaultTarget);
    this.controls.update();
  }

  // 특정 천체로 초점 이동
  focusOn(id) {
    if (this.targetId === id && !this.isTransitioning) return;

    this.targetId = id;
    this.isTransitioning = true;
    this.transitionProgress = 0;

    this.startCamPos.copy(this.camera.position);
    this.startTargetPos.copy(this.controls.target);

    // 천체 크기에 비례한 최적의 카메라 거리 계산
    const bodyData = this.solarSystem.getBodyData(id);
    const radius = bodyData ? bodyData.radius : 10;
    const distanceFactor = id === 'sun' ? 3.5 : (id === 'saturn' ? 3.8 : 3.0);
    const dist = Math.max(12, radius * distanceFactor);

    // 카메라 오프셋 (약간 위에서 비스듬히 바라봄)
    this.endCamOffset.set(dist * 0.7, dist * 0.45, dist * 0.7);
  }

  // 태양계 전체 조망 뷰로 리셋
  resetToOverview() {
    this.targetId = null;
    this.isTransitioning = true;
    this.transitionProgress = 0;

    this.startCamPos.copy(this.camera.position);
    this.startTargetPos.copy(this.controls.target);
  }

  // 매 프레임 업데이트
  update(delta) {
    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      const t = Math.min(1.0, this.transitionProgress);
      // 부드러운 Ease-in-out Cubic 보간
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      let targetPos;
      let desiredCamPos;

      if (this.targetId) {
        targetPos = this.solarSystem.getBodyPosition(this.targetId);
        desiredCamPos = targetPos.clone().add(this.endCamOffset);
      } else {
        targetPos = this.defaultTarget;
        desiredCamPos = this.defaultPosition;
      }

      this.camera.position.lerpVectors(this.startCamPos, desiredCamPos, ease);
      this.controls.target.lerpVectors(this.startTargetPos, targetPos, ease);

      if (t >= 1.0) {
        this.isTransitioning = false;
      }
    } else if (this.targetId) {
      // 천체 추적 중: 행성이 공전하더라도 카메라와 타깃이 함께 부드럽게 이동
      const currentTargetPos = this.solarSystem.getBodyPosition(this.targetId);
      const deltaPos = currentTargetPos.clone().sub(this.controls.target);

      this.controls.target.copy(currentTargetPos);
      this.camera.position.add(deltaPos);
    }

    this.controls.update();
  }
}
