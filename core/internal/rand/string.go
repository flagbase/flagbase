package rand

/*
 * Original Source:
 * https://www.calhoun.io/creating-random-strings-in-go/
 */

import (
	"math/rand"
	"time"
)

const charset = "abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var seededRand *rand.Rand = rand.New(
	rand.NewSource(time.Now().UnixNano()))

// StringWithCharset generate a random string using a predefined charset
func StringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

// String generate a random string of given a length
func String(length int) string {
	return StringWithCharset(length, charset)
}
