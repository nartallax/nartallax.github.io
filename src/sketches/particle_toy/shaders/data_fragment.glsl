uniform vec2 screenSize;
uniform float deltaTime;

uniform uint firstMovedParticleIndex;
uniform uint lastMovedParticleIndex;

uniform float gravity;
uniform float bounce;
uniform vec4 sprayX;
uniform vec4 sprayY;
uniform vec4 sprayDirection;
uniform vec4 sprayPower;
uniform vec4 spraySpread;
uniform uvec4 sprayIntensity;

uniform usampler2D positionX;
uniform usampler2D positionY;
uniform usampler2D speedX;
uniform usampler2D speedY;

layout(location = 0) out uint outPosX;
layout(location = 1) out uint outPosY;
layout(location = 2) out uint outSpeedX;
layout(location = 3) out uint outSpeedY;

#define moveBySpray(pos, spd, index, sprayIndex) moveBySprayFn(pos, spd, index, vec2(sprayX[sprayIndex], sprayY[sprayIndex]), sprayDirection[sprayIndex], sprayPower[sprayIndex], spraySpread[sprayIndex])

void moveBySprayFn(inout vec2 position, inout vec2 speed, uint index, vec2 sprayPosition, float direction, float power, float spread){
	position = sprayPosition;
	uint rnd = hash(index);
	direction += spread * (normalizeRandomUint(rnd) - 0.5);
	power += (power / 3.0) * (normalizeRandomUint(rnd * 134u) - 0.5);
	speed = vec2(cos(direction) * power, sin(direction) * power);
}

void main(){
	vec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;
	uint index = fragCoordToIndex(gl_FragCoord.xy);

	vec2 position = getFloatPairByCoords(positionX, positionY, texcoord, screenSize);
	vec2 speed = getFloatPairByCoords(speedX, speedY, texcoord, SPEED_RANGE);

	uint sprayOffset = index - firstMovedParticleIndex;
	if(sprayOffset >= 0u){
		if(sprayOffset < sprayIntensity[0]){
			moveBySpray(position, speed, index, 0);
		} else {
			sprayOffset -= sprayIntensity[0];
			if(sprayOffset < sprayIntensity[1]){
				moveBySpray(position, speed, index, 1);
			} else {
				sprayOffset -= sprayIntensity[1];
				if(sprayOffset < sprayIntensity[2]){
					moveBySpray(position, speed, index, 2);
				} else {
					sprayOffset -= sprayIntensity[2];
					if(sprayOffset < sprayIntensity[3]){
						moveBySpray(position, speed, index, 3);
					}
				}
			}
		}
	}

	position = position + (speed * deltaTime);
	if(position.x < 0.0){
		position.x = 0.01;
		speed.x = -speed.x * bounce;
	} else if(position.x > screenSize.x){
		position.x = screenSize.x - 0.01;
		speed.x = -speed.x * bounce;
	}
	if(position.y < 0.0){
		position.y = 0.01;
		speed.y = -speed.y * bounce;
	} else if(position.y > screenSize.y){
		position.y = screenSize.y - 0.01;
		speed.y = -speed.y * bounce;
	}

	speed.y -= gravity * deltaTime;
	
	outPosX = encodeFloat(position.x, screenSize.x);
    outPosY = encodeFloat(position.y, screenSize.y);
    outSpeedX = encodeFloat(speed.x, SPEED_RANGE);
    outSpeedY = encodeFloat(speed.y, SPEED_RANGE);
}