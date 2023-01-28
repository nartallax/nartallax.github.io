uniform usampler2D positions;
uniform vec2 coordsScale;
uniform vec2 screenSize;
in uint id;

void main(){
  vec2 absCoords = getXYFromTexture(positions, id, screenSize);
  vec4 screenCoords = absCoordsIntoScreenCoords(absCoords, screenSize);
	gl_Position = screenCoords;
  gl_PointSize = 5.0;
}
