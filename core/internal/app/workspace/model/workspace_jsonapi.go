package model

// Response represents the response object of the API
type Response struct {
	ID          string   `jsonapi:"primary,workspace"`
	Key         string   `jsonapi:"attr,key"`
	Name        string   `jsonapi:"attr,name,omitempty"`
	Description string   `jsonapi:"attr,description,omitempty"`
	Tags        []string `jsonapi:"attr,tags,omitempty"`
}
