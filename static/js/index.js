window.HELP_IMPROVE_VIDEOJS = false;

// Evaluation Results Tab Switching
function switchTab(event, tabId) {
  // Hide all tab content
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('is-active'));

  // Deactivate all tabs
  const tabs = document.querySelectorAll('.eval-tab');
  tabs.forEach(tab => tab.classList.remove('is-active'));

  // Show selected tab content
  document.getElementById(tabId).classList.add('is-active');

  // Activate selected tab (works for both div and button)
  event.currentTarget.classList.add('is-active');
}

// Global sort state per table
const sortStateMap = {};

/**
 * Robust Sorting function for AIBench-style tables
 * @param {string} tableId - ID of the table to sort
 * @param {number} colIndex - Index of the column to sort
 */
function sortTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Initialize or toggle sort state
  if (!sortStateMap[tableId]) sortStateMap[tableId] = { colIndex: -1, ascending: true };
  const state = sortStateMap[tableId];

  if (state.colIndex === colIndex) {
    state.ascending = !state.ascending;
  } else {
    state.colIndex = colIndex;
    // Default to descending for numbers (performance scores), ascending for text
    state.ascending = (colIndex === 1 || colIndex === 2); // Model and Vision Encoder default ascending
  }

  // Update icons in header
  const ths = table.querySelectorAll('thead th');
  ths.forEach((th, i) => {
    const icon = th.querySelector('.sort-icon');
    if (icon) {
      if (i === colIndex) {
        icon.innerHTML = state.ascending ? '▲' : '▼';
        icon.style.opacity = '1';
        icon.style.color = '#2563eb';
      } else {
        icon.innerHTML = '⇅';
        icon.style.opacity = '0.5';
        icon.style.color = 'inherit';
      }
    }
  });

  // Sort rows
  rows.sort((a, b) => {
    // Special case for colIndex 0: Reset to original order
    if (colIndex === 0) {
      const indexA = parseInt(a.dataset.originalIndex || 0);
      const indexB = parseInt(b.dataset.originalIndex || 0);
      return indexA - indexB;
    }

    const tdA = a.cells[colIndex];
    const tdB = b.cells[colIndex];
    if (!tdA || !tdB) return 0;

    let valA = tdA.textContent.trim();
    let valB = tdB.textContent.trim();

    // Handle numerical values (including percentages)
    const numA = parseFloat(valA.replace(/[^0-9.-]/g, ''));
    const numB = parseFloat(valB.replace(/[^0-9.-]/g, ''));

    if (!isNaN(numA) && !isNaN(numB) && !valA.match(/[a-zA-Z]{5,}/)) { // Simple heuristic to ignore model names with numbers
      return state.ascending ? numA - numB : numB - numA;
    }

    // String sort
    valA = valA.toLowerCase();
    valB = valB.toLowerCase();
    if (valA < valB) return state.ascending ? -1 : 1;
    if (valA > valB) return state.ascending ? 1 : -1;
    return 0;
  });

  // Re-append rows and update rank numbers (#)
  rows.forEach((row, index) => {
    tbody.appendChild(row);
    // Correct the rank column (#) to always be 1, 2, 3... based on current view
    const rankTd = row.cells[0]; // Assumes first column is rank
    if (rankTd && rankTd.classList.contains('rank-cell')) {
      rankTd.textContent = index + 1;
    }
  });
}


// More Works Dropdown Functionality
function toggleMoreWorks() {
  const dropdown = document.getElementById('moreWorksDropdown');
  const button = document.querySelector('.more-works-btn');

  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
    button.classList.remove('active');
  } else {
    dropdown.classList.add('show');
    button.classList.add('active');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const container = document.querySelector('.more-works-container');
  const dropdown = document.getElementById('moreWorksDropdown');
  const button = document.querySelector('.more-works-btn');

  if (container && !container.contains(event.target)) {
    dropdown.classList.remove('show');
    button.classList.remove('active');
  }
});

