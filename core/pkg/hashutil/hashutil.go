package hashutil

import (
	"crypto/md5"
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
	w := md5.New()
	io.WriteString(w, key)
	md5str := fmt.Sprintf("%x", w.Sum(nil))
	return md5str
}
