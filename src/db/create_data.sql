--creates demo data for testing

INSERT INTO drivers (first_name,last_name,status) VALUES
('Hannes','Man',8),
('Peppa','Pig',8),
('Peeter','Sky',8),
('Olli','Sea',8),
('Mari','Kari',8),
('Tiit','Kask',8),
('Teet','Kala',8),
('Paul','Mari',8);

INSERT INTO cars (driver_id,race_id,name, number,race_lap,current_lap_time,best_lap_time,race_elapse_time,status) VALUES
(1,1,'one',1,2,3,4,5,8),
(2,1,'two',2,0,0,0,0,8),
(3,1,'three',3,0,0,0,0,8),
(4,1,'four',4,0,0,0,0,8),
(5,1,'five',5,0,0,0,0,8),
(6,1,'six',6,0,0,0,0,8),
(7,1,'seven',7,0,0,0,0,8),
(8,1,'eight',8,0,0,0,0,8);

INSERT INTO races (session_name,date,time,duration,status) VALUES
('test1','2024-10-02','21:16',-1,'active'),
('test2','2024-10-02','22:17',-1,'active');