// Close dropdown on escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    dropdown.classList.remove('show');
    button.classList.remove('active');
  }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
  const bibtexElement = document.getElementById('bibtex-code');
  const button = document.querySelector('.copy-bibtex-btn');
  const copyText = button.querySelector('.copy-text');

  if (bibtexElement) {
    navigator.clipboard.writeText(bibtexElement.textContent).then(function () {
      // Success feedback
      button.classList.add('copied');
      copyText.textContent = 'Cop';

      setTimeout(function () {
        button.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2000);
    }).catch(function (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = bibtexElement.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      button.classList.add('copied');
      copyText.textContent = 'Cop';
      setTimeout(function () {
        button.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2000);
    });
  }
}

// Scroll to top functionality with improved performance
// Scroll to top functionality with native smooth behavior
// Optimized Scroll-to-Top with immediate feedback
function scrollToTop() {
  // Immediate visual feedback on the button
  const scrollButton = document.querySelector('.scroll-to-top');
  if (scrollButton) {
    scrollButton.classList.add('active');
    setTimeout(() => scrollButton.classList.remove('active'), 200);
  }

  // Instantaneous return to top as requested
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
}

// Throttled scroll listener
let isScrolling = false;
window.addEventListener('scroll', function () {
  if (!isScrolling) {
    window.requestAnimationFrame(function () {
      const scrollButton = document.querySelector('.scroll-to-top');
      if (scrollButton) {
        if (window.pageYOffset > 300) {
          scrollButton.classList.add('visible');
        } else {
          scrollButton.classList.remove('visible');
        }
      }
      isScrolling = false;
    });
    isScrolling = true;
  }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
  const carouselVideos = document.querySelectorAll('.results-carousel video');

  if (carouselVideos.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Video is in view, play it
        video.play().catch(e => {
          // Autoplay failed, probably due to browser policy
          console.log('Autoplay prevented:', e);
        });
      } else {
        // Video is out of view, pause it
        video.pause();
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the video is visible
  });

  carouselVideos.forEach(video => {
    observer.observe(video);
  });
}

$(document).ready(function () {
  // Check for click events on the navbar burger icon

  var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
  }

  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach('.carousel', options);

  bulmaSlider.attach();

  // Setup video autoplay for carousel
  setupVideoCarouselAutoplay();

  // Initialize original order for evaluation tables
  document.querySelectorAll('.evaluation-table tbody').forEach(tbody => {
    Array.from(tbody.querySelectorAll('tr')).forEach((row, index) => {
      row.dataset.originalIndex = index;
    });
  });
})

// --- Per-Dataset Results Chart Logic ---
// Morandi / Muted Academic Palette
const modelColors = [
  '#94a3b8', // EVA-CLIP (Slate)
  '#0d9488', // CoCa (Teal)
  '#4f46e5', // DINOv2 (Indigo - Emphasis)
  '#f59e0b', // BEiT3 (Amber)
  '#f43f5e', // LLaVA (Rose)
  '#8b5cf6', // InternVL (Violet)
  '#10b981'  // Qwen (Emerald)
];
const modelNames = ['EVA-CLIP', 'CoCa', 'DINOv2', 'BEiT3', 'LLaVA', 'InternVL', 'Qwen'];

