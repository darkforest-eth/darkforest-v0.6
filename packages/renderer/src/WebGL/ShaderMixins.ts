/**
 * these are 'includes' that you can add into shader template strings as in `${include}`
 */
export class ShaderMixins {
  public static PI = `
    #define PI 3.1415926535
  `;
  public static desaturate = `
    vec4 desaturate(vec4 color, float factor) {
      vec3 lum = vec3(0.299, 0.587, 0.114);
      vec3 gray = vec3(dot(lum, color.rgb));
      return vec4(mix(color.rgb, gray, factor), color.a);
    }
  `;

  /** 1 minus source alpha blend mode */
  public static blend = `
    vec4 blend(vec4 fg, vec4 bg) {
      vec3 cOut = fg.rgb * fg.a + bg.rgb * bg.a * (1. - fg.a);
      float aOut = fg.a + bg.a * (1. - fg.a);
      
      return vec4(cOut, aOut);
    }
  `;

  // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  // generic 3d noise seems to output from 0 to 1
  public static noiseVec3 = `
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

    float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);

      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);

      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);

      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));

      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

      return o4.y * d.y + o4.x * (1.0 - d.y);
    }
  `;

  /* returns radius of a blob at angle theta as a float from 0 to 1. requires the above guy (noiseVec3)
   used for asteroids and belts. */
  public static radAtAngle = `
    float radAtAngle(float angle, float offset) {
      vec2 ptOnCircle = vec2(cos(angle), sin(angle));
      float noiseAtAngle = 0.5 * noise(vec3(0.8 * ptOnCircle, offset));
      return 1.0 - noiseAtAngle;
    }
  `;

  /* clips a float to be mod 2pi. useful because sin() and cos() sometimes get mad otherwise. */
  public static mod2pi = `
    float mod2pi(float theta) {
      float twoPi = 6.283185307;
      return theta - twoPi * floor(theta / twoPi);
    }
  `;

  public static modFloat = `
    float modF(float a1, float a2) {
      return a1 - a2 * floor(a1 / a2);
    }
  `;

  /** Good atan that returns [0, 2Pi) */
  public static arcTan = `
    float arcTan(float y, float x) {
      float arcT = atan(y, x); // [-Pi, Pi]
      float vertical = y > 0. ? PI / 2. : PI / -2.; // deal with discontinuity at x = 0
      float thetaOffset = x == 0. ? vertical : arcT;
      float theta = thetaOffset + PI; // [0, 2 * Pi]

      return theta;
    }
  `;

  /** Fade out the last `tail * 100` percent of `value` to 0 - a plateau with a steep dropoff */
  public static fade = `
    float fade(float value, float tail) {
      float tailFactor = 1. / tail;

      float alpha = 1.;
      if (value > 1. - tail) alpha -= tailFactor * (value - (1. - tail));

      return alpha;
    }
  `;

  /**
   * 4d simplex noise - `snoise(vec4)`, seems to return `[-1, 1]`
   * https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
   */
  public static simplex4 = `
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

    vec4 grad4(float j, vec4 ip){
      const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
      vec4 p,s;

      p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
      p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
      s = vec4(lessThan(p, vec4(0.0)));
      p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

      return p;
    }

    float snoise(vec4 v){
      const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                            0.309016994374947451); // (sqrt(5) - 1)/4   F4
      // First corner
      vec4 i  = floor(v + dot(v, C.yyyy) );
      vec4 x0 = v -   i + dot(i, C.xxxx);

      // Other corners

      // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
      vec4 i0;

      vec3 isX = step( x0.yzw, x0.xxx );
      vec3 isYZ = step( x0.zww, x0.yyz );
      i0.x = isX.x + isX.y + isX.z;
      i0.yzw = 1.0 - isX;

      i0.y += isYZ.x + isYZ.y;
      i0.zw += 1.0 - isYZ.xy;

      i0.z += isYZ.z;
      i0.w += 1.0 - isYZ.z;

      // i0 now contains the unique values 0,1,2,3 in each channel
      vec4 i3 = clamp( i0, 0.0, 1.0 );
      vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
      vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

      //  x0 = x0 - 0.0 + 0.0 * C 
      vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
      vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
      vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
      vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

      // Permutations
      i = mod(i, 289.0); 
      float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
      vec4 j1 = permute( permute( permute( permute (
                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
              + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
              + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
              + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
              
      // Gradients
      // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
      // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

      vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

      vec4 p0 = grad4(j0,   ip);
      vec4 p1 = grad4(j1.x, ip);
      vec4 p2 = grad4(j1.y, ip);
      vec4 p3 = grad4(j1.z, ip);
      vec4 p4 = grad4(j1.w, ip);

      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      p4 *= taylorInvSqrt(dot(p4,p4));

      // Mix contributions from the five corners
      vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
      vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
      m0 = m0 * m0;
      m1 = m1 * m1;
      return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                  + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
    }
  `;

  /**
   * 3d perlin noise - `cnoise(vec3)`, returns `[-1, 1]`
   * https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
   */
  public static perlin3 = `
    //	Classic Perlin 3D Noise 
    //	by Stefan Gustavson
    
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }
  `;

  // useful seeded random function
  public static seededRandom = `
    float seededRandom(float s) {
      return fract(sin(s) * 7626.1234);
    }
  `;

  public static seededRandomVec2 = `
    float seededRandomVec2(vec2 co){
      return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
    }
  `;

  // inverts colors
  public static invertColors = `
    vec4 invert(vec4 cin) {
      return vec4(1. - cin.r, 1. - cin.g, 1. - cin.b, cin.a);
    }
  `;

  // hue shift
  // https://gist.github.com/mairod/a75e7b44f68110e1576d77419d608786
  public static hueShift = `
    vec3 hueShift(vec3 color, float hueAdjust) {
      const vec3 kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
      const vec3 kRGBToI      = vec3 (0.596, -0.275, -0.321);
      const vec3 kRGBToQ      = vec3 (0.212, -0.523, 0.311);

      const vec3 kYIQToR      = vec3 (1.0, 0.956, 0.621);
      const vec3 kYIQToG      = vec3 (1.0, -0.272, -0.647);
      const vec3 kYIQToB      = vec3 (1.0, -1.107, 1.704);
  
      float YPrime  = dot (color, kRGBToYPrime);
      float I       = dot (color, kRGBToI);
      float Q       = dot (color, kRGBToQ);
      float hue     = atan (Q, I);
      float chroma  = sqrt (I * I + Q * Q);
  
      hue += hueAdjust;
  
      Q = chroma * sin (hue);
      I = chroma * cos (hue);
  
      vec3    yIQ   = vec3 (YPrime, I, Q);
  
      return vec3( dot (yIQ, kYIQToR), dot (yIQ, kYIQToG), dot (yIQ, kYIQToB) );
    }
  `;

  // needs hueShift and invertColors
  public static invertBrightness = `
    vec4 invertBrightness(vec4 cin) {
      vec4 shifted = vec4(hueShift(cin.rgb, 3.141593), 1.);
      return invert(shifted);
    }
  `;
}
