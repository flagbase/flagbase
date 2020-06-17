package jwt

import (
	"core/internal/constants"

	"github.com/dgrijalva/jwt-go"
)

// Claims a jwt claim
type Claims struct {
	ID string
	jwt.StandardClaims
}

// Sign generate token using access id
func Sign(id string) (string, error) {
	claims := &Claims{
		ID: id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: constants.JWTExpiry,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(constants.JWTKey))

	return tokenString, err
}
