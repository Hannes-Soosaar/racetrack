#Real-time system for a local racetrack.

This system provides real-time race management and tracking for local racetracks. Authenticated users can create, start and stop races, and track lap counts. 
Unauthenticated users have access to live leaderboards, race schedules, participant details, and the current race mode.

##Features
Authenticated users: Create, manage, and track races in real-time.
Unauthenticated users: View real-time race information, including leaderboards and next race details.

##Installation

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

##Access from other networks:

5. Go to [ngrok, make an account/login, and download the standalone executable for your operating system.](https://dashboard.ngrok.com/get-started/setup/windows) 
6. Extract and open the executable, copy the command with your auth token from [here]https://dashboard.ngrok.com/get-started/your-authtoken and run it in the console that opened from the executable.
7. Run ```ngrok http 8000``` and go to the address that is given to you in the console.

You'll be given a public URL that you can use to access the server from any network.