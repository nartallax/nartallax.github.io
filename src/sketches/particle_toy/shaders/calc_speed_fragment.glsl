uniform usampler2D position;
uniform usampler2D speed;
uniform vec2 screenSize;
uniform float deltaTime;

uniform float gravity;

out uint newSpeedPack;

void main() {
	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;
	vec2 particlePosition = unpackCoords(texture(position, texcoord).x, screenSize);
	vec2 particleSpeed = unpackSpeed(texture(speed, texcoord).x, SPEED_RANGE);

	// particleSpeed.y -= gravity * deltaTime;
	if(particlePosition.y == 0.0){
		particleSpeed.y = -particleSpeed.y * 0.5; // jumpyness
	}

	newSpeedPack = packSpeed(particleSpeed, SPEED_RANGE);
}