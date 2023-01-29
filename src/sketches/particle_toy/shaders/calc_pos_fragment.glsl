uniform usampler2D position;
uniform usampler2D speed;
uniform vec2 screenSize;
uniform float deltaTime;

uniform uint firstMovedParticleIndex;
uniform uint lastMovedParticleIndex;


out uint newPositionPack;

void main() {
	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;

	vec2 newPosition;

	uint index = fragCoordToIndex(gl_FragCoord.xy);
	// if(index >= firstMovedParticleIndex && index <= lastMovedParticleIndex){
	// 	newPosition = screenSize / 2.0;
	// } else {
		vec2 particlePosition = unpackCoords(texture(position, texcoord).x, screenSize);
		vec2 particleSpeed = unpackSpeed(texture(speed, texcoord).x, SPEED_RANGE);

		newPosition = particlePosition + (particleSpeed * deltaTime);
		newPosition = min(max(newPosition, vec2(0.0, 0.0)), screenSize);
	// }

	newPositionPack = packCoords(newPosition, screenSize);
}