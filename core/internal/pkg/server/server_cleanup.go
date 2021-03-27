package server

// Cleanup close active server connections
func Cleanup(sctx *Ctx) {
	sctx.DB.Close()
	sctx.Cache.Close()
}
