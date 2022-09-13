import { MAX_PERLIN_VALUE } from '@darkforest_eth/hashing';
import { AttribType, UniformType } from '@darkforest_eth/types';
import { glsl } from '../EngineUtils';
import { ShaderMixins } from '../WebGL/ShaderMixins';

const a = {
  position: 'a_position',

  p0topGrad: 'a_p0topGrad',
  p0botGrad: 'a_p0botGrad',

  p1topGrad: 'a_p1topGrad',
  p1botGrad: 'a_p1botGrad',

  p2topGrad: 'a_p2topGrad',
  p2botGrad: 'a_p2botGrad',

  worldCoords: 'a_worldCoords', // 0 to 1
};
const u = {
  matrix: 'u_matrix', // matrix to convert from world coords to clipspace
  thresholds: 'u_thresholds',
  lengthScale: 'u_lengthScale',
  viewportZoom: 'u_viewportZoom',
  time: 'u_time',

  innerNebulaColor: 'u_innerNebulaColor',
  nebulaColor: 'u_nebulaColor',
  spaceColor: 'u_spaceColor',
  deepSpaceColor: 'u_deepSpaceColor',
  deadSpaceColor: 'u_deadSpaceColor',
};
const v = {
  p0topLeftGrad: 'v_p0topLeftGrad',
  p0topRightGrad: 'v_p0topRightGrad',
  p0botLeftGrad: 'v_p0botLeftGrad',
  p0botRightGrad: 'v_p0botRightGrad',

  p1topLeftGrad: 'v_p1topLeftGrad',
  p1topRightGrad: 'v_p1topRightGrad',
  p1botLeftGrad: 'v_p1botLeftGrad',
  p1botRightGrad: 'v_p1botRightGrad',

  p2topLeftGrad: 'v_p2topLeftGrad',
  p2topRightGrad: 'v_p2topRightGrad',
  p2botLeftGrad: 'v_p2botLeftGrad',
  p2botRightGrad: 'v_p2botRightGrad',

  worldCoords: 'v_worldCoords', // 0 to 1
  position: 'v_position',
};

const gradProps = {
  dim: 4,
  type: AttribType.Float,
  normalize: false,
};

