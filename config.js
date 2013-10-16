// Config module
"use strict";

var email = {
	host 			: 'smtp.gmail.com',
	port 			: 465,
	ssl			: true,
	debug			: true,
	username		: '<your username>',
	password		: '<your passsowrd>',
	from			: 'deepk2u@gmail.com',
	to			: 'deepk2u@gmail.com',
	//cc			: 'deepk2u@gmail.com',
	subject			: 'Report'
};

var config = {
  	port			: 3306,
  	host			: 'localhost',
  	user			: 'root',
  	password		: 'root',
  	db			: 'wallet',
  	reporting_interval	: 15,
	email			: email
};

module.exports = config;
