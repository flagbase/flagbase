package evaluator

type Reason string

func (r Reason) String() string {
	return string(r)
}

const (
	Fallthrough         Reason = "FALLTHROUGH"
	FallthroughWeighted Reason = "FALLTHROUGH_WEIGHTED"
	Targeted            Reason = "TARGETED"
	TargetedWeighted    Reason = "TARGETED_WEIGHTED"
)
