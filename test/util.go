package test

import (
	"../engine"
	"github.com/gavv/httpexpect"
	"github.com/gin-gonic/gin"
	"net/http/httptest"
	"testing"
)

var eng *httpexpect.Expect

func GetEngine(t *testing.T) *httpexpect.Expect {
	gin.SetMode(gin.TestMode)

	if eng == nil {
		server := httptest.NewServer(engine.GetMainEngine())
		eng = httpexpect.New(t, server.URL)
	}
	return eng
}
