package crypto

import (
	"golang.org/x/crypto/bcrypt"
)

// Encrypt encrypts a string using bcrypt
func Encrypt(s string) (string, error) {
	encrypted, err := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	if err != nil {
		return s, err
	}

	return string(encrypted), nil
}

// Compare compare hashed and original secret
func Compare(h string, s string) error {
	return bcrypt.CompareHashAndPassword(
		[]byte(h),
		[]byte(s),
	)
}
