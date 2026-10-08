import * as THREE from 'three';
import { SOLAR_SYSTEM_DATA } from './planetsData.js';
import { TextureGenerator } from './textures.js';

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.planets = []; // { id, data, mesh, group, orbitLine, currentAngle, distance, ... }
    this.sun = null;
    this.sunGlow = null;
    this.sunLight = null;
    this.asteroidBelt = null;
    this.moon = null;
    this.orbitLinesGroup = new THREE.Group();
    this.scene.add(this.orbitLinesGroup);

    this.showOrbits = true;
    this.simulationSpeed = 1.0;
    this.isPaused = false;

    this.init();
  }

  init() {
    this.createStarfield();
    this.createSun();
    this.createPlanets();
    this.createAsteroidBelt();
  }

  // 깊은 우주 성간 배경 (별무리 및 미세 성운)
  createStarfield() {
    const starCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'), // 백색 왜성
      new THREE.Color('#a0c8ff'), // 푸른 거성
      new THREE.Color('#ffe4aa'), // 황색 별
      new THREE.Color('#ffb088')  // 붉은 별
    ];

    for (let i = 0; i < starCount; i++) {
      // 반경 600 ~ 1200 구형 분포
      const radius = 600 + Math.random() * 600;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starField = new THREE.Points(geometry, starMaterial);
    this.scene.add(starField);

    // 은하수 중심부 먼지 성운 입자 (미세한 깊이감 추가)
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const dist = 300 + Math.random() * 500;
      const angle = Math.random() * Math.PI * 2;
      dustPos[i * 3] = Math.cos(angle) * dist;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      dustPos[i * 3 + 2] = Math.sin(angle) * dist;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 4.5,
      color: 0x5588cc,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    this.scene.add(new THREE.Points(dustGeo, dustMat));
  }

  // 중심 항성 (태양 및 코로나 발광)
  createSun() {
    const sunData = SOLAR_SYSTEM_DATA.find(d => d.id === 'sun');
    const sunGeometry = new THREE.SphereGeometry(sunData.radius, 64, 64);
    const sunTexture = TextureGenerator.createSunTexture();

    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture
    });

    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.userData = { id: 'sun', data: sunData, isSelectable: true };
    this.scene.add(this.sun);

    // 태양 광원 (포인트 라이트 - 태양계 전체를 비추는 광원)
    this.sunLight = new THREE.PointLight(0xfff3d6, 3.5, 1200, 0.4);
    this.sun.add(this.sunLight);

    // 부드러운 우주 환경광 (어두운 면도 섬세하게 보이도록)
    const ambientLight = new THREE.AmbientLight(0x222a3d, 0.7);
    this.scene.add(ambientLight);

    // 태양 코로나 글로우 (이중 레이어 스프라이트)
    const glowTexture1 = TextureGenerator.createGlowTexture('#ffaa22');
    const glowMaterial1 = new THREE.SpriteMaterial({
      map: glowTexture1,
      color: 0xffaa22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.sunGlow = new THREE.Sprite(glowMaterial1);
    this.sunGlow.scale.set(sunData.radius * 3.8, sunData.radius * 3.8, 1);
    this.sun.add(this.sunGlow);

    const glowTexture2 = TextureGenerator.createGlowTexture('#ff4400');
    const glowMaterial2 = new THREE.SpriteMaterial({
      map: glowTexture2,
      color: 0xff4400,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const outerGlow = new THREE.Sprite(glowMaterial2);
    outerGlow.scale.set(sunData.radius * 5.5, sunData.radius * 5.5, 1);
    this.sun.add(outerGlow);
  }

  // 행성 생성
  createPlanets() {
    const planetDatas = SOLAR_SYSTEM_DATA.filter(d => d.id !== 'sun');

    planetDatas.forEach(data => {
      // 행성 메인 그룹 (자전 및 위성 포함)
      const planetGroup = new THREE.Group();
      planetGroup.position.x = data.distance;

      // 행성 지오메트리 & 텍스처
      const geometry = new THREE.SphereGeometry(data.radius, 48, 48);
      let texture;

      switch (data.id) {
        case 'mercury': texture = TextureGenerator.createMercuryTexture(); break;
        case 'venus':   texture = TextureGenerator.createVenusTexture(); break;
        case 'earth':   texture = TextureGenerator.createEarthTexture(); break;
        case 'mars':    texture = TextureGenerator.createMarsTexture(); break;
        case 'jupiter': texture = TextureGenerator.createJupiterTexture(); break;
        case 'saturn':  texture = TextureGenerator.createSaturnTexture(); break;
        case 'uranus':  texture = TextureGenerator.createUranusTexture(); break;
        case 'neptune': texture = TextureGenerator.createNeptuneTexture(); break;
        case 'pluto':   texture = TextureGenerator.createPlutoTexture(); break;
        default:        texture = null;
      }

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        color: texture ? 0xffffff : new THREE.Color(data.color),
        roughness: 0.7,
        metalness: 0.1
      });

      const planetMesh = new THREE.Mesh(geometry, material);
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;

      // 자전축 기울기 적용 (라디안)
      if (data.axialTilt) {
        planetMesh.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
      }

      planetGroup.add(planetMesh);

      // 지구 대기권 은은한 푸른 글로우 레이어
      if (data.id === 'earth') {
        const atmoGeo = new THREE.SphereGeometry(data.radius * 1.03, 32, 32);
        const atmoMat = new THREE.MeshStandardMaterial({
          color: 0x64b5f6,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        planetGroup.add(atmosphere);

        // 지구의 달 (Moon)
        if (data.hasMoon && data.moonData) {
          const moonGroup = new THREE.Group();
          const moonGeo = new THREE.SphereGeometry(data.moonData.radius, 24, 24);
          const moonMat = new THREE.MeshStandardMaterial({
            map: TextureGenerator.createMoonTexture(),
            roughness: 0.8
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.x = data.moonData.distance;
          moonMesh.userData = { id: 'moon', nameKo: '달', isSelectable: false };

          // 달 궤도선
          const moonOrbitGeo = new THREE.BufferGeometry();
          const moonPts = [];
          for (let i = 0; i <= 64; i++) {
            const th = (i / 64) * Math.PI * 2;
            moonPts.push(new THREE.Vector3(Math.cos(th) * data.moonData.distance, 0, Math.sin(th) * data.moonData.distance));
          }
          moonOrbitGeo.setFromPoints(moonPts);
          const moonOrbitMat = new THREE.LineBasicMaterial({
            color: 0x556677,
            transparent: true,
            opacity: 0.35
          });
          const moonOrbitLine = new THREE.Line(moonOrbitGeo, moonOrbitMat);

          moonGroup.add(moonMesh);
          moonGroup.add(moonOrbitLine);
          planetGroup.add(moonGroup);

          this.moon = {
            group: moonGroup,
            mesh: moonMesh,
            distance: data.moonData.distance,
            orbitSpeed: data.moonData.orbitSpeed,
            angle: 0
          };
        }
      }

      // 토성 고리 (Saturn Rings)
      if (data.id === 'saturn' && data.hasRings) {
        const ringGeo = new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 64);
        // RingGeometry는 xy 평면에 생성되므로 눕히고 회전 매핑
        const pos = ringGeo.attributes.position;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          ringGeo.attributes.uv.setXY(i, (v3.length() - data.ringInnerRadius) / (data.ringOuterRadius - data.ringInnerRadius), 0.5);
        }

        const ringMat = new THREE.MeshStandardMaterial({
          map: TextureGenerator.createSaturnRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
          roughness: 0.6
        });

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.rotation.y = THREE.MathUtils.degToRad(15);
        planetGroup.add(ringMesh);
      }

      // 천왕성 고리 (Uranus Rings)
      if (data.id === 'uranus' && data.hasRings) {
        const ringGeo = new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          map: TextureGenerator.createUranusRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        planetGroup.add(ringMesh);
      }

      // 공전 궤도 원형 라인 생성
      const orbitLine = this.createOrbitLine(data.distance);
      this.orbitLinesGroup.add(orbitLine);

      // 행성 객체 등록 (클릭 대상 userData)
      planetMesh.userData = { id: data.id, data: data, isSelectable: true };

      this.scene.add(planetGroup);

      this.planets.push({
        id: data.id,
        data: data,
        mesh: planetMesh,
        group: planetGroup,
        orbitLine: orbitLine,
        distance: data.distance,
        orbitSpeed: data.orbitSpeed,
        rotationSpeed: data.rotationSpeed,
        currentAngle: Math.random() * Math.PI * 2 // 시작 위상 자연스럽게 분산
      });
    });
  }

  // 미려한 네온 공전 궤도선
  createOrbitLine(radius) {
    const segments = 128;
    const geometry = new THREE.BufferGeometry();
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }

    geometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: 0x2a598c,
      transparent: true,
      opacity: 0.45,
      linewidth: 1
    });

    return new THREE.Line(geometry, material);
  }

  // 화성과 목성 사이 소행성대 (Asteroid Belt)
  createAsteroidBelt() {
    const asteroidCount = 1000;
    const geometry = new THREE.DodecahedronGeometry(0.35, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x887766,
      roughness: 0.9,
      metalness: 0.1
    });

    this.asteroidBelt = new THREE.InstancedMesh(geometry, material, asteroidCount);
    const dummy = new THREE.Object3D();

    const innerRadius = 92;
    const outerRadius = 108;

    for (let i = 0; i < asteroidCount; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;

      dummy.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      const scale = 0.4 + Math.random() * 0.9;
      dummy.scale.set(scale, scale, scale);

      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      dummy.updateMatrix();
      this.asteroidBelt.setMatrixAt(i, dummy.matrix);
    }

    this.asteroidBelt.instanceMatrix.needsUpdate = true;
    this.scene.add(this.asteroidBelt);
  }

  // 궤도 표시 토글
  setOrbitVisibility(visible) {
    this.showOrbits = visible;
    this.orbitLinesGroup.visible = visible;
  }

  // 일시정지 토글
  setPaused(paused) {
    this.isPaused = paused;
  }

  // 시뮬레이션 배속 설정
  setSimulationSpeed(speed) {
    this.simulationSpeed = speed;
  }

  // 애니메이션 업데이트 루프
  update(delta) {
    // 태양 자전 및 코로나 미세 펄스
    if (this.sun) {
      this.sun.rotation.y += 0.003 * delta * 60;
    }
    if (this.sunGlow) {
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.04;
      this.sunGlow.scale.set(14.0 * 3.8 * pulse, 14.0 * 3.8 * pulse, 1);
    }

    // 소행성대 천천히 공전
    if (this.asteroidBelt && !this.isPaused) {
      this.asteroidBelt.rotation.y += 0.001 * this.simulationSpeed * delta * 60;
    }

    // 일시정지가 아닐 때 행성 공전 및 자전 업데이트
    if (!this.isPaused) {
      const step = delta * 60 * this.simulationSpeed;

      this.planets.forEach(p => {
        // 공전 각도 업데이트
        p.currentAngle += p.orbitSpeed * 0.35 * step;
        const x = Math.cos(p.currentAngle) * p.distance;
        const z = Math.sin(p.currentAngle) * p.distance;
        p.group.position.set(x, 0, z);

        // 자전 업데이트
        p.mesh.rotation.y += p.rotationSpeed * step;
      });

      // 달 공전
      if (this.moon) {
        this.moon.angle += this.moon.orbitSpeed * step;
        const mx = Math.cos(this.moon.angle) * this.moon.distance;
        const mz = Math.sin(this.moon.angle) * this.moon.distance;
        this.moon.mesh.position.set(mx, 0, mz);
      }
    }
  }

  // 특정 ID의 천체 위치 조회 (카메라 추적용)
  getBodyPosition(id) {
    if (id === 'sun') {
      return this.sun.position.clone();
    }
    const planet = this.planets.find(p => p.id === id);
    if (planet) {
      return planet.group.position.clone();
    }
    return new THREE.Vector3(0, 0, 0);
  }

  // 행성 메쉬 또는 데이터 반환
  getBodyData(id) {
    return SOLAR_SYSTEM_DATA.find(d => d.id === id);
  }

  // 클릭 가능한 모든 천체 메쉬 목록 반환
  getSelectableMeshes() {
    const list = [this.sun];
    this.planets.forEach(p => list.push(p.mesh));
    return list;
  }
}
