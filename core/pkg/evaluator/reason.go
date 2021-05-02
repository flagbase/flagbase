package evaluator

// Reason evaluation reason
type Reason string

func (r Reason) String() string {
	return string(r)
}

const (
	// ReasonFallthrough used a single fallthrough variation
	ReasonFallthrough Reason = "FALLTHROUGH"
	// ReasonFallthroughWeighted used a weighted fallthrough variation
	ReasonFallthroughWeighted Reason = "FALLTHROUGH_WEIGHTED"
	// ReasonTargeted used a single targeted variation
	ReasonTargeted Reason = "TARGETED"
	// ReasonTargetedWeighted used a weighted targeted variation
	ReasonTargetedWeighted Reason = "TARGETED_WEIGHTED"
)
