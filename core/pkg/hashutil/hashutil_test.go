package hashutil

import (
	"testing"
)

func TestHashKeysSingleKey(t *testing.T) {
	key := "test"
	hash := HashKeys(key)

	expected := "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" // Precomputed SHA256 hash for "test"
	if hash != expected {
		t.Errorf("HashKeys(%s) = %s; expected %s", key, hash, expected)
	}
}

func TestHashKeysTwoKeys(t *testing.T) {
	key1 := "key1"
	key2 := "key2"
	hash := HashKeys(key1, key2)

	expected := "669b6cfa69c1afe27a8c21166a1b97a7cdfc5872c16c19a0290eb39f654a48aa" // Precomputed SHA256 hash for hash1 + hash2

	if hash != expected {
		t.Errorf("HashKeys(%s, %s) = %s; expected %s", key1, key2, hash, expected)
	}
}

func TestHashKeysMultipleKeys(t *testing.T) {
	keys := []string{"key1", "key2", "key3", "key4", "key5", "key6"}
	hash := HashKeys(keys...)

	// Precomputed SHA256 hashes
	expected := "1a98c36c29718ee5441af97e2d7106272beb25c5f587356d50cacf809f512d3f" // Precomputed SHA256 hash for hash3

	if hash != expected {
		t.Errorf("HashKeys(%s, %s, %s) = %s; expected %s", keys[0], keys[1], keys[2], hash, expected)
	}
}
