module.exports = {
	"account-manage":    require("./account/manage"),
	"auth-forgot":       require("./auth/login"),
	"auth-login":        require("./auth/login"),
	"auth-signup":       require("./auth/login"),
	"auth-reset":        require("./auth/login"),
	"classified-edit":   require("./classified/edit"),
	"classified-post":   require("./classified/post"),
	"classified-search": require("./classified/search"),
	"classified-single": require("./classified/single"),
	"guest-finish":      require("./guest/finish"),
	"guest-single":      require("./guest/single"),
	"guest-post":        require("./guest/post"),
	"landing":           require("./landing")
};