class BaseController{
  constructor(){
    this.router = require('express').Router();
  }
  
  getRouter() {
    return this.router;
  }
  
  getController(path) {
    let Controller = require(path);
    let controller = new Controller();
    return controller.getRouter();
  }
}

module.exports = BaseController;