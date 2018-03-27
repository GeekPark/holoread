package main

import (
	"./config"
	"./engine"
)

func main() {
	r := engine.GetMainEngine()
	r.Static("/imgs", "/data/imgs")
	r.Run(config.Init().Port)
}
