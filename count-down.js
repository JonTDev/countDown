function CountDown() {
  this.format = 'M:S';
  this.error = null;
  this.display = null;
  this.actualDisplay = '';
  this.seconds = 0;
  this.minutes = 0;
  this.hours = 0;
  this.status = 'IDLE';
}

CountDown.prototype.setFormat = function(format) {
  this.format = format;
  return this;
};

CountDown.prototype.setStatus = function(status) {
  this.status = status;
};

CountDown.prototype.start = function(cb) {
  var self = this;
  if(this.status === 'RUNNING') {
    return false;
  } else {
    this.setStatus('RUNNING');
    if(typeof cb === 'undefined') cb = function() { console.log('Timer Complete') };

    var timerInterval = setInterval(function() {
      if(self.timerAtZero() === true) {
        clearInterval(timerInterval);
        self.setStatus('IDLE');
        cb();
      } else {
        self.subSecond(function (success) {
          if (success === false) {
            clearInterval(timerInterval);
            if (self.timerAtZero() !== true) {
              cb()
            }
            self.setStatus('IDLE');
          } else {
            if (self.timerAtZero() === true) {
              clearInterval(timerInterval);
              self.setStatus('IDLE');
              cb();
            }
          }
        });
      }
    }, 1000)
  }
};

CountDown.prototype.timerAtZero = function() {

  if(this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0) {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;

    return true;
  } else return false;
};

CountDown.prototype.displayFeed = function(str, callback) {
  try {
    var self = this;
    var char = '';

    function done(callback2) {
      if(str.length === 0) return callback2();
      return self.displayFeed(str, callback);
    }

    if(str.length === 1) {
      char = str;
      str = '';
    } else {
      char = str.slice(0, 1);
      str = str.slice(1);
    }
  } catch(err) {
    console.log(str, char, this);
    throw err;
  }

  callback(char, done);
};

CountDown.prototype.getDisplayNumber = function(char, done) {
  var self = this;

  this.settings(char, function(newChar) {
    if(newChar === null) self.actualDisplay += char;
    else self.actualDisplay += newChar;
    done(function() {
      self.display.innerHTML = self.actualDisplay;
    })
  })
};

CountDown.prototype.translate = function(char, callback) {
  if(this.settings[char] === undefined) {
    return callback(char);
  } else {
    if(this.settings[char] === false) {
      return callback(this.settings[char]())
    }
  }
};

CountDown.prototype.evenOutNumbers = function() {
  var tempNumber = 0;

  if(this.seconds >= 60) {
    tempNumber = Math.floor(this.seconds / 60);
    console.log(tempNumber);
    this.minutes += tempNumber;
    this.seconds -= (tempNumber * 60);
  }

  if(this.minutes >= 60) {
    tempNumber = Math.floor(this.minutes / 60);
    this.hours += tempNumber;
    this.minutes -= (tempNumber * 60);
  }
};

CountDown.prototype.setDisplay = function(selector = null) {
  var self = this;
  this.evenOutNumbers();

  if(selector !== null) {
    if(typeof jQuery !== "undefined") {
      if(selector instanceof jQuery) this.display = selector[0];
    }
    else if(selector instanceof HTMLElement) this.display = selector;
    else if(selector.constructor === String) {
      try {
        this.display = document.querySelector(selector);
      } catch(err) {
        this.display = null;
        this.error = err.message;
      }
    }
    this.setDisplay();
    return this;
  } else {
    if(this.display instanceof HTMLElement) {
      this.actualDisplay = '';
      this.displayFeed(this.format, function(whatToDisplay, done) {
        self.getDisplayNumber(whatToDisplay, done);
      })
    }
  }
};

CountDown.prototype.addHours = function(num, cb) {
  this.hours += num;
  if(typeof cb === 'undefined') return this;
  cb();
};
CountDown.prototype.addMinutes = function(num, cb) {
  this.minutes += num;

  if(typeof cb === 'undefined') return this;
  cb();
};
CountDown.prototype.addSeconds = function(num, cb) {
  this.seconds += num;
  this.setDisplay();

  if(typeof cb === 'undefined') return this;
  cb();
};

CountDown.prototype.barrowHour = function(cb) {
  this.subHour(cb)
};
CountDown.prototype.barrowMinute = function(cb) {
  this.barrowHour(function(success) {
    if(!success) {
      cb(false);
    } else {
      this.addMinutes(60, function() {
        this.subMinute(cb);
      })
    }
  })
};

CountDown.prototype.subHour = function(cb) {
  if(this.hours === 0) {
    cb(false);
  } else {
    this.hours -= 1;
    cb(true);
  }
};
CountDown.prototype.subMinute = function(cb) {
  var self = this;
  if(this.minutes === 0) {
    this.subHour(function(success) {
      if(!success) {
        cb(false)
      } else {
        self.addMinutes(59);
        cb(true);
      }
    })
  } else {
    this.minutes -= 1;
    cb(true);
  }
};
CountDown.prototype.subSecond = function(cb) {
  var self = this;
  if(this.seconds === 0) {
    this.subMinute(function(success) {
      if(success === false) {
        cb(false);
      } else {
        self.addSeconds(59);
        self.setDisplay();
        cb(true)
      }
    })
  } else {
    this.seconds -= 1;
    this.setDisplay();
    cb(true)
  }
};

CountDown.prototype.settings = function(settingCheck, cb) {
  var returnMe = null;
  switch(settingCheck) {
    case 'h':
      returnMe = this.hours;
      break;
    case 'H':
      if(this.hours < 10) returnMe = '0';
      returnMe += this.hours;
      break;
    case 'm':
      returnMe = this.minutes;
      break;
    case 'M':
      if(this.minutes < 10) returnMe = '0';
      returnMe += this.minutes;
      break;
    case 's':
      returnMe = this.seconds;
      break;
    case 'S':
      if(this.seconds < 10) returnMe = '0';
      returnMe += this.seconds;
      break;
  }

  cb(returnMe);
};
