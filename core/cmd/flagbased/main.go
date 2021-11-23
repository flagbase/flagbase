package main

import (
	"log"
	"os"
)

// Exec flagbased with args
func main() {
	app := *AppCommand

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
