Create database cleaner_connect;
use cleaner_connect;

CREATE TABLE admin(
  id VARCHAR(36) NOT NULL,
  name VARCHAR(250) NOT NULL,
  dob date,
  phone INT(10),
  type VARCHAR(10),
  email VARCHAR(200),
  password VARCHAR(250),
  PRIMARY KEY (id)
);


CREATE TABLE user(
  id VARCHAR(36) NOT NULL,
  name VARCHAR(250) NOT NULL,
  dob date,
  phone INT(10),
  suburb VARCHAR(200),
  email VARCHAR(200),
  password VARCHAR(250),
  PRIMARY KEY (id)
);

CREATE TABLE task (
  id VARCHAR(36) NOT NULL,
  sender VARCHAR(36),
  receiver VARCHAR(36),
  created_date DATETIME,
  deadline DATETIME,
  description VARCHAR(500),
  PRIMARY KEY (id),
  CONSTRAINT senderfk FOREIGN KEY (sender) REFERENCES admin(id) ON DELETE SET NULL,
  CONSTRAINT receiverfk FOREIGN KEY (receiver) REFERENCES user(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE comment(
  id VARCHAR(36) NOT NULL,
  task_id VARCHAR(36),
  created_date datetime,
  user_id VARCHAR(36),
  description VARCHAR(500),
  CONSTRAINT taskfk FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE forget_password(
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36),
  email VARCHAR(200),
  send_date DATETIME,
  otp INT,
  CONSTRAINT userfk FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);
