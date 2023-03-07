package healthcheck

// HealthStatus represents the state of the system health
type HealthStatus struct {
	ID        string        `json:"id" jsonapi:"primary,health_status"`
	Resources ResourceState `json:"resources" jsonapi:"attr,resources"`
	Status    string        `json:"status" jsonapi:"attr,status"`
}

// ResourceState represents the state of the resources
type ResourceState struct {
	DB    string `json:"db" jsonapi:"attr,db"`
	Cache string `json:"cache" jsonapi:"attr,cache"`
}
