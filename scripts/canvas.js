// Borrowed from https://codepen.io/alexzaworski/pen/mEZvrG
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let cH;
let cW;
let bgColor = "#373f47";
let animations = [];
let circles = [];

const mult = {
  d: 2.25,
  r: 1.5,
  p: 0.5
}

// dev-tools
const sliders = [
  ['duration', 'd'],
  ['radius', 'r'],
  ['particle', 'p']
]
sliders.forEach(([key, target, min = 0.1, max = 5]) => {
  const slider = document.getElementById(`${key}Range`);
  const output = document.getElementById(`${key}Val`);

  slider.value = scale(mult[target], min, max, 0, 100)
  output.innerHTML = `${key} ${mult[target]}`

  slider.oninput = function() {
    mult[target] = round(scale(this.value, 0, 100, min, max))
    output.innerHTML = `${key} ${mult[target]}`
  }
})

function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function scale (value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
  var targetRange = targetRangeMax - targetRangeMin;
  var sourceRange = sourceRangeMax - sourceRangeMin;
  return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
}
//////////////////

let colorPicker = (function() {
  let colors = [
    "#A85751",
    "#FFB4B4",
    "#B2A4FF",
    "#373f47",
    "#f2b880",
    "#FFDEB4",
    "#DBF9F4",
  ]
  let index = 0;
  function next () {
    index = index++ < colors.length - 1 ? index : 0;
    return colors[index];
  }
  function current () {
    return colors[index]
  }
  return {
    next: next,
    current: current
  }
})();

function removeAnimation (animation) {
  let index = animations.indexOf(animation);
  if(index > -1) animations.splice(index, 1);
}

function calcPageFillRadius (x, y) {
  let l = Math.max(x - 0, cW - x);
  let h = Math.max(y - 0, cH - y);
  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners () {
  document.addEventListener("touchstart", handleEvent);
  document.addEventListener("mousedown", handleEvent);
};

function handleEvent (e) {
  if(e.touches) {
    e.preventDefault();
    e = e.touches[0];
  }
  let currentColor = colorPicker.current();
  let nextColor = colorPicker.next();
  let targetR = mult.r * calcPageFillRadius(e.pageX, e.pageY);
  let rippleSize = mult.r * Math.min(200, (cW * .4));
  let minCoverDuration = mult.d * 750;

  let pageFill = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: nextColor
  });
  let fillAnimation = anime({
    targets: pageFill,
    r: targetR,
    duration: mult.d * Math.max(targetR / 2, minCoverDuration),
    easing: "easeOutQuart",
    complete: function() {
      bgColor = pageFill.fill;
      removeAnimation(fillAnimation);
    }
  });

  let ripple = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: currentColor,
    stroke: {
      width: 3,
      color: currentColor
    },
    opacity: 1
  });
  let rippleAnimation = anime({
    targets: ripple,
    r: rippleSize,
    opacity: 0,
    easing: "easeOutExpo",
    duration: mult.d * 900,
    complete: removeAnimation
  });

  let particles = [];
  for(let i = 0; i < mult.p * 32; i++) {
    let particle = new Circle({
      x: e.pageX,
      y: e.pageY,
      fill: currentColor,
      r: anime.random(24, 48),
      opacity: 1
    })
    particles.push(particle);
  }
  let particlesAnimation = anime({
    targets: particles,
    x: function(particle) {
      return particle.x + anime.random(rippleSize, -rippleSize);
    },
    y: function(particle) {
      return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
    },
    r: 0,
    opacity: 0,
    easing: "easeOutExpo",
    duration: mult.d * anime.random(1000, 1300),
    complete: removeAnimation
  });
  animations.push(
    fillAnimation,
    rippleAnimation,
    particlesAnimation
  );
}

function extend (a, b) {
  for(let key in b) {
    if(b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

let Circle = function(opts) {
  extend(this, opts);
}

Circle.prototype.draw = function() {
  ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if(this.stroke) {
    ctx.strokeStyle = this.stroke.color;
    ctx.lineWidth = this.stroke.width;
    ctx.stroke();
  }
  if(this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  ctx.closePath();
  ctx.globalAlpha = 1;
}

let animate = anime({
  duration: Infinity,
  update: function() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cW, cH);
    animations.forEach(function(anim) {
      anim.animatables.forEach(function(animatable) {
        animatable.target.draw();
      });
    });
  }
});

let resizeCanvas = function() {
  cW = window.innerWidth;
  cH = window.innerHeight;
  c.width = cW * devicePixelRatio;
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init () {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  addClickListeners();
  handleInactiveUser();
})();

function handleInactiveUser () {
  let inactive = setTimeout(function() {
    fauxClick(anime.random(cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
  }, 4000);

  function clearInactiveTimeout () {
    clearTimeout(inactive);
    document.removeEventListener("mousedown", clearInactiveTimeout);
    document.removeEventListener("touchstart", clearInactiveTimeout);
  }

  document.addEventListener("mousedown", clearInactiveTimeout);
  document.addEventListener("touchstart", clearInactiveTimeout);
}

function startFauxClicking () {
  setTimeout(function() {
    fauxClick(anime.random(cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
    startFauxClicking();
  }, anime.random(2000, 9000));
}

function fauxClick (x, y) {
  let fauxClick = new Event("mousedown");
  fauxClick.pageX = x;
  fauxClick.pageY = y;
  document.dispatchEvent(fauxClick);
}