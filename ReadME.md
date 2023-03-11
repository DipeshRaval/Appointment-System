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

**Home Page:**

**Login Page:**

**Sign Up Page:**

**Appointment Pages:**
