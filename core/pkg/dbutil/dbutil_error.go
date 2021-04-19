package dbutil

import (
	"core/pkg/stringutil"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v4"
)

// ParseError get human-readable DB error for resource
func ParseError(rsc_name string, i interface{}, err error) error {
	if err == nil {
		return nil
	}

	rsc_string := stringutil.StringifyInterface(i)
	switch err {
	case pgx.ErrNoRows:
		return fmt.Errorf("unable to find %s, where %s", rsc_name, rsc_string)
	case pgx.ErrTxCommitRollback:
		return fmt.Errorf("rolled back operation on %s, where %s", rsc_name, rsc_string)
	case pgx.ErrTxClosed:
		return errors.New("unable to connect to db")
	default:
		return fmt.Errorf("unhandled error - ", err.Error())
	}
}
