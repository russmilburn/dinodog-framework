class BaseController{
  constructor(){
    this.router = require('express').Router();
  }
  
  getRouter() {
    return this.router;
  }
  
  getController(name) {
    let Controller = require('./' + name);
    let controller = new Controller();
    return controller.getRouter();
  }
}

module.exports = BaseController;