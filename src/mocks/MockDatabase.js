const Mongoose = require('mongoose').Mongoose;
const Mockgoose = require('mockgoose').Mockgoose;
const Q = require('q');
const MockLogger = require('./MockLogger');
const logger = new MockLogger(true);

let instance = null;

class MockDatabase {
  constructor() {
    if (!instance) {
      instance = this;
    }
    this.mongoose = null;
    this.mockgoose = null;
    this.modelList = null;

    return instance;
  }


  init(useMocking) {
    this.mongoose = new Mongoose();
    this.mongoose.promise = Q.promise;

    if (typeof useMocking === 'undefined') {
      useMocking = false;
    }

    if (useMocking) {
      this.mockgoose = new Mockgoose(this.mongoose);
      return this.mockgoose.prepareStorage()
        .then(this.connect.bind(this))
    } else {
      return this.connect();
    }
  }

  connect() {
    logger.info('Connecting...');
    let options = {
      autoReconnect: true
    };

    let that = this;

    return this.mongoose.connect('mongodb://localhost:37017/ummadb', options)
      .then(onSuccess.bind(this), onFailure);

    function onSuccess() {
      logger.info('Connection successful');
      let modelList = that.getModelList();

      modelList.forEach(function (value, key) {
        try{
          that.mongoose.model(key, value);
        }catch (err) {
          logger.error(err.message);
        }
      });
      return Promise.resolve();
    }

    function onFailure() {
      logger.warn('Connection failure');
      return Promise.reject();
    }
  }

  getDatabase() {
    return this.mongoose;
  }

  setModelList(ml){
    this.modelList = ml;
  }

  getModelList(){
    return this.modelList;
  }

  loadMockData(name, obj) {
    let model;
    if(Array.isArray(obj)){
      model = this.mongoose.model(name);
      return model.insertMany(obj);
    }else{
      //Single object
      let Model = this.mongoose.model(name);
      model = new Model(obj);
      return model.save(obj);
    }
  }

  purgeMockData() {
    //TODO: impliliment
  }
  
  disconnect(){
    return this.getDatabase().disconnect()
  }
}


module.exports = MockDatabase;