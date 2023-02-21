uniform usampler2D positionX;
uniform usampler2D positionY;
uniform vec2 screenSize;
in uint id;

void main(){
  vec2 absCoords = getFloatPairByIndex(positionX, positionY, id, screenSize);
  vec4 screenCoords = absCoordsIntoScreenCoords(absCoords, screenSize);
	gl_Position = screenCoords;
  gl_PointSize = 2.0;
}
