package admin

import (
	models "../../models"
	"github.com/gin-gonic/gin"
	// "log"
	// "time"
)

type TranslateLog struct {
	Base
}

type TranslateLogMethods interface {
	BaseMethods
}

func InitTranslateLog(m interface{}, name string) *TranslateLog {
	a := new(TranslateLog)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *TranslateLog) Index(c *gin.Context) {
	db := c.MustGet("logdb")
	var params models.TranslateLogQuery
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	result, _ := api.Model.FindTranslateLogs(db, params)
	count, _ := api.Model.TranslateLogsCount(db, params)
	c.JSON(200, gin.H{"total": count, "data": result})
}
