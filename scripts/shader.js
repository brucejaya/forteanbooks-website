/* ── Shader: domain-warped FBM noise (Inigo Quilez technique) ───────────────
   Shared across pages that have a WebGL canvas background.
   Call: runShader(canvasId, speed)
   Falls back silently to CSS background if WebGL unavailable.
   ─────────────────────────────────────────────────────────────────────────── */
function runShader(canvasId, speed) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return; /* CSS fallback background kicks in */

  /* ── Vertex shader ─────────────────────────────────────────────────────── */
  var VS = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}';

  /* ── Fragment shader ───────────────────────────────────────────────────── */
  /* Colours match the site palette exactly:
       --oxblood  #6e1d1d  ->  vec3(0.43, 0.11, 0.11)
       --indigo   #25365c  ->  vec3(0.15, 0.21, 0.36)
     Purple is their natural meeting point in the middle of the warp.  */
  var FS = [
    'precision mediump float;',
    'uniform float u_t;',
    'uniform vec2  u_res;',

    'float hash(vec2 p){',
    '  p=fract(p*vec2(127.1,311.7));',
    '  p+=dot(p,p+19.19);',
    '  return fract(p.x*p.y);',
    '}',

    'float noise(vec2 p){',
    '  vec2 i=floor(p),f=fract(p);',
    '  vec2 u=f*f*(3.-2.*f);',
    '  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),',
    '             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);',
    '}',

    'const mat2 MX=mat2(0.80,0.60,-0.60,0.80);',
    'float fbm(vec2 p){',
    '  float v=0.,a=0.5;',
    '  for(int i=0;i<5;i++){v+=a*noise(p);p=MX*p*2.02;a*=0.5;}',
    '  return v;',
    '}',

    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/u_res;',
    '  uv.x*=u_res.x/u_res.y;',

    '  float t=u_t*0.07;',
    '  vec2 q=vec2(fbm(uv+t),fbm(uv+vec2(5.2,1.3)));',
    '  vec2 r=vec2(fbm(uv+4.*q+vec2(1.7,9.2)+t*.15),',
    '              fbm(uv+4.*q+vec2(8.3,2.8)-t*.12));',
    '  float f=fbm(uv+4.*r);',

    /* Site palette -- boosted slightly for visibility on a dark field */
    '  vec3 cDark  =vec3(0.04,0.03,0.07);',   /* near-black base              */
    '  vec3 cRed   =vec3(0.52,0.11,0.11);',   /* oxblood -- #6e1d1d           */
    '  vec3 cBlue  =vec3(0.13,0.19,0.45);',   /* indigo  -- #25365c           */
    '  vec3 cPurple=vec3(0.30,0.08,0.28);',   /* midpoint -- where they merge */

    /* r.x vs r.y drives the red/blue spatial split */
    '  float split=clamp((r.x-r.y)*2.2+0.5,0.,1.);',
    '  vec3 hue=mix(cBlue,cRed,split);',
    /* Purple swells up where the two sides meet (split ~0.5) */
    '  float mid=1.-abs(split*2.-1.);',
    '  hue=mix(hue,cPurple,mid*0.85);',

    /* Luminance: dark base, colour revealed by noise intensity */
    '  vec3 col=mix(cDark,hue,clamp(f*2.4-0.2,0.,1.));',

    /* Subtle hot highlights in peaks */
    '  float peak=clamp(f*3.-1.8,0.,1.);',
    '  col+=cRed*0.12*peak*split+cBlue*0.12*peak*(1.-split);',

    /* Edge vignette */
    '  vec2 vp=gl_FragCoord.xy/u_res;',
    '  float vig=pow(vp.x*(1.-vp.x)*vp.y*(1.-vp.y)*16.,0.18);',
    '  col*=mix(0.45,1.,vig);',

    '  gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  /* ── Compile & link ────────────────────────────────────────────────────── */
  function mkShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s); return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  /* ── Fullscreen quad ───────────────────────────────────────────────────── */
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uT   = gl.getUniformLocation(prog, 'u_t');
  var uRes = gl.getUniformLocation(prog, 'u_res');

  /* ── Resize handler ────────────────────────────────────────────────────── */
  function resize() {
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── Render loop ───────────────────────────────────────────────────────── */
  var t0 = performance.now();
  (function frame() {
    resize();
    gl.uniform1f(uT,   (performance.now() - t0) * 0.001 * speed);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  })();
}
