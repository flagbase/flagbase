package hashutil

import (
	"crypto/sha256"
	"encoding/hex"
)

// HashKeys generates a SHA256 hash given a list of strings
func HashKeys(keys ...string) string {
	hasher := sha256.New()

	for _, key := range keys {
		hasher.Write([]byte(key))
	}

	hashBytes := hasher.Sum(nil)
	return hex.EncodeToString(hashBytes)
}
