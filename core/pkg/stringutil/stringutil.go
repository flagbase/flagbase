package stringutil

import (
	"fmt"
	"reflect"
	"regexp"
	"strings"
)

// StringifyInterface convert interface to key=value string
func StringifyInterface(i interface{}) string {
	o := ""
	v := reflect.ValueOf(i)
	typeOfS := v.Type()
	for i := 0; i < v.NumField(); i++ {
		if i > 0 {
			o += ", "
		}
		key := ToSnakeCase(typeOfS.Field(i).Name)
		value := v.Field(i).Interface()
		o += fmt.Sprintf("%v=%v", key, value)
	}
	return o
}

// ToSnakeCase convert string to snake_case
// https://www.golangprograms.com/golang-convert-string-into-snake-case.html
func ToSnakeCase(str string) string {
	var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
	var matchAllCap = regexp.MustCompile("([a-z0-9])([A-Z])")
	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}
