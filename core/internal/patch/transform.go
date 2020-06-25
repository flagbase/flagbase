package patch

import (
	"encoding/json"

	jsonpatch "github.com/evanphx/json-patch"
)

// Transform applies a patch (p) tranformation on a document (i)
func Transform(i interface{}, p Patch, o interface{}) error {
	// marshal input and patch
	mi, err := json.Marshal(i)
	if err != nil {
		return err
	}
	mp, err := json.Marshal(p)
	if err != nil {
		return err
	}

	// decode and apply patch
	jp, err := jsonpatch.DecodePatch(mp)
	if err != nil {
		return err
	}
	mo, err := jp.Apply(mi)
	if err != nil {
		return err
	}

	// unmarshall output
	json.Unmarshal(mo, &o)

	return nil
}
