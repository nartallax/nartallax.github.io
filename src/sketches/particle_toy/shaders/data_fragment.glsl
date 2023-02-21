uniform vec2 screenSize;
uniform float deltaTime;

uniform uint firstMovedParticleIndex;
uniform uint lastMovedParticleIndex;

uniform float gravity;

uniform usampler2D positionX;
uniform usampler2D positionY;
uniform usampler2D speedX;
uniform usampler2D speedY;

layout(location = 0) out uint outPosX;
layout(location = 1) out uint outPosY;
layout(location = 2) out uint outSpeedX;
layout(location = 3) out uint outSpeedY;

void main(){
	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;
	uint index = fragCoordToIndex(gl_FragCoord.xy);

	vec2 position = getUFloatPairByCoords(positionX, positionY, texcoord, screenSize);
	vec2 speed = getSFloatPairByCoords(speedX, speedY, texcoord, SPEED_RANGE);

	if(index >= firstMovedParticleIndex && index <= lastMovedParticleIndex){
		position = screenSize / 2.0;
	} else {
		position = position + (speed * deltaTime);
		position = min(max(position, vec2(0.0, 0.0)), screenSize);
	}

	speed.y -= gravity * deltaTime;
	if(position.y == 0.0){
		speed.y = -speed.y * 0.5; // jumpyness
	}

	outPosX = encodeUFloat(position.x, screenSize.x);
    outPosY = encodeUFloat(position.y, screenSize.y);
    outSpeedX = encodeSFloat(speed.x, SPEED_RANGE);
    outSpeedY = encodeSFloat(speed.y, SPEED_RANGE);
}


// // POS SHADER
// void main() {
// 	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;

// 	vec2 newPosition;

// 	uint index = fragCoordToIndex(gl_FragCoord.xy);
	// if(index >= firstMovedParticleIndex && index <= lastMovedParticleIndex){
	// 	newPosition = screenSize / 2.0;
	// } else {
// 		vec2 particlePosition = unpackCoords(texture(position, texcoord).x, screenSize);
// 		vec2 particleSpeed = unpackSpeed(texture(speed, texcoord).x, SPEED_RANGE);

// 		newPosition = particlePosition + (particleSpeed * deltaTime);
// 		newPosition = min(max(newPosition, vec2(0.0, 0.0)), screenSize);
// 	// }

// 	newPositionPack = packCoords(newPosition, screenSize);
// }


// // SPEED SHADER
// void main() {
// 	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;
// 	vec2 particlePosition = unpackCoords(texture(position, texcoord).x, screenSize);
// 	vec2 particleSpeed = unpackSpeed(texture(speed, texcoord).x, SPEED_RANGE);

// 	// particleSpeed.y -= gravity * deltaTime;
// 	if(particlePosition.y == 0.0){
// 		particleSpeed.y = -particleSpeed.y * 0.5; // jumpyness
// 	}

// 	newSpeedPack = packSpeed(particleSpeed, SPEED_RANGE);
// }