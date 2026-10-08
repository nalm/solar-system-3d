// 3D 태양계 행성 데이터 및 천문학 정보 (한글 상세 정보 포함)

export const SOLAR_SYSTEM_DATA = [
  {
    id: 'sun',
    nameKo: '태양',
    nameEn: 'Sun',
    type: '항성 (G형 주계열성)',
    radius: 14.0, // 시각적 스케일
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.004,
    axialTilt: 7.25,
    color: '#ffaa00',
    emissiveColor: '#ff7700',
    realData: {
      diameter: '1,392,700 km (지구의 109배)',
      mass: '1.989 × 10³⁰ kg (지구의 333,000배)',
      surfaceTemp: '약 5,500 °C (중심부 1,500만 °C)',
      rotationPeriod: '약 25 ~ 35일 (차등 자전)',
      distanceFromCenter: '태양계의 중심',
      moons: '8개 행성, 수많은 왜소행성 및 혜성 거느림',
      facts: '태양계 전체 질량의 약 99.86%를 차지하는 중심 항성입니다. 수소의 핵융합 반응을 통해 엄청난 빛과 열에너지를 우주 공간으로 방출하며 태양계의 모든 생명과 역학을 지탱합니다.'
    }
  },
  {
    id: 'mercury',
    nameKo: '수성',
    nameEn: 'Mercury',
    type: '지구형 암석 행성',
    radius: 2.2,
    distance: 28,
    orbitSpeed: 0.04,
    rotationSpeed: 0.008,
    axialTilt: 0.034,
    color: '#a5a5a5',
    realData: {
      diameter: '4,879 km (지구의 0.38배)',
      mass: '3.301 × 10²³ kg (지구의 0.055배)',
      surfaceTemp: '-180 °C ~ 430 °C',
      distanceFromCenter: '0.39 AU (약 5,790만 km)',
      orbitPeriod: '88일',
      rotationPeriod: '58.6일',
      moons: '0개',
      facts: '태양과 가장 가까운 행성으로 대기가 거의 없어 낮과 밤의 온도 차이가 극심합니다. 표면은 수많은 운석 충돌구(크레이터)로 뒤덮여 있어 달과 매우 흡사한 외형을 띱니다.'
    }
  },
  {
    id: 'venus',
    nameKo: '금성',
    nameEn: 'Venus',
    type: '지구형 암석 행성',
    radius: 3.4,
    distance: 42,
    orbitSpeed: 0.025,
    rotationSpeed: -0.005, // 역자전 (자전 방향 반대)
    axialTilt: 177.3,
    color: '#e3bb76',
    realData: {
      diameter: '12,104 km (지구의 0.95배)',
      mass: '4.867 × 10²⁴ kg (지구의 0.815배)',
      surfaceTemp: '평균 465 °C (태양계 최고 기온)',
      distanceFromCenter: '0.72 AU (약 1억 820만 km)',
      orbitPeriod: '224.7일',
      rotationPeriod: '243일 (시계 방향 역자전)',
      moons: '0개',
      facts: '두꺼운 이산화탄소 대기와 황산 구름으로 인한 극심한 온실효과 때문에 수성보다 더 뜨겁습니다. 지구와 반대 방향(동에서 서로)으로 천천히 역자전하는 독특한 특징이 있습니다.'
    }
  },
  {
    id: 'earth',
    nameKo: '지구',
    nameEn: 'Earth',
    type: '지구형 암석 행성',
    radius: 3.6,
    distance: 60,
    orbitSpeed: 0.018,
    rotationSpeed: 0.02,
    axialTilt: 23.44,
    color: '#2b82c9',
    hasAtmosphere: true,
    hasMoon: true,
    moonData: {
      nameKo: '달',
      nameEn: 'Moon',
      radius: 0.9,
      distance: 6.5,
      orbitSpeed: 0.06,
      color: '#d6d6d6'
    },
    realData: {
      diameter: '12,742 km',
      mass: '5.972 × 10²⁴ kg',
      surfaceTemp: '평균 15 °C (-89 °C ~ 57 °C)',
      distanceFromCenter: '1.00 AU (약 1억 4,960만 km)',
      orbitPeriod: '365.25일 (1년)',
      rotationPeriod: '23시간 56분 4초',
      moons: '1개 (달)',
      facts: '우주에서 현재까지 생명체가 존재하는 것으로 확인된 유일한 천체입니다. 표면의 71%가 액체 상태의 물로 덮여 있으며, 적절한 두께의 질소·산소 대기와 강력한 자기장이 생명을 보호합니다.'
    }
  },
  {
    id: 'mars',
    nameKo: '화성',
    nameEn: 'Mars',
    type: '지구형 암석 행성',
    radius: 2.6,
    distance: 80,
    orbitSpeed: 0.012,
    rotationSpeed: 0.018,
    axialTilt: 25.19,
    color: '#c1440e',
    realData: {
      diameter: '6,779 km (지구의 0.53배)',
      mass: '6.417 × 10²³ kg (지구의 0.107배)',
      surfaceTemp: '평균 -63 °C (-140 °C ~ 20 °C)',
      distanceFromCenter: '1.52 AU (약 2억 2,790만 km)',
      orbitPeriod: '687일 (약 1.88년)',
      rotationPeriod: '24시간 37분',
      moons: '2개 (포보스, 데이모스)',
      facts: '표면 토양에 함유된 산화철(녹슨 철) 성분 때문에 붉게 보여 붉은 행성으로 불립니다. 태양계에서 가장 거대한 화산인 올림푸스 산(높이 21km)과 마리네리스 협곡이 자리잡고 있습니다.'
    }
  },
  {
    id: 'jupiter',
    nameKo: '목성',
    nameEn: 'Jupiter',
    type: '가스 거대 행성',
    radius: 8.5,
    distance: 120,
    orbitSpeed: 0.007,
    rotationSpeed: 0.04,
    axialTilt: 3.13,
    color: '#d39c7e',
    realData: {
      diameter: '139,820 km (지구의 11배)',
      mass: '1.898 × 10²⁷ kg (지구의 318배)',
      surfaceTemp: '구름층 상단 약 -110 °C',
      distanceFromCenter: '5.20 AU (약 7억 7,850만 km)',
      orbitPeriod: '11.86년',
      rotationPeriod: '9시간 55분 (태양계 최속 자전)',
      moons: '95개 (이오, 유로파, 가니메데, 칼리스토 등)',
      facts: '태양계에서 가장 거대한 행성으로, 다른 모든 행성을 합친 질량의 2.5배에 달합니다. 거대한 폭풍 소용돌이인 대적점(Great Red Spot)과 강력한 방사선대, 95개의 수많은 위성을 보유하고 있습니다.'
    }
  },
  {
    id: 'saturn',
    nameKo: '토성',
    nameEn: 'Saturn',
    type: '가스 거대 행성',
    radius: 7.2,
    distance: 165,
    orbitSpeed: 0.005,
    rotationSpeed: 0.038,
    axialTilt: 26.73,
    color: '#e2bf7d',
    hasRings: true,
    ringInnerRadius: 9.5,
    ringOuterRadius: 17.0,
    realData: {
      diameter: '116,460 km (지구의 9.1배)',
      mass: '5.683 × 10²⁶ kg (지구의 95배)',
      surfaceTemp: '구름층 상단 약 -140 °C',
      distanceFromCenter: '9.58 AU (약 14억 3,350만 km)',
      orbitPeriod: '29.46년',
      rotationPeriod: '10시간 33분',
      moons: '146개 (타이탄, 엔켈라두스 등)',
      facts: '물보다 밀도가 낮은(0.687 g/cm³) 유일한 행성입니다. 얼음 조각과 암석 먼지로 이루어진 찬란하고 압도적인 고리 시스템을 가지고 있으며, 146개로 태양계에서 가장 많은 위성을 거느리고 있습니다.'
    }
  },
  {
    id: 'uranus',
    nameKo: '천왕성',
    nameEn: 'Uranus',
    type: '얼음 거대 행성',
    radius: 5.2,
    distance: 210,
    orbitSpeed: 0.0035,
    rotationSpeed: -0.025,
    axialTilt: 97.77, // 거의 누워서 자전
    color: '#70d6ff',
    hasRings: true,
    ringInnerRadius: 6.8,
    ringOuterRadius: 9.2,
    ringColor: 'rgba(180, 220, 240, 0.4)',
    realData: {
      diameter: '50,724 km (지구의 4.0배)',
      mass: '8.681 × 10²⁵ kg (지구의 14.5배)',
      surfaceTemp: '최저 -224 °C (태양계 최저 대기온도)',
      distanceFromCenter: '19.22 AU (약 28억 7,250만 km)',
      orbitPeriod: '84.01년',
      rotationPeriod: '17시간 14분 (역자전)',
      moons: '28개 (티타니아, 오베론 등)',
      facts: '자전축이 약 98도 기울어져 있어 공전 궤도면상에 거의 옆으로 누운 채 굴러가듯이 자전합니다. 메탄 가스가 붉은빛을 흡수하고 푸른빛을 반사하여 신비로운 청록색(Cyan)을 띱니다.'
    }
  },
  {
    id: 'neptune',
    nameKo: '해왕성',
    nameEn: 'Neptune',
    type: '얼음 거대 행성',
    radius: 5.0,
    distance: 255,
    orbitSpeed: 0.0025,
    rotationSpeed: 0.026,
    axialTilt: 28.32,
    color: '#3f51b5',
    realData: {
      diameter: '49,244 km (지구의 3.9배)',
      mass: '1.024 × 10²⁶ kg (지구의 17.1배)',
      surfaceTemp: '평균 -200 °C',
      distanceFromCenter: '30.05 AU (약 44억 9,510만 km)',
      orbitPeriod: '164.8년',
      rotationPeriod: '16시간 6분',
      moons: '16개 (트리톤 등)',
      facts: '태양계 8대 행성 중 가장 바깥쪽에 위치하며, 시속 2,100km에 달하는 태양계에서 가장 격렬하고 빠른 초음속 바람이 붑니다. 수학적 궤도 계산 예측을 통해 발견된 최초의 행성입니다.'
    }
  },
  {
    id: 'pluto',
    nameKo: '명왕성',
    nameEn: 'Pluto',
    type: '왜소행성 (카이퍼 벨트 천체)',
    radius: 1.5,
    distance: 295,
    orbitSpeed: 0.0018,
    rotationSpeed: 0.015,
    axialTilt: 122.5,
    color: '#bfa58a',
    realData: {
      diameter: '2,376 km (달의 약 68%)',
      mass: '1.303 × 10²² kg (지구의 0.002배)',
      surfaceTemp: '평균 -230 °C',
      distanceFromCenter: '39.48 AU (약 59억 km)',
      orbitPeriod: '248년',
      rotationPeriod: '6.4일',
      moons: '5개 (카론 등)',
      facts: '2006년 국제천문연맹(IAU) 기준 변경으로 왜소행성으로 재분류되었습니다. 표면에 질소 빙하로 형성된 상징적인 하트 모양 지형(스푸트니크 평원)이 유명합니다.'
    }
  }
];
