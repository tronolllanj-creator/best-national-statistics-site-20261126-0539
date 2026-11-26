function formatNumber(n) {
  if (typeof n !== 'number') return String(n);
  return n.toLocaleString();
}

function formatPct(n) {
  return formatNumber(n) + '%';
}

function drawBarChart(el, labels, values, opts = {}) {
  if (!el) return;
  el.innerHTML = '';
  const unit = opts.unit || '';
  const barColor = opts.color || '#17706a';
  const n = values.length;
  if (n === 0 || !labels || labels.length === 0) {
    el.textContent = 'No data';
    return;
  }
  const maxVal = Math.max(...values, 0);
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = 500;
  const chartHeight = 300;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const barWidth = (innerWidth / n) * 0.7;
  const gap = (innerWidth - barWidth * n) / (n + 1);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  const title = document.createElementNS(svgNS, 'title');
  title.textContent = 'Bar chart';
  svg.appendChild(title);

  // Y gridlines and labels
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const y = padding.top + (innerHeight / steps) * i;
    const val = maxVal - (maxVal / steps) * i;
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', padding.left);
    line.setAttribute('x2', chartWidth - padding.right);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#e0e0e0');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', padding.left - 8);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#333');
    text.textContent = formatNumber(val) + unit;
    svg.appendChild(text);
  }

  // Bars
  values.forEach((val, i) => {
    const x = padding.left + gap + i * (barWidth + gap);
    const barHeight = maxVal === 0 ? 0 : (val / maxVal) * innerHeight;
    const y = chartHeight - padding.bottom - barHeight;
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', barColor);
    rect.setAttribute('rx', '2');
    rect.setAttribute('ry', '2');
    svg.appendChild(rect);
    // Value label
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', x + barWidth / 2);
    label.setAttribute('y', y - 4);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '11');
    label.setAttribute('fill', '#333');
    label.textContent = formatNumber(val) + unit;
    svg.appendChild(label);
    // X axis label
    const xLabel = document.createElementNS(svgNS, 'text');
    xLabel.setAttribute('x', x + barWidth / 2);
    xLabel.setAttribute('y', chartHeight - padding.bottom + 18);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '11');
    xLabel.setAttribute('fill', '#333');
    xLabel.textContent = labels[i];
    svg.appendChild(xLabel);
  });

  // X axis line
  const xAxis = document.createElementNS(svgNS, 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('x2', chartWidth - padding.right);
  xAxis.setAttribute('y1', chartHeight - padding.bottom);
  xAxis.setAttribute('y2', chartHeight - padding.bottom);
  xAxis.setAttribute('stroke', '#999');
  xAxis.setAttribute('stroke-width', '1');
  svg.appendChild(xAxis);

  // Y axis line
  const yAxis = document.createElementNS(svgNS, 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('y2', chartHeight - padding.bottom);
  yAxis.setAttribute('stroke', '#999');
  yAxis.setAttribute('stroke-width', '1');
  svg.appendChild(yAxis);

  el.appendChild(svg);
}

function drawLineChart(el, labels, values, opts = {}) {
  if (!el) return;
  el.innerHTML = '';
  const unit = opts.unit || '';
  const lineColor = opts.color || '#e8a33d';
  const n = values.length;
  if (n === 0 || !labels || labels.length === 0) {
    el.textContent = 'No data';
    return;
  }
  const maxVal = Math.max(...values, 0);
  const minVal = Math.min(...values, 0);
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = 500;
  const chartHeight = 300;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  const title = document.createElementNS(svgNS, 'title');
  title.textContent = 'Line chart';
  svg.appendChild(title);

  // Y gridlines and labels
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const y = padding.top + (innerHeight / steps) * i;
    const val = maxVal - (maxVal - minVal) / steps * i;
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', padding.left);
    line.setAttribute('x2', chartWidth - padding.right);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#e0e0e0');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', padding.left - 8);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#333');
    text.textContent = formatNumber(val) + unit;
    svg.appendChild(text);
  }

  // Compute points
  const points = values.map((val, i) => {
    const x = padding.left + (i / (n - 1 || 1)) * innerWidth;
    const y = chartHeight - padding.bottom - ((val - minVal) / (maxVal - minVal || 1)) * innerHeight;
    return { x, y, val };
  });

  // Build smooth path using quadratic Bezier
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    const cpY = (prev.y + curr.y) / 2;
    pathData += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`;
  }

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', lineColor);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);

  // Dots and value labels
  points.forEach((p, i) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', 4);
    circle.setAttribute('fill', lineColor);
    svg.appendChild(circle);
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', i === 0 ? p.x + 6 : (i === points.length - 1 ? p.x - 6 : p.x));
    label.setAttribute('y', p.y - 8);
    label.setAttribute('text-anchor', i === 0 ? 'start' : (i === points.length - 1 ? 'end' : 'middle'));
    label.setAttribute('font-size', '11');
    label.setAttribute('fill', '#333');
    label.textContent = formatNumber(p.val) + unit;
    svg.appendChild(label);
    // X axis label
    const xLabel = document.createElementNS(svgNS, 'text');
    xLabel.setAttribute('x', p.x);
    xLabel.setAttribute('y', chartHeight - padding.bottom + 18);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '11');
    xLabel.setAttribute('fill', '#333');
    xLabel.textContent = labels[i];
    svg.appendChild(xLabel);
  });

  // X axis line
  const xAxis = document.createElementNS(svgNS, 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('x2', chartWidth - padding.right);
  xAxis.setAttribute('y1', chartHeight - padding.bottom);
  xAxis.setAttribute('y2', chartHeight - padding.bottom);
  xAxis.setAttribute('stroke', '#999');
  xAxis.setAttribute('stroke-width', '1');
  svg.appendChild(xAxis);

  // Y axis line
  const yAxis = document.createElementNS(svgNS, 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('y2', chartHeight - padding.bottom);
  yAxis.setAttribute('stroke', '#999');
  yAxis.setAttribute('stroke-width', '1');
  svg.appendChild(yAxis);

  el.appendChild(svg);
}