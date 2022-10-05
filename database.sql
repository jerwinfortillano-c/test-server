
CREATE TABLE users(
  id int primary key AUTO_INCREMENT,
  name varchar(100),
  email varchar(50),
  password varchar(30),
  UNIQUE (email)
);


CREATE TABLE career_goals(
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  description varchar(255) NOT NULL,
  reason varchar(255) NOT NULL,
  target_date date NOT NULL,
  date_completed date,
  primary key(id)
);

