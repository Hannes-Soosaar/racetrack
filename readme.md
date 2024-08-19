A real-time system so that everyone has the information they need, exactly when they need it for a local racetrack 


User.

The landing page is the guest page.
To access other functionality you must be logged in. 
based on the credentials they will have access to one or more functions of the app. 


Interface	Persona	Route
Front Desk	Receptionist	/front-desk
Race Control	Safety Official	/race-control
Lap-line Tracker	Lap-line Observer	/lap-line-tracker


    Need - A Users 

Rolls:

Employee
    Flag Bearer
    Receptionist
    Safety Official
    Lap-line Observer

Guest
    RaceDriver
    Spectator

Receptionist

Can create/modify a driver
Can create/add a race


Table

RaceSessions
    8 drivers
    8 cars
    10 minutes
    winner_driverId
    safetyOfficial_Id
    status_id

Laps
    raceSession_id
    diver_id

Users
    User name
    Password bcrypt / (KEY)
    roll_id

    
Rolls (Accesskey)
 Receptionist 
 Safety Official
 Lap-line 
 Observer










