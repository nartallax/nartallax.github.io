precision mediump float;
precision mediump usampler2D;

#define MAX_XY_RANGE 65535.0
#define MAX_SIGNED_XY_RANGE 32768.0
#define SPEED_RANGE_UNIT 5000.0
#define SPEED_RANGE vec2(SPEED_RANGE_UNIT, SPEED_RANGE_UNIT)

#define unpackCoords unpackXY
#define packCoords packXY
// #define unpackCoords unpackSignedXY
// #define packCoords packSignedXY
#define unpackSpeed unpackSignedXY
#define packSpeed packSignedXY

uint getUintFromTexture(usampler2D tex, uint index){
  float findex = float(index);
  float y = floor(findex / DATA_TEXTURE_SIZE);
  float x = mod(findex, DATA_TEXTURE_SIZE);
  vec2 texcoord = (vec2(x, y) + 0.5) / DATA_TEXTURE_SIZE;
  return texture(tex, texcoord).x;
}

vec2 unpackXY(uint pack, vec2 range){
  return vec2(
    float(pack & 0xffffu),
    float((pack >> 0x10) & 0xffffu)
  ) * (range / MAX_XY_RANGE);
}

vec2 unpackSignedXY(uint pack, vec2 range){
  return (vec2(
    float(pack & 0xffffu),
    float(((pack >> 0x10) & 0xffffu))
  ) - MAX_SIGNED_XY_RANGE) * (range / MAX_SIGNED_XY_RANGE);
}

uint packSignedXY(vec2 pack, vec2 range){
  pack = (pack * (MAX_SIGNED_XY_RANGE / range)) + MAX_SIGNED_XY_RANGE;
  return (uint(pack.x) & 0xffffu) | ((uint(pack.y) & 0xffffu) << 0x10u);
}

uint packXY(vec2 pack, vec2 range){
  pack = pack * (MAX_XY_RANGE / range);
  return (uint(pack.x) & 0xffffu) | ((uint(pack.y) & 0xffffu) << 0x10u);
}

vec4 absCoordsIntoScreenCoords(vec2 coords, vec2 screenSize){
  return vec4(((coords / screenSize) * 2.0) - 1.0, 0, 1);
}

uint fragCoordToIndex(vec2 fragCoord){
  return uint(fragCoord.x) + uint(fragCoord.y * DATA_TEXTURE_SIZE);
}