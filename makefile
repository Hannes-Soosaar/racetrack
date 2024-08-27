init:
	@cd src/db && sqlite3 racetrack.db < init_db.sql

clean: 
	@cd src/db && rm racetrack.db 

clear:
	@cd src/db && sqlite3 racetrack.db < clear_tables.sql