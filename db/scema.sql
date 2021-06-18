create database if not exists proyekakhir;
use proyekakhir;
create table airquality (
    id int primary key not null auto_increment,
    temperature int(11) not null,
    humidity int(11) not null,
    air_quality int(11) not null,
    unique key id (id)
); 