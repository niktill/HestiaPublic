# UX Research
-----

The following list entails the user tasks that we prompted to our UX interviewees to help complete the design for Hestia's Story Board:

1) "Create a profile for an athlete"
2) "Upload IMU data for an athlete"
3) "Update email address for your profile (own profile)"
4) "Delete a team profile"
5) "Determine if an athlete is over his impact limit within last training session"
6) "Determine an athlete's max acceleration within last training session"

With two interviews, we evaluated how each user accomplished these tasks by asking them to complete the user task while viewing the initial version of our story board. 
From our story board, the interviewees told us how they would navigate by stating what components they would interact with; when an interaction would bring them to a new board, we would navigate them to this new board. It was planned to give no extra information to our users on how we want them to complete the prompted tasks or to answer questions during. However, especially in the first interview, the exchange developed into an interactive learning and teaching session.

In the following, the feedback of the interviews is summarized and structured into each use case prompted to the interviewees. General feedback that was not given to a particular use case is shown in the Overall section. Note, the summaries focus on user reactions that challenged our design, thus, smooth task flows are not weighted in as much. 

### Interview 1
Conducted on 22/02/2021 from 10:00 - 11:00 am EST with Julian Nadeau:

1\) 

- Julian notices the differing landing pages: signup and login. Although he prefers to land directly on login, he acknowledges the usefulness of starting on sign-up, as is our case.
- Julian is unsure about the relationship between an athlete and a team, specifically he finds it confusing that he can search for an athlete while he is on the team tab. He further wonders, if and how he can search for a team.
- Julian notes that the approval and discard buttons are typically switched around.
- Julian asks himself if teams can be shared between multiple users. 
- Julian wishes for personal avatars for teams and players (as in GitHub or Slack). He recommends to have a 32x32 size or compute the avatar according to an athlete's initials with a hex code generator. The avatar could be placed next to an athlete's name in the top left corner. 

2\)

- Julian wonders if his upload of IMU data is saved automatically as there is no confirmation for this and he could change teams afterwards. One discussed solution was to list the added IMU files.
- Julian suggests to use cards to better segment logical units on screen. These cards can include solely high level details or solely data. 
- Julian mentions that the team selection dropdown could be better positioned in an edit section.
- We discussed using metadata from the IMU data such as the upload time and the ID of the uploaded taken directly out of the IMU file without the need for the user to enter it manually. 

3\) 

- Julian misinterpreted the email address to be changed to an email address of one athlete instead of being from him, the user. 

4\)

Skipped due to time limitation.

5\)

- Julian is having a hard time to interpret some of the labels’ terminology. Namely, he wonders what the impact limit is exactly and he does not know what “relative avg degrees on impact is” means. 
- Julian emphasizes on paying attention to accessibility, e.g. not using solely red and green as bar colors which could exclude users with color-blindness. 
- Julian does not notice the arrows to change weeks next to the calendar. A solution discussed was to move them up, next to the starting date.

6\)

Skipped due to time limitation.

#### Overall 
- Julian recommends to be consistent so that modules with similar functionality repeat themselves and the user does not need to learn avoidable new paradigms.
- Julian recommends that less clicks are usually better with regard to our juxtaposition of continuity vs fairness.
- Julian recommends to always use titles and extensive aria labels for icons to increase accessibility of our product. 
- Julian recommends segmenting components on a page to make it more clear what information is not related to one another.

### Interview 2 
Conducted on 22/02/2021 from 3:30- 4:30 pm EST with Ming-Chang Tsai, Ph. D 

1\)

- Ming directly mentions that a couch and an analyst only ever manages a single team. Our feature for having an overview of multiple teams may only be useful to the CEO.  

2\)

- Ming reflects that it would be cumbersome for an user to upload IMU data for all athletes separately. Instead, he recommends having an upload option for one day that automatically uploads the IMU data for all athletes. 

3\)

Skipped due to time limitation. 

4\)

Skipped due to time limitation.

5\)

- Ming easily sees the estimated impact limit but only with the underlying graph and its threshold it becomes clear to him what the number represents. 
- Ming recommends adding “impact count” or “number of contacts” as a title.
- Ming is confused about what “relative average degrees of impact” means. Possible interpretations by him are the mean, total standard deviation or deviation from threshold. He recommends a different wording. Regarding the general usefulness of the information, Ming states that coaches already use a chronic for this, that does the job.
- Ming mentions that coaches would like a more apparent visual about what is the takeaway from the data. We discussed that a traffic light can symbolize some factors of an athletes performance such as its impact level could be helpful.
- Ming recommends to give users as little surface area to modify as possible and instead make most of the design choices automatically in the background. 
- Ming successfully detects the arrows to change a week but wonders if the display by weeks can be changed into display by months.
- Ming mentions that in general the number of impacts is only one aspect of training load and that other modalities exist. 

6\) 

We did not really get into this use case, as Ming preferred to discuss general aspects. 


#### Overall
- Ming states that the time constraint within the last training session is ill-suited as IMU data is mostly collected in tournaments (and in training games). Thus, Ming recommends solely addressing games with our product. 
- Ming further states that each tournament has a minimum of three and a maximum of six games (each of 15 minutes). three  games are played on Saturday and only the successful teams play three  more games on Saturday. Tournaments take place every three  weeks. 
- Ming states that those using our product would find no use for creating and managing team profiles as they only would ever be managing a single team. Thus, only an athlete's page should be utilized.


### Summary
In summary, our team had two major issues regarding our MVP that were revealed after conducting the interviews: 

1) The initial mockup we had designed for an athlete’s profile was not clear about what the information being displayed represented. First, the components on the athlete profile were not sufficiently segmented enough (by use of borders or cards), thus causing information on the profile to be wrongfully grouped together. Next, our mockup for uploading IMU data was not sufficiently clear on how to upload a file or if a file was uploaded successfully. Lastly, our plan for displaying the x-axis data for number of impacts and max acceleration by week was stated to be not applicable for our user by our industry expert, Dr. Ming. Thus, to address these issues we plan to segment the information on the athlete profiles by cards, change IMU file upload to list the files that have been uploaded, and change the x-axis of the charts to represent each game as opposed to day.

2) Our initial mockup included a ‘teams’ page, because we had wrongfully assumed that a user of our application would want to manage multiple teams. As our industry expert Dr. Ming had stated this is not applicable and that users for our application would only ever be managing one team, he recommended we only include an ‘athletes’ page that represented the athletes on one team. To address this issue we have decided to follow Dr. Ming’s recommendation and to replace the planned ‘teams’ page with an ‘athletes’ page instead. It is worth noting that this also removes the confusion around the search bar associated with the ‘teams’ page that was brought up during our first interview. However, this does change our ability to implement the arrows beside the date form that Julian had recommended as it is now not necessary. Instead, we now plan to allow users to change the x-axis of the charts by the number of games and start date with an input field.

