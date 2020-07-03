package jwt

import (
	"core/internal/constants"
	"errors"

	"github.com/dgrijalva/jwt-go"
)

// Claims a jwt claim
type Claims struct {
	Access []byte
	jwt.StandardClaims
}

// Sign generate token using access id
func Sign(a []byte) (string, error) {
	claims := &Claims{
		Access: a,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: constants.JWTExpiry,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(constants.JWTKey))

	return tokenString, err
}

// Verify a jwt and get the ID
func Verify(atk string) ([]byte, error) {
	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(atk, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(constants.JWTKey), nil
	})

	if err != nil {
		return nil, err
	} else if !tkn.Valid {
		return nil, errors.New("invalid access token")
	}

	return claims.Access, nil
}
