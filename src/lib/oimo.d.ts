/** Those are NOT official typings
 * So features actually present in JS may be missing here, or be somehow wrong */
declare module "lib/oimo" {
	export interface PhysicalObjectDefinition {
		type?: "sphere" | "box" | "cylinder" // default is box
		size: [number, number, nuber]
		pos: [number, number, number]
		rot?: [number, number, number]
		move?: boolean // default is false
		density: number
		friction?: number
		restitution?: number
		/** The bits of the collision groups to which the shape belongs */
		belongsTo?: number
		/** The bits of the collision groups with which the shape collides. */
		collidesWith?: number
	}

	export interface JointObjectDefinition {
		type: "jointHinge" | "jointDistance" | "jointPrisme" | "jointSlide" | "jointWheel"
		/** Name or id of attach rigidbody */
		body1: string | number | PhysicalObjectInstance
		/** Name or id of attach rigidbody */
		body2: string | number | PhysicalObjectInstance
	}

	export interface XYZ {
		x: number
		y: number
		z: number
	}

	export interface Quaternion {
		x: number
		y: number
		z: number
		w: number
	}

	export interface PhysicalObjectInstance {
		remove(): void
		getPosition(): XYZ
		getQuaternion(): Quaternion
		readonly id: number
		readonly sleeping: boolean
		linearVelocity: XYZ
		angularVelocity: XYZ
	}

	export interface JoinObjectInstance {
		remove(): void
		getPosition(): [XYZ, XYZ]
		readonly body1: PhysicalObjectInstance
		readonly body2: PhysicalObjectInstance
	}

	export declare class World {
		constructor(options: {
			timestep: number
			iterations: number
			/** 1 brute force, 2 sweep and prune, 3 volume tree */
			broadphase: 1 | 2 | 3
			worldscale: number // ???
			random: boolean
			info: boolean
			gravity: [number, number, number] // x, y, z
		})

		add(definition: PhysicalObjectDefinition): PhysicalObjectInstance
		add(definition: JointObjectDefinition): JointObjectInstance

		step(): void
	}
}