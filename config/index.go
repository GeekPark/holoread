package config

type Config struct {
	Env  string
	Port string
	MongoDB
	Secret string
}
type MongoDB struct {
	URL  string
	Name string
}

func Init() *Config {
	return &Config{"dev", "3000", MongoDB{"127.0.0.1:27017", "shareading"}, "geekparkkkkk"}
}