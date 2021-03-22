package main

import (
	"os"

	"github.com/sirupsen/logrus"
)

// Exec flagbased with args
func main() {
	app := *AppCommand

	err := app.Run(os.Args)
	if err != nil {
		logrus.Fatal(err)
	}
}
