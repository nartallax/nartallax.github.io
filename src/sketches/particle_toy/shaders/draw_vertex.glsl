uniform usampler2D positions;
uniform vec2 coordsScale;
uniform vec2 screenSize;
in uint id;

void main(){
  uint coordsPack = getUintFromTexture(positions, id);
  vec2 absCoords = unpackCoords(coordsPack, screenSize);
  vec4 screenCoords = absCoordsIntoScreenCoords(absCoords, screenSize);
	gl_Position = screenCoords;
  gl_PointSize = 1.0;
}
