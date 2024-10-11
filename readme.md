# Real-time system for a local racetrack.

This system provides real-time race management and tracking for local racetracks. Authenticated users can create, start and stop races, and track lap counts. 
Unauthenticated users have access to live leaderboards, race schedules, participant details, and the current race mode.

## Features
Authenticated users: Create, manage, and track races in real-time.
Unauthenticated users: View real-time race information, including leaderboards and next race details.
Delete the database with ```make clean``` .
Create an empty database with ```make init``` .

## Overview of System Pages

The system consists of seven web pages accessible from the main page.

1. Front Desk - Requires receptionist_key for access. This page allows authenticated users to:

    * Create races with specified time and date.
    * Delete or edit created races, including their names, dates, or times.
    * Add drivers to specific races and assign cars to those drivers.
    * Edit driver names and assigned cars, or remove drivers from a race.

2. Race Control - Requires safety_key for access. This page allows authenticated users to:

    * Start the next race session.
    * View the names and cars of participants in the upcoming race.
    * Start the race and monitor the status of the current race.
    * Change the race mode to safe, hazard, danger, or finish.
    * End the current session and queue the next earliest race from the database.

3. Lap Line Tracker - Requires observer_key for access. This page allows authenticated users to:

    * View the status and ID of the current race.
    * See the remaining time for the current race.
    * Add laps for cars to save their lap times to the leaderboard.

4. Leaderboard - Public page. 
    * Displays the current race timer, the active race flag, and a leaderboard featuring car numbers, driver names, lap counts, and fastest lap times.

5. Next Race - Public page. 
    * Displays information about the upcoming race (race name, date and time, drivers, and their car numbers) if available.

6. Race Countdown - Public page. 
    * Displays the timer for the current race.

7. Race Flags - Public page. 
    * Displays the current race flag that corresponds to the race mode.

All public pages include a button to enter fullscreen mode.

## Installation

Follow these steps to set up the project:

1. Clone the repository: ```git clone https://gitea.kood.tech/olhalavryshyn/racetrack.git```
2. Navigate to the project repository: ```cd racetrack``` 
3. Before starting the server, you must define the following access keys as environment variables:

- `receptionist_key` - Key for the receptionist role
- `observer_key` - Key for the observer role
- `safety_key` - Key for the safety role

You can set the environment variables directly in the command line as shown in the next step.

4. Start the server. 

    * For production: ```receptionist_key=8ded6076 observer_key=662e0f6c safety_key=a2d393bc npm start ``` (races will last for 10 minutes)

    * For development: ```receptionist_key=8ded6076 observer_key=662e0f6c safety_key=a2d393bc npm run dev``` (races will last for 1 minute)

## Access from other networks:

5. Go to [ngrok, make an account/login, and download the standalone executable for your operating system.](https://dashboard.ngrok.com/get-started/setup/windows) 
6. Extract and open the executable, copy the command with your auth token from [here](https://dashboard.ngrok.com/get-started/your-authtoken) and run it in the console that opened from the executable.
7. Run ```ngrok http 8000``` and go to the address that is given to you in the console.

You'll be given a public URL that you can use to access the server from any network.