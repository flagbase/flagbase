package evaluator

import (
	"core/pkg/model"
	"encoding/binary"
)

// BucketSize bucket size represents the max weights variations can add up to
const BucketSize uint16 = 100

func deriveVariation(
	salt string,
	variations []*model.Variation,
) string {
	saltVal := binary.LittleEndian.Uint16([]byte(salt))
	userBucket := int8(saltVal % BucketSize)

	var currentBucket int8 = 0
	for _, v := range variations {
		currentBucket += v.Weight
		if userBucket < currentBucket {
			return v.VariationKey
		}
	}

	return variations[len(variations)-1].VariationKey
}
