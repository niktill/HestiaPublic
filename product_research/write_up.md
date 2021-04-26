# Video Demo Write Up

[Link to our video demo](./Video_CSC491.mp4)!

As a high level overview, our application is designed to allow users to upload IMU data of athletes during a match to determine how many impacts they received and the max acceleration they achieved. With use of this data, the goal of our application is to determine an [impact limit](./impact_limit.md) for athletes, which is the number of impacts our applications determines an athlete must receive in a match before they decrease their performance in max acceleration for subsequent matches.

Our application is accessible at the following url: https://hestia-webapp.herokuapp.com/

Our video demo showcases how all of the use cases that are outlined in our [use cases markdown](./use_cases.md) have been implemented in our MVP. Each of the following bullets gives an overview of how we have achieved each use case and the time in the video it is showcased:

- Create Athlete profiles [0:00 - 0:25]
  
  Users can create an athlete simply by logging into our application and making their way to the 'Athletes' tab. Here they can use the form to insert the name of the athlete and simply click on the athlete button to create an athlete. Users can also delete an athlete by clicking on the attached delete button to each athlete. Clicking on an athlete in the 'Athletes' tab brings the user into the athlete's individual profile.

- Upload IMU data for upload [0:25 - 1:05]
  
  In each athlete's profile, there is an 'Uploaded IMU Data' section where users can upload an IMU file for an athlete and view the files that have been uploaded for the athlete previously. To upload an IMU file, a user can click on the chosen file input in the top right corner of this section and then the upload button next to it. A spinner will appear to show that the IMU file is uploading to our server. Once it has been uploaded successfully, a message prompts the user so and a new IMU upload entry will enter into this section. As our AI model has yet to process this IMU file yet, a message will be attached to the IMU upload stating that it is still processing.

- Determine number of Impacts and Acceleration from IMU file [0:52 - 1:31]
  
  After an IMU upload file has been uploaded to our server, it is then saved to our database and set as an unprocessed file. Currently to process the files, we have a [python script](../ai_model/main.py) running on our local machine that continuously detects every unprocessed imu file that has been uploaded to our database and does the following: It determines the athletes’ max acceleration from the IMU file, the date attached to the IMU file, and the number of impacts the athlete received from the IMU file with use of our Keras AI model. All of this extracted data is then saved back to the database with the IMU file entry now set as processed. After an IMU file has been processed and a user returns to the associated athlete's profile. They can see that the extracted data is available on the athlete's profile.

- Athlete Profile Charts [1:32 - 2:04]
  
  For every athlete profile, there are two charts: a chart that shows the number of impacts our AI model has determined the athlete received for each IMU upload and a chart that shows the max acceleration the athlete achieved for that IMU upload. For each chart, the name of the IMU file that was uploaded and the date attached to the IMU file is displayed. The forms for each of the charts specify the starting date the user wants to view the data from and the range of data they would like to show on the graphs. Lastly, we note that the impact limit is also visible on the impacts chart.

- Calculate impact limit [2:04 - 2:50]
  
  To see the details of how we have implemented determining an impact limit for our MVP, please read the [impact limit markdown](./impact_limit.md).

- Email notifications [2:50 - 3:10]
  
  In the case that our AI model detects an athlete receiving a number of impacts that is equal to or above their impact limit, our python script will send an email notification to the user with sendGrid to notify them of this occurring. An example of how our email notifications is displayed can be found [here](./email.PNG).



