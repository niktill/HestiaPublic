# Impact Limit

This document outlines how our startup defines an impact limit and how it is calculated in our web application:

### Definition

We define the impact limit of an athlete to be the number of impacts an athlete can receive throughout one match before they consistently or drastically decrease in their performance. For example, if an athlete were to receive 20 impacts during the course of one game and had a consistent or drastic decrease in their performance afterwards, this athlete's impact limit would be 20.

### How it is Calculated

Our web application calculates an athlete's impact limit by comparing the relationship between the number of impacts they received and their max acceleration which is determined from uploaded IMU data during matches. Our web application will calculate a new impact limit in the following scenarios:

1. If an athlete is found to decrease their max acceleration over the course of more than three matches consecutively, then the number of impacts that the athlete recieved on the first of these matches is determine to be the athlete's impact limit. For example, if an athlete was determined to to receive 30 impacts and achieve a max acceleration of 3.5m/s^2 in game 1, receive 35 impacts and achieve a max acceleration of 2.5m/s^2 in game 2, and receive 25 impacts and achieve a max acceleration of 2.0m/s^2 in game 3: their impact limit would be determined to be 30 (the number of impacts recieved in game 1 because their acceleration decreased twice consecutively in subsequent matches). The goal of this calculation would be to detect an amount of tackles that would cause an athlete to decrease their performance consistently overtime.

2. If an athlete is found to decrease their max acceleration by 35% or more between two matches, the amount of impacts the athlete received on the first match is determined to be the athlete's impact limit. For example, if an athlete was determined to receive 40 impacts and achieve a max acceleration of 3.5m/s^2 in game 1 and receive 25 impacts and achieve a max acceleration of 1.0m/s^2 in game 2: their impact limit would be determined to be 40 (because they had over a 35% or more decrease in max acceleration from game 1 to game 2). The goal of this calculation would be to detect an amount of tackles that would cause an athlete to decrease their performance drastically.

One thing to note about how our web application determines impact limit is that it will ignore an impact limit calculation if it is using older data than the data that was used for the most recent impact limit calculation. In other words, if uploaded IMU data of a match has a match date before the match date of the data used for the most recent impact limit calculation, then it is not used to calculate a new impact limit (however this uploaded data will still be viewable in our web application's dashboard). In this way, preference is given to more recent data when calculating new impact limits.

### Ways to Improve

As we recognize that the means in which we currently calculate the impact limit of an athlete is not entirely accurate, we leave this section to list areas that we will plan to improve on beyond the scope of this course in order to determine the impact limit with greater accuracy:

- In the future we should allow our application to factor in the amount of time between decreases in max acceleration, if two matches are weeks apart then a decrease in max acceleration may not matter.
- Currently, a higher impact limit can replace a lower impact limit. For example, if an athlete has an existing impact limit of 40, but has a match at a newer date where they receive 60 impacts and which affects their max acceleration in one of the scenarios described above, the athlete's new impact limit will be recalculate to be 60 instead of 40 (essentially determining the athlete to have improved their ability to withstand impacts). Although this recalculation to a higher impact limit could be feasible if it was done a long period of time after the previous impact limit calculation, it would not be feasible if this was done in a short period of time. In this way, our application as it stands does not handle an athlete's ability to improve their impact limit accurately. In the future, we could combat this issue by determining the average max acceleration of an athlete over the course of their career and use this value to determine if an improvement in their impact limit is warranted.
- As mentioned in our GitHub milestones, more factors about impacts could be determined to help better determine how they relate to an athlete's impact limit. This would include but is not limited to the intesity of an impact, the type of impact, or location of impact on body.
- Using max acceleration as a total equation for performance is not ideal. In the future we can employ more factors from the IMU data such as average acceleration, average speed, distance moved to better determine when a decrease in performance occured.
