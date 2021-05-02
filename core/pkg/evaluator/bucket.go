package evaluator

import (
	"core/pkg/flagset"
	"encoding/binary"
)

func deriveVariation(
	salt string,
	variations []flagset.Variation,
) string {
	saltVal := binary.LittleEndian.Uint16([]byte(salt))
	userBucket := int8(saltVal % 100)

	var currentBucket int8 = 0
	for _, v := range variations {
		currentBucket += v.Weight
		if userBucket < currentBucket {
			return v.VariationKey
		}
	}

	return variations[len(variations)-1].VariationKey
}
