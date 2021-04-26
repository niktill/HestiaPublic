# Roadmap

The ultimate goal for Hestia is to create a product that ultilizes IMU data, data analytics, and software to help determine the training load of athletes by analyzing how the number of impacts they have recieved has negatively affected their performance. The following goals below are related to the creation of an MVP of our product and beyond:

## Short Term

The first goal for our MVP is to implement the environment, CI/CD, and testing infastructure that is required to effectively start and maintain the development for it. Next, we plan on implementing our backend and frontend for authentication and athlete profile creation, as this is the initial workflow customers will encounter in our app. Our last short term goal is to create our prototype for the AI model that will determine the number of impacts and max acceleration from a given IMU data set.

## Medium Term

Our Medium term goals is to first implement IMU data upload functionality via multer package for our web application. After this, we plan on implementing the athlete's profiles; this includes frontend display of the data extracted from the IMUs into charts using Frappe package. Next in our medium term goals, we plan to implement the backend algorithm that will determine the impact limit of an athlete, which is the number of impacts an athlete has recieved before they decrease their acceleration performance. Finally, we plan on adding an email notification system in our web application by ultizing SendGrid, that will notify users when an athlete is neaer of beyond their impact limit.

## Long Term

For our long term goals, we plan on performing UX research and creating a prototype for a mobile application for Hesita. Next, we hope to improve on our AI model by training it to not only determine the number of impacts from IMU data, but also the intensity of those impacts, and use this information to better determine and athlete's impact limit. Our final long term goal is to perform market research in how our product could be implemented in other contact heavy sports (for example hockey, boxing, or football).