export const SPACE_PROGRAM_DEFINITION = {
  uniforms: {
    matrix: { name: u.matrix, type: UniformType.Mat4 },
    thresholds: { name: u.thresholds, type: UniformType.Vec3 },
    lengthScale: { name: u.lengthScale, type: UniformType.Float },
    viewportZoom: { name: u.viewportZoom, type: UniformType.Float },
    time: { name: u.time, type: UniformType.Float },
    innerNebulaColor: { name: u.innerNebulaColor, type: UniformType.Vec3 },
    nebulaColor: { name: u.nebulaColor, type: UniformType.Vec3 },
    spaceColor: { name: u.spaceColor, type: UniformType.Vec3 },
    deepSpaceColor: { name: u.deepSpaceColor, type: UniformType.Vec3 },
    deadSpaceColor: { name: u.deadSpaceColor, type: UniformType.Vec3 },
  },
  attribs: {
    position: {
      dim: 2,
      type: AttribType.Float,
      normalize: false,
      name: a.position,
    },
    worldCoords: {
      dim: 2,
      type: AttribType.Float,
      normalize: false,
      name: a.worldCoords,
    },

    p0topGrad: {
      ...gradProps,
      name: a.p0topGrad,
    },
    p0botGrad: {
      ...gradProps,
      name: a.p0botGrad,
    },

    p1topGrad: {
      ...gradProps,
      name: a.p1topGrad,
    },
    p1botGrad: {
      ...gradProps,
      name: a.p1botGrad,
    },

    p2topGrad: {
      ...gradProps,
      name: a.p2topGrad,
    },
    p2botGrad: {
      ...gradProps,
      name: a.p2botGrad,
    },
  },
  vertexShader: glsl`
    in vec4 ${a.position};

    in vec4 ${a.p0topGrad};
    in vec4 ${a.p0botGrad};
    in vec4 ${a.p1topGrad};
    in vec4 ${a.p1botGrad};
    in vec4 ${a.p2topGrad};
    in vec4 ${a.p2botGrad};

    in vec2 ${a.worldCoords};

    uniform mat4 ${u.matrix};

    out vec2 ${v.p0topLeftGrad};
    out vec2 ${v.p0topRightGrad};
    out vec2 ${v.p0botLeftGrad};
    out vec2 ${v.p0botRightGrad};

    out vec2 ${v.p1topLeftGrad};
    out vec2 ${v.p1topRightGrad};
    out vec2 ${v.p1botLeftGrad};
    out vec2 ${v.p1botRightGrad};

    out vec2 ${v.p2topLeftGrad};
    out vec2 ${v.p2topRightGrad};
    out vec2 ${v.p2botLeftGrad};
    out vec2 ${v.p2botRightGrad};

    out vec2 ${v.worldCoords};
    out vec4 ${v.position};

    void main() {
      gl_Position = ${u.matrix} * ${a.position};

      ${v.worldCoords} = ${a.worldCoords};
      ${v.position} = ${a.position};

      ${v.p0topLeftGrad} = ${a.p0topGrad}.xy;
      ${v.p0topRightGrad} = ${a.p0topGrad}.zw;
      ${v.p0botLeftGrad} = ${a.p0botGrad}.xy;
      ${v.p0botRightGrad} = ${a.p0botGrad}.zw;

      ${v.p1topLeftGrad} = ${a.p1topGrad}.xy;
      ${v.p1topRightGrad} = ${a.p1topGrad}.zw;
      ${v.p1botLeftGrad} = ${a.p1botGrad}.xy;
      ${v.p1botRightGrad} = ${a.p1botGrad}.zw;

      ${v.p2topLeftGrad} = ${a.p2topGrad}.xy;
      ${v.p2topRightGrad} = ${a.p2topGrad}.zw;
      ${v.p2botLeftGrad} = ${a.p2botGrad}.xy;
      ${v.p2botRightGrad} = ${a.p2botGrad}.zw;
    }
  `,
  fragmentShader: glsl`
    precision highp float;
    out vec4 outColor;

    in vec2 ${v.p0topLeftGrad};
    in vec2 ${v.p0topRightGrad};
    in vec2 ${v.p0botLeftGrad};
    in vec2 ${v.p0botRightGrad};

    in vec2 ${v.p1topLeftGrad};
    in vec2 ${v.p1topRightGrad};
    in vec2 ${v.p1botLeftGrad};
    in vec2 ${v.p1botRightGrad};

    in vec2 ${v.p2topLeftGrad};
    in vec2 ${v.p2topRightGrad};
    in vec2 ${v.p2botLeftGrad};
    in vec2 ${v.p2botRightGrad};

    in vec2 ${v.worldCoords};
    in vec4 ${v.position};

    uniform vec3 ${u.thresholds};

    uniform float ${u.lengthScale};
    uniform float ${u.viewportZoom};
    uniform float ${u.time};

    // space type palette
    uniform vec3 ${u.innerNebulaColor};
    uniform vec3 ${u.nebulaColor};
    uniform vec3 ${u.spaceColor};
    uniform vec3 ${u.deepSpaceColor};
    uniform vec3 ${u.deadSpaceColor};

    ${ShaderMixins.modFloat}
    ${ShaderMixins.perlin3}

    // interpolates map data to produce space type
    float perlin(float scale, float x, float y, vec2 blGrad, vec2 brGrad, vec2 tlGrad, vec2 trGrad) {
      float gridX = floor(x / scale) * scale;
      float gridY = floor(y / scale) * scale;

      float px = (x - gridX) / scale;
      float py = (y - gridY) / scale;

      // 0 to 1 within each chunk
      vec2 pos = vec2(px, py); 

      vec2 botLeftDiff = pos - vec2(0., 0.);
      vec2 botRightDiff = pos - vec2(1., 0.);
      vec2 topLeftDiff = pos - vec2(0., 1.);
      vec2 topRightDiff = pos - vec2(1., 1.);

      float botLeft = dot(botLeftDiff, blGrad);
      float botRight = dot(botRightDiff, brGrad);
      float topLeft = dot(topLeftDiff, tlGrad);
      float topRight = dot(topRightDiff, trGrad);

      float botLeftW = pos.x * pos.y;
      float botRightW = (1. - pos.x) * pos.y;
      float topLeftW = pos.x * (1. - pos.y);
      float topRightW = (1. - pos.x) * (1. - pos.y);

      float res = botLeft * topRightW + 
                  botRight * topLeftW + 
                  topLeft * botRightW + 
                  topRight * botLeftW;

      return res;
    }

    // [STARS]
    #define volsteps 20 // how many "layers" of stars to generate
    #define stepsize 0.11 // difference between the layers

    #define iterations 13 // how much detail per layer, more detail -> more flickering
    #define formuparam 0.885 // kinda magic, greatly increases background detail when lowered

    #define zoom   0.002 // increases star size, looks good but becomes distracting
    #define tile   0.650 // determines how the underlying pattern tiles, adjust if seeing 4 copies of the same star

    #define intensity 0.008 // strength of the star effect, more intensity -> big bright stars
    #define brightness 0.0006 // base brightness level
    #define darkmatter 0.600
    #define distfading 0.730 // how much do the stars fade based on "depth" from camera
    #define saturation 0.950 // color saturation, less -> monochrome
    #define boost 0.0135 // stars too bright? turn this down as a first stop

    #define starResolution vec2(256., 256.) // virtual resolution used to render the stars, scales the coordinate space

    // [ZOOM]
    #define zoomAttenuation 16.0 // how rapidly does zoom impact star visibility
    #define minStarVisibility 0.0 // how dim do the stars get at full zoom
    #define maxViewportZoom 100. // what level of viewport zoom to consider as "fully zoomed out"
    #define zoomOffset 0. // moves the midpoint of the zoom easing function, adjust peak star visibility point

    #define parallaxFactor 0.00002 // how fast do the stars move relative to viewport

    // [CLOUDS]
    #define enableClouds true // toggle cloud effects
    #define cloudRegionScale 3600. // scale of the cloud "pockets" that form
    #define cloudScale 64. // scale of the noise rendered within the pockets
    #define cloudSpeed .5 // speed of cloud animation
    #define cloudParallaxFactor 0. // optionally: scroll clouds at a different speed to viewport

    // [MISC]
    #define enableSmoothTransitions true // if disabled we render simplified noise contours
    #define enableSpaceTypeBlending false // if disabled we don't add a border between space types

    ${ShaderMixins.PI}

    #define NEBULA 0
    #define SPACE 1
    #define DEEP_SPACE 2
    #define DEAD_SPACE 3

    // Forked from https://www.shadertoy.com/view/XlfGRj
    vec4 starNest(vec2 pos, int spaceType)
    {
      // the "resolution" of the star effect, how big are the stars?
      vec2 res = starResolution;
      vec2 uv = pos.xy / res.xy - 0.5; // map into UV space and center
      float spaceTypeF = float(spaceType);

      // starting point, we do iterative passes starting at "from" and moving by "dir" each pass
      vec3 dir = vec3(uv * zoom, 1.);
      vec3 from = vec3(1., .5, .5);

      // each space type has different parallax scale
      float parallax = float(spaceType + 1) * parallaxFactor;
      from += vec3(parallax*${v.position}.x, -parallax*${v.position}.y, 0);

      float s = intensity, fade = 1.;
      vec3 v = vec3(.5);
      float q = (formuparam - 0.002 * spaceTypeF); // tweak star render parameter based on spaceType

      for (int r = 0; r < volsteps; r++) {
        vec3 p = from + s*dir*.5;
        p = abs(vec3(tile) - mod(p, vec3(tile*2.))); // tiling fold
        float pa, a=pa=0.;

        // alter how many layers of stars depending on space type
        for (int i=0; i < iterations - int(spaceTypeF / 2.); i++) { 
          p = abs(p) / dot(p, p) - q; // the magic formula
          a += abs(length(p) - pa); // absolute sum of average change
          pa = length(p);
        }

        float dm = max(0., darkmatter - a*a*.001); //dark matter
        a *= a*a; // add contrast
        if (r>6) fade *= 1. - dm; // dark matter, don't render near
        // v += vec3(dm, dm*.5, 0.);

        v += fade;

        vec3 colorization = vec3(0.);

        // pick colour function
        if (spaceType == NEBULA) {
          // very blue
          colorization = vec3(s*s*s*s,s*s,s);
        } else if (spaceType == SPACE) {
          // realish
          colorization = vec3(s*s*s,s*s*s,s*s);
        } else if (spaceType == DEEP_SPACE) {
          // orange-red
          colorization = vec3(s,s*s,s*s*s*s);
        } else if (spaceType == DEAD_SPACE) {
          // greeny blue
          colorization = vec3(s,s*s*s,s*s*s*s);
        }

        v += colorization*a*brightness*fade; // coloring based on distance
        fade *= distfading; // distance fading
        s += stepsize;
      }

      v = mix(vec3(length(v)), v, saturation); //color adjust
      return vec4(v * boost, 1.);	 
    }

    // blends a colour (c1) with a smooth gradient between it and a second color (c2)
    // the mix between c1 and c2 is calculated by the "distance" of p in the t1 -> t2 range
    vec4 easeTransition(vec4 c1, vec4 c2, float t1, float t2, float p) {
      // adjust the power it's raised to for a narrower smoothing band
      // creates a gradient based on noise slope
      vec4 c = mix(c2, mix(c1, c2, pow((1.-(t2-p)/(t2-t1)), 4.)), 0.5);

      float dist = abs(t2 - p);
      float z = maxViewportZoom / 10.;
      float k = clamp(${u.viewportZoom}, 0., z)/z;

      if (enableSpaceTypeBlending) {
        // render a hard outline when zoomed in
        float hardOutlineThreshold = 0.00075 + ${u.viewportZoom}*0.0001;
        if (dist < hardOutlineThreshold) {
          return mix(c, c + vec4(0.3, 0.5, 0.5, 0.), 1. - k);
        }

        // render a soft glowing edge, scaled by zoom level
        float outlineThreshold = 0.0032 + ${u.viewportZoom}*0.0008;
        if (dist < outlineThreshold) {
          return mix(c, c + vec4(0., 0.2, 0.1, 0.), 1. - clamp(t2 - p, 0., outlineThreshold) / outlineThreshold);
        }
      }

      return c;
    }

    // faster version of easeTransition, skips gradients within a given
    // space type but still draws outlines
    vec4 easeTransition2(vec4 c1, vec4 c2, float t1, float t2, float p) {
      float dist = abs(t2 - p);
      float z = maxViewportZoom / 10.;
      float k = clamp(${u.viewportZoom}, 0., z)/z;

      if (enableSpaceTypeBlending) {
        // render a hard outline when zoomed in
        float hardOutlineThreshold = 0.00075 + ${u.viewportZoom}*0.0001;
        if (dist < hardOutlineThreshold) {
          return mix(c2, c2 + vec4(0.3, 0.5, 0.5, 0.), 1. - k);
        }

        // render a soft glowing edge, scaled by zoom level
        float outlineThreshold = 0.0032 + ${u.viewportZoom}*0.0008;
        if (dist < outlineThreshold) {
          return mix(c2, c2 + vec4(0., 0.2, 0.1, 0.), 1. - clamp(t2 - p, 0., outlineThreshold) / outlineThreshold);
        }
      }

      return c2;
    }


    void main() {
      float scale = ${u.lengthScale};
      float x = ${v.worldCoords}.x;
      float y = ${v.worldCoords}.y;

      // evaluate world space noise function
      float p0 = perlin(scale * 1., x, y, ${v.p0botLeftGrad}, ${v.p0botRightGrad}, ${v.p0topLeftGrad}, ${v.p0topRightGrad});
      float p1 = perlin(scale * 2., x, y, ${v.p1botLeftGrad}, ${v.p1botRightGrad}, ${v.p1topLeftGrad}, ${v.p1topRightGrad});
      float p2 = perlin(scale * 4., x, y, ${v.p2botLeftGrad}, ${v.p2botRightGrad}, ${v.p2topLeftGrad}, ${v.p2topRightGrad});

      float res = (p0 + p0 + p1 + p2) / 4.;

      float m = ${MAX_PERLIN_VALUE}.;
      float p = res * (m / 2.) + (m / 2.);

      float t1 = ${u.thresholds}.x; // NEBULA -> SPACE
      float t2 = ${u.thresholds}.y; // SPACE -> DEEP SPACE
      float t3 = ${u.thresholds}.z; // DEEP SPACE -> DEAD SPACE

      // construct and blend colours
      vec4 c0 = vec4(${u.innerNebulaColor}, 1.);
      vec4 c1 = vec4(${u.nebulaColor}, 1.);
      vec4 c2 = vec4(${u.spaceColor}, 1.);
      vec4 c3 = vec4(${u.deepSpaceColor}, 1.);
      vec4 c4 = vec4(${u.deadSpaceColor}, 1.);

      vec4 c;

      if (enableSmoothTransitions) {
        c = p < t1 ? easeTransition(c0, c1, 0., t1, p)
                   : p < t2 ? easeTransition(c1, c2, t1, t2, p)
                            : p < t3 ? easeTransition(c2, c3, t2, t3, p) 
                                     : easeTransition(c3, c4, t2, t3, p);
      } else {
        c = p < t1 ? easeTransition2(c0, c1, 0., t1, p)
                   : p < t2 ? easeTransition2(c1, c2, t1, t2, p)
                            : p < t3 ? easeTransition2(c2, c3, t2, t3, p) 
                                     : easeTransition2(c3, c4, t2, t3, p);
      }

      // use existing perlin noise to set spaceType
      int spaceType = p < t1 ? NEBULA
                             : p < t2 ? SPACE
                                      : p < t3 ? DEEP_SPACE
                                               : DEAD_SPACE;

      vec4 stars = starNest(${v.worldCoords}.xy, spaceType);
      stars = clamp(stars, vec4(0.), vec4(1.));

      if (enableClouds) {
        // multiplying by spaceType causes intentionally disjoint clouds at space type regions
        vec2 cloudPos = float(spaceType+1)*${v.worldCoords}.xy / 2. + vec2(cloudParallaxFactor*${v.position}.x, -cloudParallaxFactor*${v.position}.y);
        float cloudsAmount = pow(cnoise(vec3(cloudPos / cloudRegionScale, 0.)), 3.);
        float clouds = mix(0., 0.75, cloudsAmount) * abs(cnoise(vec3(cloudPos / cloudScale, cloudSpeed * ${u.time})));

        stars += clouds * c0; 
      } else {
        // if clouds are disabled we need to "use" the time uniform
        // otherwise it will be optimized out and we can't write to it

        // if we decide against the cloud effect then deleting this entire conditional will improve performance slightly
        stars += vec4(.0 * ${u.time});
      }

 
      // normalize zoom into 0 -> 1 interval
      float viewportZoom = clamp((${u.viewportZoom} + zoomOffset) / zoomAttenuation, 0., 1.);

      // control star visibility from zoom level, uses a sin wave to create peak visibility at midpoint
      // and zero visibility at 0 and PI
      float zoomInfluence = mix(minStarVisibility, 1., sin(viewportZoom * PI)); 

      // blend stars with black based on zoom level
      // then blend in "c" to ensure the background colour is not lost
      outColor = mix(mix(stars, vec4(vec3(0.),1.), 1.-zoomInfluence), c, 0.28); 
      outColor += c / 4.5; // controls the balance between color vs stars
    }

  `,
};
