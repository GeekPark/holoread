package admin

import (
	models "../../models"
	"fmt"
	"gopkg.in/gin-gonic/gin.v1"
)

type Base struct {
	Model *models.Base
	Name  string
}

type BaseMethods interface {
	Init(interface{}, string) *Base
	Prepare()
	Index(gin.Context)
	Show(gin.Context)
	Create(gin.Context)
	Update(gin.Context)
	Delete(gin.Context)
	Finish()
}

func Init(m interface{}, name string) *Base {
	return &Base{&models.Base{m, name}, name}
}

func (api *Base) Index(c *gin.Context) {
	query := make(map[string]interface{})
	result, err := api.Model.Find(c.MustGet("db"), query)
	if err != nil {
		panic(err)
	}
	c.JSON(200, result)
}

func (api *Base) Show(c *gin.Context) {
	id := c.Param("id")
	result, err := api.Model.FindById(c.MustGet("db"), id)
	if err != nil {
		panic(err)
	}
	c.JSON(200, result)
}

func (api *Base) Create(c *gin.Context) {
	fmt.Print(c.Params)
}

func (api *Base) Update(c *gin.Context) {
	fmt.Print("base api init")
}

func (api *Base) Delete(c *gin.Context) {
	fmt.Print("base api init")
}
