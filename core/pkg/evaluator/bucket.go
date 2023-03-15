package evaluator

import (
	"core/pkg/model"

	"github.com/cespare/xxhash/v2"
)

// BucketSize bucket size represents the max weights variations can add up to
const BucketSize uint16 = 100

func precalculateAccumulatedWeights(variations []*model.Variation) []int8 {
	accumulatedWeights := make([]int8, len(variations))
	var currentBucket int8 = 0
	for i, v := range variations {
		currentBucket += v.Weight
		accumulatedWeights[i] = currentBucket
	}
	return accumulatedWeights
}

func deriveVariationWithAccumulatedWeights(
	salt string,
	variations []*model.Variation,
	accumulatedWeights []int8,
) string {
	hash := xxhash.New()
	_, _ = hash.Write([]byte(salt))
	hashVal := hash.Sum64()
	userBucket := int8(hashVal % uint64(BucketSize))

	for i, currentBucket := range accumulatedWeights {
		if userBucket < currentBucket {
			return variations[i].VariationKey
		}
	}

	return variations[len(variations)-1].VariationKey
}

func deriveVariation(
	salt string,
	variations []*model.Variation,
) string {
	accumulatedWeights := precalculateAccumulatedWeights(variations)
	return deriveVariationWithAccumulatedWeights(salt, variations, accumulatedWeights)
}
