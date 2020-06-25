package patch

// Patch RFC6902 JSON Patch document
type Patch []Object

// Object single patch object
type Object struct {
	Op    string      `json:"op,omitempty"`
	Path  string      `json:"path,omitempty"`
	Value interface{} `json:"value,omitempty"`
	From  string      `json:"from,omitempty"`
}
