package test

import (
	"net/http"
	"testing"
)

func TestV1Articles(t *testing.T) {
	e := GetEngine(t)
	e.GET("/api/v1/articles").
		Expect().
		Status(http.StatusOK).
		JSON().Object().ContainsKey("data").Keys().Length().Ge(0)
}
