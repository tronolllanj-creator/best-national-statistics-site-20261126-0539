(() => {
  'use strict';
  const data = NS_DATA;
  function $(id) { return document.getElementById(id); }
  const routes = ['overview','population','economy','health','education','data'];
  function showRoute(route) {
    routes.forEach(r => {
      const sec = $(`route-${r}`);
      if (sec) sec.classList.toggle('active', r === route);
    });
    document.querySelectorAll('header nav a').forEach(a => {
      const href = a.getAttribute('href');
      const isActive = href === `#/${route}` || (route === 'overview' && href === '#/');
      a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
  function onHashChange() {
    const hash = location.hash.slice(1);
    let route = hash.startsWith('/') ? hash.slice(1) : 'overview';
    if (!route || !routes.includes(route)) route = 'overview';
    showRoute(route);
    renderCurrentRoute();
  }
  const yearSelect = $('year-select');
  let currentYear = yearSelect ? parseInt(yearSelect.value,10) : 2025;
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      currentYear = parseInt(yearSelect.value,10);
      renderCurrentRoute();
    });
  }
  const regionSelect = $('region-select');
  let currentRegionFilter = regionSelect ? regionSelect.value : 'all';
  if (regionSelect) {
    regionSelect.addEventListener('change', () => {
      currentRegionFilter = regionSelect.value;
      renderCurrentRoute();
    });
  }
  const regionSearch = $('region-search');
  let regionSearchTerm = '';
  if (regionSearch) {
    regionSearch.addEventListener('input', () => {
      regionSearchTerm = regionSearch.value.toLowerCase();
      filterRegionTable();
    });
  }
  const indicatorSearch = $('indicator-search');
  let indicatorSearchTerm = '';
  if (indicatorSearch) {
    indicatorSearch.addEventListener('input', () => {
      indicatorSearchTerm = indicatorSearch.value.toLowerCase();
      filterIndicatorTable();
    });
  }
  const tabButtons = document.querySelectorAll('[data-tab]');
  let currentEconomyTab = 'gdp';
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab === currentEconomyTab) return;
      currentEconomyTab = tab;
      switchEconomyTab(tab);
    });
  });
  function switchEconomyTab(tab) {
    tabButtons.forEach(btn => {
      const isSel = btn.getAttribute('data-tab') === tab;
      btn.setAttribute('aria-selected', isSel ? 'true' : 'false');
    });
    ['gdp','jobs','trade'].forEach(t => {
      const panel = $(`tab-${t}`);
      if (panel) panel.hidden = t !== tab;
    });
    renderEconomyTab(tab);
  }
  let regionSortState = { col: null, asc: true };
  const regionTableHead = $('region-table') ? $('region-table').querySelector('thead') : null;
  if (regionTableHead) {
    const sortFields = ['name', 'pop', 'change', 'density'];
    regionTableHead.querySelectorAll('th[data-sort]').forEach((th, idx) => {
      th.addEventListener('click', () => {
        const col = sortFields[idx];
        if (regionSortState.col === col) {
          regionSortState.asc = !regionSortState.asc;
        } else {
          regionSortState.col = col;
          regionSortState.asc = true;
        }
        buildRegionTable();
      });
    });
  }
  function renderCurrentRoute() {
    const hash = location.hash.slice(1);
    const route = hash.startsWith('/') ? hash.slice(1) : 'overview';
    switch(route) {
      case 'overview': renderOverview(); break;
      case 'population': renderPopulation(); break;
      case 'economy': renderEconomy(); break;
      case 'health': renderHealth(); break;
      case 'education': renderEducation(); break;
      case 'data': renderData(); break;
      default: renderOverview();
    }
  }
  function renderOverview() {
    const yearIdx = data.years.indexOf(currentYear);
    if (yearIdx === -1) return;
    setKPI('kpi-pop', data.population[yearIdx], ' million');
    setKPI('kpi-gdp', data.gdp[yearIdx], ' bn');
    setKPI('kpi-life', data.lifeExpectancy[yearIdx], ' yrs');
    setKPI('kpi-literacy', data.literacy[yearIdx], '%', true);
    const popTrendEl = $('chart-pop-trend');
    if (popTrendEl) drawLineChart(popTrendEl, data.years, data.population, { unit: 'm', color: '#e8a33d' });
    const gdpChartEl = $('chart-gdp');
    if (gdpChartEl) drawBarChart(gdpChartEl, data.years, data.gdp, { unit: 'bn', color: '#17706a' });
  }
  function setKPI(id, value, suffix, isPercent=false) {
    const el = $(id);
    if (!el) return;
    const p = el.querySelector('p.value');
    if (!p) return;
    let txt;
    if (isPercent) {
      txt = formatPct(value);
    } else {
      txt = value.toFixed(1) + suffix;
    }
    p.textContent = txt;
  }
  function renderPopulation() {
    const regions = data.regions;
    const filteredRegions = currentRegionFilter === 'all' ? regions : regions.filter(r => r.name.toLowerCase() === currentRegionFilter);
    const labels = filteredRegions.map(r => r.name);
    const values = filteredRegions.map(r => r.population2025);
    const chartEl = $('chart-pop-regions');
    if (chartEl) drawBarChart(chartEl, labels, values, { unit: 'k', color: '#17706a' });
    buildRegionTable();
  }
  function buildRegionTable() {
    const table = $('region-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    let rowsData = data.regions.map(r => ({
      name: r.name,
      pop: r.population2025,
      change: r.changePercent2020to2025,
      density: r.densityPerSqKm
    }));
    if (currentRegionFilter !== 'all') {
      rowsData = rowsData.filter(r => r.name.toLowerCase() === currentRegionFilter);
    }
    if (regionSearchTerm) {
      rowsData = rowsData.filter(r => r.name.toLowerCase().includes(regionSearchTerm));
    }
    if (regionSortState.col) {
      rowsData.sort((a,b) => {
        let av = a[regionSortState.col];
        let bv = b[regionSortState.col];
        if (typeof av === 'string') {
          av = av.toLowerCase();
          bv = bv.toLowerCase();
        }
        if (av < bv) return regionSortState.asc ? -1 : 1;
        if (av > bv) return regionSortState.asc ? 1 : -1;
        return 0;
      });
    }
    tbody.innerHTML = '';
    rowsData.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.name}</td>
        <td>${formatNumber(r.pop)}</td>
        <td>${formatPct(r.change)}</td>
        <td>${formatNumber(r.density)}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  function filterRegionTable() {
    buildRegionTable();
  }
  function renderEconomy() {
    switchEconomyTab(currentEconomyTab);
  }
  function renderEconomyTab(tab) {
    const table = $('economy-table');
    const tbody = table ? table.querySelector('tbody') : null;
    if (!tbody) return;
    tbody.innerHTML = '';
    if (tab === 'gdp') {
      const el = $('chart-economy');
      if (el) drawBarChart(el, data.years, data.gdp, { unit: 'bn', color: '#17706a' });
      data.years.forEach((yr, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>GDP</td><td>${data.gdp[i].toFixed(1)} bn</td><td>${yr}</td>`;
        tbody.appendChild(tr);
      });
    } else if (tab === 'jobs') {
      const el = $('chart-economy');
      if (el) drawLineChart(el, data.years, data.economy.unemployment, { unit: '%', color: '#e8a33d' });
      data.years.forEach((yr, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>Unemployment</td><td>${formatPct(data.economy.unemployment[i])}</td><td>${yr}</td>`;
        tbody.appendChild(tr);
      });
    } else if (tab === 'trade') {
      const el = $('chart-economy');
      if (el) { const balance = data.years.map((y, i) => +(data.economy.exports[i] - data.economy.imports[i]).toFixed(1)); drawLineChart(el, data.years, balance, { unit: 'bn', color: '#e8a33d' }); }
      data.years.forEach((yr, i) => {
        const tr1 = document.createElement('tr');
        tr1.innerHTML = `<td>Exports</td><td>${data.economy.exports[i].toFixed(1)} bn</td><td>${yr}</td>`;
        tbody.appendChild(tr1);
        const tr2 = document.createElement('tr');
        tr2.innerHTML = `<td>Imports</td><td>${data.economy.imports[i].toFixed(1)} bn</td><td>${yr}</td>`;
        tbody.appendChild(tr2);
      });
    }
  }
  function renderHealth() {
    const yearIdx = data.years.indexOf(currentYear);
    if (yearIdx === -1) return;
    const healthSection = $('route-health');
    if (healthSection) {
      const valuePs = healthSection.querySelectorAll('p.value');
      if (valuePs.length >= 3) {
        valuePs[0].textContent = data.health.infantMortality[yearIdx] + ' per 1,000 live births';
        valuePs[1].textContent = formatNumber(data.health.hospitalBedsPer10000[yearIdx]) + ' per 10,000';
        valuePs[2].textContent = formatNumber(data.health.doctorsPer10000[yearIdx]) + ' per 10,000';
      }
    }
    const lifeChartEl = $('chart-life');
    if (lifeChartEl) drawLineChart(lifeChartEl, data.years, data.lifeExpectancy, { unit: 'yrs', color: '#e8a33d' });
    const healthTable = $('health-table');
    const tbody = healthTable ? healthTable.querySelector('tbody') : null;
    if (tbody) {
      tbody.innerHTML = '';
      data.years.forEach((yr, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${yr}</td>
          <td>${data.lifeExpectancy[i].toFixed(1)}</td>
          <td>${data.health.infantMortality[i]}</td>
          <td>${formatNumber(data.health.hospitalBedsPer10000[i])}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }
  function renderEducation() {
    const yearIdx = data.years.indexOf(currentYear);
    if (yearIdx === -1) return;
    const labels = ['Primary', 'Secondary', 'Tertiary'];
    const values = [
      data.education.primaryEnrolment[yearIdx],
      data.education.secondaryEnrolment[yearIdx],
      data.education.tertiaryEnrolment[yearIdx]
    ];
    const enrolChartEl = $('chart-enrol');
    if (enrolChartEl) drawBarChart(enrolChartEl, labels, values, { unit: '%', color: '#17706a' });
    const eduTable = $('education-table');
    const tbody = eduTable ? eduTable.querySelector('tbody') : null;
    if (tbody) {
      tbody.innerHTML = '';
      data.years.forEach((yr, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${yr}</td>
          <td>${formatPct(data.education.primaryEnrolment[i])}</td>
          <td>${formatPct(data.education.secondaryEnrolment[i])}</td>
          <td>${formatPct(data.education.tertiaryEnrolment[i])}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }
  function renderData() {
    const table = $('indicator-table');
    const tbody = table ? table.querySelector('tbody') : null;
    if (!tbody) return;
    let rows = data.indicators.map(ind => ({
      name: ind.name,
      source: ind.source,
      year: ind.year
    }));
    if (indicatorSearchTerm) {
      rows = rows.filter(r => r.name.toLowerCase().includes(indicatorSearchTerm) || r.source.toLowerCase().includes(indicatorSearchTerm));
    }
    tbody.innerHTML = '';
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.name}</td><td>${r.source}</td><td>${r.year}</td>`;
      tbody.appendChild(tr);
    });
  }
  function filterIndicatorTable() {
    renderData();
  }
  window.addEventListener('hashchange', onHashChange);
  onHashChange();
})();