// Classification Top-1 Accuracy (%) — FILL IN exact values from paper Figure 5
const clsData = {
  "chart-cub": [
    88.95,
    79.89,
    91.65,
    82.67,
    79.54,
    89.92,
    80.08
  ],
  "chart-dogs": [
    87.69,
    81.24,
    90.5,
    80.07,
    80.73,
    89.09,
    77.02
  ],
  "chart-cars": [
    94.3,
    92.36,
    91.72,
    88.43,
    87.56,
    93.34,
    90.67
  ],
  "chart-aircraft": [
    70.27,
    63.4,
    78.88,
    50.47,
    62.46,
    79.05,
    51.15
  ],
  "chart-flowers": [
    99.45,
    98.46,
    99.69,
    95.59,
    98.04,
    99.41,
    97.43
  ],
  "chart-inat": [
    64.7,
    40.59,
    77.07,
    43.55,
    39.77,
    57.9,
    38.9
  ],
  "chart-food": [
    95.67,
    92.38,
    95.12,
    89.13,
    94.53,
    96.07,
    88.9
  ],
  "chart-clothes": [
    72.03,
    71.45,
    66.7,
    65.45,
    68.69,
    71.12,
    69.37
  ],
  "chart-vegfru": [
    94.73,
    91.08,
    96.44,
    85.84,
    90.72,
    95.57,
    86.98
  ],
  "chart-products": [
    65.05,
    39.12,
    58.88,
    49.21,
    51.31,
    58.03,
    54.33
  ],
  "chart-skincon": [
    94.49,
    86.7,
    94.79,
    86.42,
    81.29,
    94.53,
    73.9
  ],
  "chart-wine": [
    92.53,
    90.72,
    96.36,
    88.85,
    93.98,
    94.07,
    90.7
  ]
};

const retriData = {
  "chart-cub": [
    90.33,
    77.38,
    91.95,
    84.06,
    75.63,
    91.47,
    74.8
  ],
  "chart-dogs": [
    89.47,
    79.46,
    91.72,
    82.96,
    77.43,
    92.33,
    74.16
  ],
  "chart-cars": [
    95.11,
    88.44,
    89.53,
    88.77,
    85.49,
    92.47,
    86.64
  ],
  "chart-aircraft": [
    77.81,
    69.46,
    81.07,
    57.64,
    63.56,
    79.86,
    50.66
  ],
  "chart-flowers": [
    99.6,
    96.88,
    99.7,
    95.98,
    96.24,
    99.66,
    95.11
  ],
  "chart-inat": [
    38.65,
    36.88,
    40.58,
    31.83,
    34.79,
    42.97,
    35.67
  ],
  "chart-food": [
    95.09,
    85.79,
    92.48,
    86.27,
    87.55,
    96.17,
    81.77
  ],
  "chart-clothes": [
    73.69,
    69.55,
    69.53,
    66.4,
    67.86,
    70.68,
    68.78
  ],
  "chart-vegfru": [
    93.77,
    85.54,
    95.06,
    83.89,
    79.04,
    95.88,
    78.06
  ],
  "chart-products": [
    48.05,
    32.94,
    30.05,
    37.36,
    30.85,
    44.08,
    29.29
  ],
  "chart-skincon": [
    67.32,
    60.23,
    62.49,
    62.48,
    61.44,
    64.86,
    60.51
  ],
  "chart-wine": [
    70.66,
    65.4,
    78.77,
    68.5,
    65.19,
    71.61,
    62.84
  ]
};

let charts = {};
let currentView = 'cls';

function createChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  // Set global defaults for academic feel
  Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
  Chart.defaults.color = '#64748b';

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: modelNames,
      datasets: [{
        label: 'Performance (%)',
        data: data,
        backgroundColor: modelColors.map(c => c + 'dd'), // Muted transparency
        hoverBackgroundColor: modelColors, // Solid on hover
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barPercentage: 0.65,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      },
      plugins: {
        legend: {
          display: false // Hidden redundant individual legends
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#ffffff',
          titleColor: '#1e293b',
          bodyColor: '#4f46e5', // Brand color for value
          bodyFont: { size: 13, weight: 'bold' },
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          usePointStyle: true,
          boxPadding: 6,
          callbacks: {
            label: (context) => ` ${context.dataset.label}: ${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          border: { display: false },
          grid: {
            color: '#e2e8f0',
            tickLength: 0,
            drawTicks: false,
            borderDash: [4, 4] // Dashed lines
          },
          ticks: {
            font: { size: 11 },
            color: '#94a3b8',
            stepSize: 20,
            callback: value => value + '%'
          }
        },
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            display: false // Hide x-axis labels as they are redundant with legend
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
}

function initCharts() {
  const data = currentView === 'cls' ? clsData : retriData;
  Object.keys(data).forEach(id => {
    let chart = createChart(id, data[id]);
    if (chart) charts[id] = chart;
  });
}

function switchView(view) {
  currentView = view;
  const data = view === 'cls' ? clsData : retriData;
  Object.keys(charts).forEach(id => {
    if (charts[id]) {
      charts[id].data.datasets[0].data = data[id];
      charts[id].update('none');
    }
  });

  // Toggle Pill-tab styles using classes
  const btnCls = document.getElementById('btn-cls');
  const btnRetri = document.getElementById('btn-retri');
  if (btnCls && btnRetri) {
    if (view === 'cls') {
      btnCls.classList.add('is-active');
      btnRetri.classList.remove('is-active');
    } else {
      btnCls.classList.remove('is-active');
      btnRetri.classList.add('is-active');
    }
  }
}

document.addEventListener('DOMContentLoaded', initCharts);

// Interactive QA Showcase Task Data
const qaTasks = [
  {
    title: "The original VL problem: Attribute Recognition",
    image: "static/images/task3_attribute.png",
    content: `
      <div class="qa-q">Q: What is the eye color of the bird in this image? Choose one answer from the following list: [blue, black, ..., red, rufous]</div>
      <div class="qa-ans">GT: black</div>
      <div class="qa-q" style="margin-top: 1.5rem;">Q: Is the eye color of the bird in this image black?</div>
      <div class="qa-ans">GT: True</div>
    `
  },
  {
    title: "The original VL problem: Knowledge Bias Estimation",
    image: "static/images/intro.png",
    content: `
      <div class="qa-q">Q_P: From your observation, is the species of the dog shown a Chihuahua?</div>
      <div class="qa-ans">GT: Yes</div>
      <div class="qa-q" style="margin-top: 1.5rem;">Q_N: Does this dog belong to the species known as japanese spaniel?</div>
      <div class="qa-ans">GT: No</div>
    `
  },
  {
    title: "The original VL problem: Hierarchical Granularity Recognition",
    image: "static/images/task1_hierarchical.png",
    content: `
      <div class="qa-q">Class: Is the class of the object aves?</div>
      <div class="qa-ans">GT: True</div>
      <div class="qa-q" style="margin-top: 1.5rem;">Genus: What is the genus of the object? [auklet, cormorant, bunting, towhee]</div>
      <div class="qa-ans">GT: towhee</div>
      <div class="qa-q" style="margin-top: 1.5rem;">Species: What is the species of the object?</div>
    `
  },
  {
    title: "Constructed Granularity Aligned Sample",
    image: "static/images/app_dis_math_granularity.png",
    content: `
      <div class="qa-q">Q: What is the object species?</div>
      <div class="qa-ans">Answer: The object species is great crested flycatcher.</div>
    `
  }
];

function switchQATab(index, btn) {
    const task = qaTasks[index];
    if (!task) return;

    // Update Image with fade out/in
    const imgEl = document.getElementById('qa-display-img');
    if (imgEl) {
        imgEl.style.opacity = '0.3';
        setTimeout(() => {
            imgEl.src = task.image;
            imgEl.style.opacity = '1';
        }, 150);
    }

    // Update Title & Content with fade out/in
    const titleEl = document.getElementById('qa-display-title');
    const contentEl = document.getElementById('qa-display-content');
    
    if (titleEl) titleEl.innerText = task.title;
    if (contentEl) {
        contentEl.style.opacity = '0';
        setTimeout(() => {
            contentEl.innerHTML = task.content;
            contentEl.style.opacity = '1';
        }, 150);
    }

    // Update Button State
    const btns = document.querySelectorAll('.qa-tab-btn');
    btns.forEach(b => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
}
