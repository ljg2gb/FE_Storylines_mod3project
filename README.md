# Storylines
![](/Accountabilibuddies.png)

## General Info

AccountibiliBuddies is a one-week, fullstack, Mod 3 project. It is a blogging app what puts the "where" at the center of the story. The app allows users to create a Story like "Colorado Roadtrip" and add points to the story along the way with a title like, "Day 3: Rocky Mountain National Park", and description, associated with a spefic point on the map. 

## Technologies

* Ruby on Rails 
* ActiveRecord
* JavaScript
* HTML/CSS 
* Leaflet JS

## Setup

To run the app, first clone down the repo to your local device. This application is written with a Rails backend and JavaScript frontend. The backend can be found [here](https://github.com/ljg2gb/BE_StoryLines) and the frontend can be found [here](https://github.com/ljg2gb/Storylines). The backend comes equipped with all necessary gems. Install these gems using 

`$ bundle install`

Run the migrations:

`$ rails db:migrate`

The backend should be served on port 3000. This can be done using the command:

`$rails s`
 
The frontend should be served on port 3001. This can be done using, for example: 

`$lite-server`

From here, you can navigate the website.

## Functionality

* Login or create new user

* Start a new Story

* Add points to your story

* Logout


## Down the Pipeline

* Add ability to edit points on the story. 
* Implement better SPA coding practices.
* Add functionality to see all My Stories
* Add a public or private access tags that allows some stories not to require authentication and to be able to viewed by all.

## Authors

Lydia Gregory [GitHub](https://github.com/ljg2gb)
