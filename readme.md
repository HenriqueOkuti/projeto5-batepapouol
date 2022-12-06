# project5-Batepapo UOL Front-end

Front-end app implementation for a chatroom with access to an api where user is able to login and talk to other logged users. For this project, the API that handles the chatlog and logged users was provided by the team at DRIVEN Education

## How to use:

Upon opening you'll be prompted to choose a nickname, do note that the same nickname cannot be in use.

You can write messages on the "Escreva aqui..." field and send the message by clicking on the airplane icon.

Only the latest 100 messages will be displayed on the screen, which will be updated every 3 seconds.

Due to how the API works, every 5 seconds there'll be a verification to see if the user is still active, in case they are not they will be logged off and removed from the logged users list. Thus, you'll need to login again (just refresh the page if there's no prompt) to be able to keep using the service should that happen to you.
