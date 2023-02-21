precision mediump float;
precision mediump usampler2D;

#define SPEED_RANGE 5000.0
#define INT_RANGEU 0x7fffffffu
#define INT_RANGEF float(INT_RANGEU)

float decodeFloat(uint value, float range){
  return (float(value) / INT_RANGEF) * range;
}

uint encodeFloat(float value, float range){
  return uint(((value / range) * INT_RANGEF) + INT_RANGEF);
}

uvec2 getUintPairByCoords(usampler2D texX, usampler2D texY, vec2 coords){
  return uvec2(uint(texture(texX, coords).x), uint(texture(texY, coords).x));
}

uvec2 getUintPairByIndex(usampler2D texX, usampler2D texY, uint index){
  float findex = float(index);
  float y = floor(findex / DATA_TEXTURE_SIZE);
  float x = mod(findex, DATA_TEXTURE_SIZE);
  vec2 texcoord = (vec2(x, y) + 0.5) / DATA_TEXTURE_SIZE;
  return uvec2(texture(texX, texcoord).x, texture(texY, texcoord).x);
}


#define getFloatPairByCoords(texX, texY, coords, range) (((vec2(texture(texX, coords).x, texture(texY, coords).x) - INT_RANGEF) / INT_RANGEF) * range)
#define getFloatPairByIndex(texX, texY, index, range) (((vec2(getUintPairByIndex(texX, texY, index)) - INT_RANGEF) / INT_RANGEF) * range)

vec4 absCoordsIntoScreenCoords(vec2 coords, vec2 screenSize){
  return vec4(((coords / screenSize) * 2.0) - 1.0, 0, 1);
}

uint fragCoordToIndex(vec2 fragCoord){
  return uint(fragCoord.x) + uint(fragCoord.y * DATA_TEXTURE_SIZE);
}

// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
uint hash(uint x) {
    x += ( x << 10u );
    x ^= ( x >>  6u );
    x += ( x <<  3u );
    x ^= ( x >> 11u );
    x += ( x << 15u );
    return x;
}

#define normalizeRandomUint(value) float(value % 0xffffffu) / float(0xffffffu)