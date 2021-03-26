package manage

import (
	"context"
	"core/internal/app/access"
	"core/internal/pkg/cmdutil"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/policy"
	rsc "core/internal/pkg/resource"
	"core/pkg/db"
	"errors"
	"runtime"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

const (
	// KeyFlag Access key flag
	KeyFlag string = "key"
	// SecretFlag Access secret flag
	SecretFlag string = "secret"
	// TypeFlag Access type flag
	TypeFlag string = "type"
)

// AccessConfig server config
type AccessConfig struct {
	PGConnStr string
	Verbose   bool
	Key       rsc.Key
	Secret    string
	Type      string
}

// ManageAccessCommand manage access command entry
var ManageAccessCommand cli.Command = cli.Command{
	Name:        "access",
	Usage:       "Manage access resources",
	Description: "Manage access resources",
	Subcommands: []*cli.Command{
		&ManageAccessCreateCommand,
	},
}

// ManageAccessCreateCommand create access command entry
var ManageAccessCreateCommand cli.Command = cli.Command{
	Name:        "create",
	Description: "Create access resources",
	Usage:       "Create access resource",
	Flags: append([]cli.Flag{
		&cli.StringFlag{
			Name:  KeyFlag,
			Usage: "Access key",
			Value: cons.DefaultRootKey,
		},
		&cli.StringFlag{
			Name:  SecretFlag,
			Usage: "Access secret [this should never be exposed]",
			Value: cons.DefaultRootSecret,
		},
		&cli.StringFlag{
			Name:  TypeFlag,
			Usage: "Access type [root > admin > user > service]",
			Value: rsc.AccessRoot.String(),
		},
	}, cmdutil.GlobalFlags...),
	Action: func(ctx *cli.Context) error {
		cfg := AccessConfig{
			PGConnStr: ctx.String(cmdutil.PGConnStrFlag),
			Verbose:   ctx.Bool(cmdutil.VerboseFlag),
			Key:       rsc.Key(ctx.String(KeyFlag)),
			Secret:    ctx.String(SecretFlag),
			Type:      ctx.String(TypeFlag),
		}
		CreateAccess(cfg)
		return nil
	},
}

// CreateAccess create access
func CreateAccess(cfg AccessConfig) {
	if err := db.NewPool(context.Background(), cfg.PGConnStr, cfg.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		runtime.Goexit()
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cfg.PGConnStr); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		runtime.Goexit()
	}

	if err := createAccess(cfg.Key, cfg.Secret, cfg.Type); err != nil {
		logrus.Error("Unable to create root access. Perhap the access-key already exists.")
		runtime.Goexit()
	} else {
		logrus.WithFields(logrus.Fields{
			"key":    cfg.Key,
			"secret": cfg.Secret,
		}).Info("Created access")
	}
}

func createAccess(accessKey rsc.Key, accessSecret string, accessType string) error {
	_, err := access.Create(access.Access{
		Key:       accessKey,
		Secret:    accessSecret,
		Type:      accessType,
		Tags:      []string{},
		ExpiresAt: cons.MaxUnixTime,
	})
	if err.Errors != nil {
		return errors.New("unable to create access - perhaps this resource already exists")
	}

	return nil
}
