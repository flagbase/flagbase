package patch

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func TestTransform(t *testing.T) {
	tests := []struct {
		name          string
		input         Person
		patch         Patch
		expected      Person
		expectedError error
	}{
		{
			name:  "Add operation",
			input: Person{Name: "Alice", Age: 30},
			patch: Patch{
				{
					Op:    "add",
					Path:  "/city",
					Value: "New York",
				},
			},
			expected: Person{Name: "Alice", Age: 30},
		},
		{
			name:  "Replace operation",
			input: Person{Name: "Alice", Age: 30},
			patch: Patch{
				{
					Op:    "replace",
					Path:  "/age",
					Value: 35,
				},
			},
			expected: Person{Name: "Alice", Age: 35},
		},
		{
			name:  "Remove operation",
			input: Person{Name: "Alice", Age: 30},
			patch: Patch{
				{
					Op:   "remove",
					Path: "/age",
				},
			},
			expected: Person{Name: "Alice"},
		},
		{
			name:  "No difference",
			input: Person{Name: "Alice", Age: 30},
			patch: Patch{
				{
					Op:    "replace",
					Path:  "/age",
					Value: 30,
				},
			},
			expectedError: errors.New("patch made no difference"),
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var output Person
			err := Transform(test.input, test.patch, &output)

			if test.expectedError != nil {
				assert.Equal(t, test.expectedError, err)
			} else {
				assert.Nil(t, err)
				assert.Equal(t, test.expected, output)
			}
		})
	}
}
