package hashutil

import (
	"crypto/sha256"
	"fmt"
	"io"
)

// HashKeys generates a MD5 hash given a list of strings
func HashKeys(keys ...string) string {
	if len(keys) == 1 {
		return hashKey(keys[0])
	}

	return hashKey(hashKey(keys[0]) + HashKeys(keys[1:]...))
}

func hashKey(key string) string {
	w := sha256.New()
	if _, err := io.WriteString(w, key); err != nil {
		panic("unable to hash key")
	}
	md5str := fmt.Sprintf("%x", w.Sum(nil))
	return md5str
}
