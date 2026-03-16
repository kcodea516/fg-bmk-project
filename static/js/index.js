window.HELP_IMPROVE_VIDEOJS = false;

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
function scrollToTop() {
    const duration = 500; // Faster duration in ms
    const scrollStep = -window.scrollY / (duration / 15);

    // Immediate feedback: hide button or add active state
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) scrollButton.style.transform = 'scale(0.9) translateY(2px)';

    function step() {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
            requestAnimationFrame(step);
        } else {
            // Restore button scale if needed, though it will be hidden
            if (scrollButton) scrollButton.style.transform = '';
        }
    }
    requestAnimationFrame(step);
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

})

// --- Per-Dataset Results Chart Logic (Moved from index.html) ---
// TODO: Replace ALL zeros below with EXACT values from the paper.
// Order: [EVA-CLIP, CoCa, DINOv2, BEiT3, LLaVA, InternVL, Qwen]
const modelColors = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#db2777', '#ea580c', '#7c3aed'];
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
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: modelNames,
      datasets: [{
        data: data,
        backgroundColor: modelColors.map(c => c + '33'),
        borderColor: modelColors,
        borderWidth: 1.5,
        borderRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }, tooltip: {
          callbacks: { label: ctx => ctx.parsed.y + '%' }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { font: { size: 9 }, stepSize: 25 }, grid: { color: '#f0f0f0' } },
        x: { display: false }
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
  const btnCls = document.getElementById('btn-cls');
  const btnRetri = document.getElementById('btn-retri');
  if (btnCls) {
    btnCls.style.background = view === 'cls' ? '#4f46e5' : 'white';
    btnCls.style.color = view === 'cls' ? 'white' : '#4f46e5';
  }
  if (btnRetri) {
    btnRetri.style.background = view === 'retri' ? '#4f46e5' : 'white';
    btnRetri.style.color = view === 'retri' ? 'white' : '#4f46e5';
  }
}

document.addEventListener('DOMContentLoaded', initCharts);
