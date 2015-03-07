module.exports = {
	"account":           require("./account"),
	"account-manage":    require("./account/manage"),
	"auth-forgot":       require("./auth/login"),
	"auth-login":        require("./auth/login"),
	"auth-signup":       require("./auth/login"),
	"auth-reset":        require("./auth/login"),
	"classified-edit":   require("./classified/edit"),
	"classified-post":   require("./classified/post"),
	"classified-search": require("./classified/search"),
	"classified-single": require("./classified/single"),
	"guest-single":      require("./classified/single"),
	"guest-post":        require("./classified/post"),
	"landing":           require("./landing")
};