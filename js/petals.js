/* Falling petals background + on/off toggle */
(function () {
  var c = document.getElementById('petals'),
      x = c.getContext('2d'),
      W, H, on = true, raf;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    var d = window.devicePixelRatio || 1;
    W = innerWidth;
    H = innerHeight;
    c.width = W * d;
    c.height = H * d;
    x.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener('resize', size);
  size();

  var cols = ['#f4bfce', '#f7cfdb', '#efa9bf', '#fbdde5'];

  function P(init) { this.reset(init); }

  P.prototype.reset = function (init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : -20;
    this.s = 5 + Math.random() * 5;
    this.vy = .35 + Math.random() * .5;
    this.ph = Math.random() * 6.28;
    this.sw = .6 + Math.random() * .9;
    this.rot = Math.random() * 6.28;
    this.vr = (Math.random() - .5) * .02;
    this.a = .45 + Math.random() * .4;
    this.col = cols[Math.floor(Math.random() * cols.length)];
  };

  P.prototype.step = function (t) {
    this.y += this.vy;
    this.x += Math.sin(t / 1400 + this.ph) * this.sw * .5;
    this.rot += this.vr;
    if (this.y > H + 20 || this.x > W + 30 || this.x < -30) this.reset(false);
  };

  P.prototype.draw = function (t) {
    var flip = Math.abs(Math.sin(t / 900 + this.ph));
    x.save();
    x.translate(this.x, this.y);
    x.rotate(this.rot);
    x.scale(1, .55 + .45 * flip);
    x.globalAlpha = this.a;
    x.fillStyle = this.col;
    var s = this.s;
    x.beginPath();
    x.moveTo(0, -s);
    x.bezierCurveTo(s * .9, -s * .7, s * .8, s * .6, 0, s);
    x.bezierCurveTo(-s * .8, s * .6, -s * .9, -s * .7, 0, -s);
    x.fill();
    x.restore();
  };

  var n = Math.min(36, Math.round(W / 36)), ps = [];
  for (var i = 0; i < n; i++) ps.push(new P(true));

  function loop(t) {
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < ps.length; i++) {
      ps[i].step(t);
      ps[i].draw(t);
    }
    raf = requestAnimationFrame(loop);
  }

  var b = document.getElementById('tog');

  function set(v) {
    on = v;
    b.textContent = 'Petals: ' + (v ? 'on' : 'off');
    b.setAttribute('aria-pressed', v);
    cancelAnimationFrame(raf);
    if (v) raf = requestAnimationFrame(loop);
    else x.clearRect(0, 0, W, H);
  }

  b.addEventListener('click', function () { set(!on); });
  set(!reduce);
})();
