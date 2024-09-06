init:
	@cd src/db && sqlite3 racetrack.db < init_db.sql 
data:
	@cd src/db && sqlite3 racetrack.db < create_data.sql 

clean: 
	@cd src/db && rm racetrack.db 

clear:
	@cd src/db && sqlite3 racetrack.db < clear_tables.sql