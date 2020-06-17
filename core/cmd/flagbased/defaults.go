package main

var (
  // DefaultDbURL the default postgres database connection string
  DefaultDbURL string = "postgres://flagbase:BjrvWmjQ3dykPu@" +
  "127.0.0.1:5432/flagbase" +
  "?sslmode=disable"
  // DefaultVerbose should log verbosely by default
  DefaultVerbose bool = false
  // DefaultRootKey default root access key
  DefaultRootKey string = "root"
  // DefaultRootSecret default root access secret
  DefaultRootSecret string = "toor"
)
