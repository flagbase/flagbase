package jwt

import (
	"core/internal/constants"
	"errors"
	"fmt"

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

// Verify a jwt and get the ID
func Verify(atk string) (string, error) {
	claims := &Claims{}
	fmt.Println(atk)
	tkn, err := jwt.ParseWithClaims(atk, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(constants.JWTKey), nil
	})

	if err != nil {
		return "", err
	} else if !tkn.Valid {
		return "", errors.New("invalid access token")
	}

	return claims.ID, nil
}
