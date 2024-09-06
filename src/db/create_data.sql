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

INSERT INTO cars (driver_id,name, number,race_lap,current_lap_time,best_lap_time,race_elapse_time,status) VALUES
(1,'one',1,2,3,4,5,8),
(2,'two',2,0,0,0,0,8),
(3,'three',3,0,0,0,0,8),
(4,'four',4,0,0,0,0,8),
(5,'five',5,0,0,0,0,8),
(6,'six',6,0,0,0,0,8),
(7,'seven',7,0,0,0,0,8),
(8,'eight',8,0,0,0,0,8);

INSERT INTO races_test (created,slot_1_id,slot_2_id,slot_3_id,slot_4_id,slot_5_id,slot_6_id,slot_7_id,slot_8_id,status,flag) VALUES
(08272024,1,2,3,4,5,6,7,8,8,1);