package manage

import (
	"context"
	accessmodel "core/internal/app/access/model"
	accessservice "core/internal/app/access/service"
	srv "core/internal/infra/server"
	"core/internal/pkg/cmdutil"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
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
		senv, err := srv.Setup(srv.Config{
			Ctx:           context.Background(),
			PGConnStr:     ctx.String(cmdutil.PGConnStrFlag),
			RedisAddr:     ctx.String(cmdutil.RedisAddrFlag),
			RedisPassword: ctx.String(cmdutil.RedisPasswordFlag),
			RedisDB:       int(ctx.Uint(cmdutil.RedisDBFlag)),
			Verbose:       ctx.Bool(cmdutil.VerboseFlag),
		})
		if err != nil {
			log.Fatal("Unable to setup app context. Reason: ", err.Error())
		}
		defer srv.Cleanup(senv)

		aservice := accessservice.NewService(senv)

		if _, err := aservice.Create(senv, accessmodel.Access{
			Key:       rsc.Key(ctx.String(KeyFlag)),
			Secret:    ctx.String(SecretFlag),
			Type:      ctx.String(TypeFlag),
			Tags:      []string{},
			ExpiresAt: int64(cons.MaxUnixTime),
		}); err.IsEmpty() {
			// TODO: add error reasons
			senv.Log.Error().Msg("Unable to create access")
		}

		return nil
	},
}
