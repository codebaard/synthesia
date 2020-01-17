# Server

## Requirements

- NodeJS environment

## How to Start

- Run `npm install`
- Run `npm run start`

## Options (command line arguments)

Run `npm start -- <argument>`

Arguments:

*  **--no-kinect** _Boolean_           Set true if no kinect device is available, but you still want to test the     
                                server. A fake server will start and send data.                               
*   **--host** _IP_                     IP address of this server. Default: 127.0.0.1                                 
*   **--port** _Number_                 Port of this server where pose data should be send to. Default: 3000          
*   **--show-midi-devices** _Boolean_   Prints all available midi devices.                                            
*   **--midi** _Number_                 Number of the midi device you want to send to and receive midi. Default: 0    
*   **--help** _string_                 Print this usage guide.   