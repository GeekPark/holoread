package test

import (
	"../engine"
	"github.com/gavv/httpexpect"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHttp(t *testing.T) {
	gin.SetMode(gin.TestMode)

	server := httptest.NewServer(engine.GetMainEngine())
	defer server.Close()

	e := httpexpect.New(t, server.URL)
	e.GET("/api/v1/articles").
		Expect().
		Status(http.StatusOK).JSON()
}
