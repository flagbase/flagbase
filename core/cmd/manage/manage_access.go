package manage

import (
	"context"
	"core/internal/app/access"
	"core/internal/pkg/cmdutil"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"log"

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
		sctx, err := srv.Setup(srv.Config{
			Ctx:           context.Background(),
			PGConnStr:     ctx.String(cmdutil.PGConnStrFlag),
			RedisAddr:     ctx.String(cmdutil.RedisAddr),
			RedisPassword: ctx.String(cmdutil.RedisPassword),
			RedisDB:       int(ctx.Uint(cmdutil.RedisDB)),
			Verbose:       ctx.Bool(cmdutil.VerboseFlag),
		})
		if err != nil {
			log.Fatal("Unable to setup app context. Reason: ", err.Error())
		}
		defer srv.Cleanup(sctx)

		if _, err := access.Create(sctx, access.Access{
			Key:       rsc.Key(ctx.String(KeyFlag)),
			Secret:    ctx.String(SecretFlag),
			Type:      ctx.String(TypeFlag),
			Tags:      []string{},
			ExpiresAt: cons.MaxUnixTime,
		}); err.IsEmpty() {
			// TODO: add error reasons
			sctx.Log.Error.Msg("Unable to create access")
		}

		return nil
	},
}
