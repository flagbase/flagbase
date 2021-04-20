package dbutil

import (
	"core/pkg/stringutil"
	"errors"
	"fmt"
	"strings"

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
		if strings.Contains(
			err.Error(),
			"context canceled",
		) {
			return fmt.Errorf("operation on %s cancelled, where %s", rsc_name, rsc_string)
		} else if strings.Contains(
			err.Error(),
			"duplicate key value violates unique constraint",
		) {
			return fmt.Errorf("%s resource with key already exists, where %s", rsc_name, rsc_string)
		}
		return fmt.Errorf("unhandled error - %s", err.Error())
	}
}
