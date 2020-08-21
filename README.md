# meetingPlannerProva
The aim of this project is to manage the meetings for your company. Using meetingPlanner you will be able to: Create meetings, list meetings (also by employee) and to know employees availability.

# Installation guide
To install and run the project properly first we have to install all the modules.

# Requirements
We need to install mongodb locally and run it. There is an exported JSON that contains the meeting manager database with all its collections (the most important is "meetings"), the files are "meeting_collection.json" and "employee_collection.json". In order to use it, we have to import them to mongodb (don't forget to create the database "meeting_manager" and then importing the collections to it).

To be able to use the endpoints, you will find a JSON file with the collection of the necessary requests inside the zip aswell. The file is named "MeetingManager.postman_collection.json". Import it to POSTMAN and you are set to go!

# Usage
To run the project, we have to use the command "npm run dev", which will raise a new server pointing to the port 5000.

# Test Module
To run the test module, we will use the command "npm run test", keep in mind that the "createMeeting" case 1 can only be used once per booking, since its adding a real meeting to the database, and the next time we test it we should "add" a different meeting for it to return the expected assertion.

That's it.

Thanks for using the Meeting Manager!