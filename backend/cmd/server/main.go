package main

import (
	"net/http"

	"github.com/LeonardYam/cvwo-gossip/backend/internal/router"
)

func main() {
	r := router.SetUp()
	http.ListenAndServe(":8080", r)
}