# Appointment Managment System - Drvl

## Live app Link :point_down::point_down::point_down:

- Link -> https://appointment-manager.onrender.com/

## Introduction

- This is an Appointment Managment System where User can sign in,sign up and sign out. After sign up User will redirect to appointment page where the User can create a an Appointment as well as User can see the Appointment which is create by User.

- For add a Appointment User have to provide a Appointment name, startTime, endTime and date of Appointment.

- In this System User can edit and delete an existing Appointment

- User can add only one appointment in the specified time slot.

- Users can login using thier credentials to view their appointments and respective time slots

- If User want to add more than one appointment in the same timeslot the application will give option for user to
  delete an existing Appointment and add a new appointment

## Run Locally

- Note : Postgresql service must install in your system.

- Install dependacies

```
npm install
```

- For create a database

```
npx sequlize-cli db:create
```

- For execute migration

```
npx sequelize-cli db:migrate
```

- Start Application

```
npm run start
```

- For run a test Case

```
npm test
```

# Screenshots

## Home Page:

![Screenshot 2023-03-11 at 10 03 25 PM](https://user-images.githubusercontent.com/103437774/224496435-95177dbc-5252-4329-981c-7f0168e1f11a.png)

## Login Page:

![Screenshot 2023-03-11 at 10 04 04 PM](https://user-images.githubusercontent.com/103437774/224496460-7160fee4-21ba-4b7f-a838-54d28e90c2a2.png)

## Sign Up Page:

![Screenshot 2023-03-11 at 10 03 40 PM](https://user-images.githubusercontent.com/103437774/224496477-b9b2e238-6276-4d36-a1e6-0afc2c901bf1.png)

## Appointment Pages:

![Screenshot 2023-03-11 at 10 05 26 PM](https://user-images.githubusercontent.com/103437774/224496502-2ee7fc2e-72f8-4a3f-b46f-6fb842aa27b2.png)
![Screenshot 2023-03-11 at 10 05 40 PM](https://user-images.githubusercontent.com/103437774/224496512-45516943-83c9-4448-aaa3-a0a820463bf6.png)
![Screenshot 2023-03-11 at 10 06 38 PM](https://user-images.githubusercontent.com/103437774/224496533-d236333e-5406-40fc-bee0-60c39ebc91f8.png)
