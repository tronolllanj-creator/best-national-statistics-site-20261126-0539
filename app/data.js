const NS_DATA = {
  // Country metadata
  country: 'Caldoria',
  years: [2020,2021,2022,2023,2024,2025],
  // National totals
  population: [8.02,8.11,8.19,8.28,8.35,8.42], // millions
  gdp: [48.1,51.3,54.9,57.2,59.6,61.8], // billion Caldorian marks
  lifeExpectancy: [76.9,77.2,77.5,77.8,78.1,78.4],
  literacy: [96.8,97.0,97.3,97.6,97.9,98.1],
  // Regions
  regions: [
    {name:'Northvale',population2025:1800,changePercent2020to2025:2.5,densityPerSqKm:120,gdpSharePercent:22.5,lifeExpectancy:78.6,literacy:98.3},
    {name:'Eastmere',population2025:1500,changePercent2020to2025:1.8,densityPerSqKm:95,gdpSharePercent:20.0,lifeExpectancy:78.4,literacy:98.2},
    {name:'Southford',population2025:1400,changePercent2020to2025:2.2,densityPerSqKm:110,gdpSharePercent:18.5,lifeExpectancy:78.3,literacy:98.1},
    {name:'Westhaven',population2025:1300,changePercent2020to2025:1.5,densityPerSqKm:85,gdpSharePercent:17.0,lifeExpectancy:78.5,literacy:98.2},
    {name:'Centralia',population2025:1200,changePercent2020to2025:2.0,densityPerSqKm:130,gdpSharePercent:12.0,lifeExpectancy:78.2,literacy:98.0},
    {name:'Lakeshire',population2025:1220,changePercent2020to2025:1.9,densityPerSqKm:100,gdpSharePercent:10.0,lifeExpectancy:78.4,literacy:98.1}
  ],
  // Economy
  economy: {
    unemployment: [6.4,6.1,5.8,5.4,5.1,4.9],
    exports: [12.5,13.2,14.0,14.8,15.5,16.2],
    imports: [15.3,15.8,16.4,17.0,17.5,18.0]
  },
  // Health
  health: {
    infantMortality: [7.8,7.4,7.0,6.6,6.2,5.9],
    hospitalBedsPer10000: [38,38.5,39,39.5,40,41],
    doctorsPer10000: [21,21.5,22,22.5,23,24]
  },
  // Education
  education: {
    primaryEnrolment: [97.1,97.5,98.0,98.5,98.9,99.2],
    secondaryEnrolment: [89.4,90.0,91.0,92.0,93.0,93.6],
    tertiaryEnrolment: [41.2,42.5,44.0,45.5,47.0,48.7],
    pupilsPerTeacher: [18.4,18.0,17.6,17.2,16.6,16.1]
  },
  // Data releases
  releases: [
    {date:'2025-01-15',title:'Annual Statistical Yearbook 2024 Released',summary:'Comprehensive overview of demographic, economic, health and education indicators for 2024.'},
    {date:'2025-04-10',title:'Quarterly GDP Flash Estimate Q1 2025',summary:'Preliminary GDP growth of 1.2% quarter‑on‑quarter, driven by services and manufacturing.'},
    {date:'2025-07-01',title:'Population and Housing Census 2025 Preliminary Results',summary:'Total population 8.42 million; urban share 68%; regional breakdown published.'},
    {date:'2025-10-20',title:'Health System Performance Report 2025',summary:'Infant mortality falls to 5.9 per 1 000 live births; hospital bed density rises to 41 per 10 000.'}
  ],
  // Key indicators
  indicators: [
    {name:'Total Population',value:8.42,unit:'million',year:2025,source:'Caldoria National Statistics Office'},
    {name:'GDP',value:61.8,unit:'billion Caldorian marks',year:2025,source:'Caldoria National Statistics Office'},
    {name:'GDP per Capita',value:7.34,unit:'thousand Caldorian marks',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Life Expectancy',value:78.4,unit:'years',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Literacy Rate',value:98.1,unit:'percent',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Unemployment Rate',value:4.9,unit:'percent',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Exports',value:16.2,unit:'billion Caldorian marks',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Imports',value:18.0,unit:'billion Caldorian marks',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Infant Mortality',value:5.9,unit:'per 1,000 live births',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Hospital Beds',value:41,unit:'per 10,000 population',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Doctors',value:24,unit:'per 10,000 population',year:2025,source:'Caldoria National Statistics Office'},
    {name:'Primary Enrolment',value:99.2,unit:'percent',year:2025,source:'Caldoria National Statistics Office'}
  ]
};
