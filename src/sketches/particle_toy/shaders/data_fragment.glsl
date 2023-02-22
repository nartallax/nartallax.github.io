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
uniform usampler2D walls;

layout(location = 0) out uint outPosX;
layout(location = 1) out uint outPosY;
layout(location = 2) out uint outSpeedX;
layout(location = 3) out uint outSpeedY;

#define moveBySpray(sprayIndex) moveBySprayFn(position, speed, index, vec2(sprayX[sprayIndex], sprayY[sprayIndex]), sprayDirection[sprayIndex], sprayPower[sprayIndex], spraySpread[sprayIndex])

void moveBySprayFn(inout vec2 position, inout vec2 speed, uint index, vec2 sprayPosition, float direction, float power, float spread){
	position = sprayPosition;
	uint rnd = hash(index);
	direction += spread * (normalizeRandomUint(rnd) - 0.5);
	power += (power / 10.0) * (normalizeRandomUint(rnd * 134u) - 0.5);
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
			moveBySpray(0);
		} else {
			sprayOffset -= sprayIntensity[0];
			if(sprayOffset < sprayIntensity[1]){
				moveBySpray(1);
			} else {
				sprayOffset -= sprayIntensity[1];
				if(sprayOffset < sprayIntensity[2]){
					moveBySpray(2);
				} else {
					sprayOffset -= sprayIntensity[2];
					if(sprayOffset < sprayIntensity[3]){
						moveBySpray(3);
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

	vec2 wallPos = vec2(position.x, screenSize.y - position.y) / screenSize;
	uint wall = texture(walls, wallPos).x;
	if(wall != 0u){
		float speedAbs = sqrt(speed.x * speed.x + speed.y * speed.y);
		float speedDirection = atan(speed.y, speed.x) + PI;
		float wallNormal = decodeFloat(wall, ANGLE_RANGE) + PI;
		// wallDir = -45deg, speedDir = 0deg, diff = -45deg, dir = 90deg

		// rotating coord system; that way wall normal will always be 0
		speedDirection -= wallNormal;
		speedDirection = PI - speedDirection;
		speedAbs *= bounce;
		speed.x = speedAbs * cos(speedDirection);
		speed.y = speedAbs * sin(speedDirection);
		// this is (bad) attempt to avert a problem
		// if a particle don't have enough speed to leave the wall in time, it's getting caught in the wall
		// and moves in weird pattern
		// so we move particle a little and hope that it won't be that bad
		// (it's working, but it is also not a proper solution)
		position += (speed * deltaTime * 2.0) / max(bounce, 0.1);
	}
	
	outPosX = encodeFloat(position.x, screenSize.x);
    outPosY = encodeFloat(position.y, screenSize.y);
    outSpeedX = encodeFloat(speed.x, SPEED_RANGE);
    outSpeedY = encodeFloat(speed.y, SPEED_RANGE);
}