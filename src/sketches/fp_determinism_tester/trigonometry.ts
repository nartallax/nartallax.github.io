const doubleComparePrecision = 0.00000000000000000001
const M_PI = 3.1415927
const M_PI_2 = M_PI / 2
const M_PI_M_2 = M_PI * 2

const compare_float = (f1: number, f2: number): -1 | 0 | 1 => {
	if((f1 - doubleComparePrecision) < f2){
		return -1
	} else if((f1 + doubleComparePrecision) > f2){
		return 1
	} else {
		return 0
	}
}

export const cos = (x: number): number => {
	if(x < 0){
		x = -x
	}

	if(compare_float(x, M_PI_M_2) >= 0){
		x = x % M_PI_M_2
	}

	if((compare_float(x, M_PI) >= 0) && (compare_float(x, M_PI_M_2) === -1)){
		x -= M_PI
		return ((-1) * (1 - (x * x / 2) * (1 - (x * x / 12) * (1 - (x * x / 30) * (1 - (x * x / 56) * (1 - (x * x / 90) * (1 - (x * x / 132) * (1 - (x * x / 182)))))))))
	}
	return 1 - (x * x / 2) * (1 - (x * x / 12) * (1 - (x * x / 30) * (1 - (x * x / 56) * (1 - (x * x / 90) * (1 - (x * x / 132) * (1 - (x * x / 182)))))))
}

export const sin = (x: number) => cos(x - M_PI_2)