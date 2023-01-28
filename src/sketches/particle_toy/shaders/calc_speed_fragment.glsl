uniform usampler2D position;
uniform usampler2D speed;
uniform vec2 screenSize;
uniform float deltaTime;

uniform float gravity;

out uint newSpeedPack;

void main() {
	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;
	vec2 particlePosition = unpackXY(texture(position, texcoord).x, screenSize);
	vec2 particleSpeed = unpackSignedXY(texture(speed, texcoord).x, SPEED_RANGE);

	float gravityDeltaV = gravity * deltaTime;
	vec2 newSpeed = vec2(particleSpeed.x, particleSpeed.y - gravityDeltaV);
	if(particlePosition.y == 0.0){
		newSpeed.y = -newSpeed.y * 0.5; // jumpyness
	}

	newSpeedPack = packSignedXY(newSpeed, SPEED_RANGE);
}