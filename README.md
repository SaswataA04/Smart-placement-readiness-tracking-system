# Student Placement Portal

A web-based dashboard that helps students track their placement preparation, analyze readiness, and build consistent study habits for campus placement.

The system provides tools for **coding practice tracking, aptitude test logging, interview preparation, resume management, and personalized preparation roadmaps.

---

# Overview

The Student Placement Portal is designed as a single-page web application that allows students to manage and monitor their placement preparation from one platform.

The portal evaluates a student's readiness through an initial assessment test and dynamically generates recommendations and weekly roadmaps based on their performance.

Students can log their preparation activities such as solving coding problems, taking aptitude tests, conducting mock interviews, and improving soft skills.

The platform also integrates with Codeforces API to automatically track solved problems.

---

# Key Features

1. Authentication System

* Login and signup functionality
* Profile setup for branch, year, and target companies
* User data stored locally using browser storage

 2. Placement Readiness Assessment

* Image-based assessment questions
* Automatically calculates readiness score
* Generates personalized recommendations

 3. Dashboard

Displays an overview of placement preparation including:

* Overall readiness score
* Category progress tracking
* Daily consistency streak
* Weekly roadmap tasks
* Quick action buttons

 4. Coding Practice Tracker

Tracks coding practice statistics including:

* Total problems solved
* Difficulty breakdown (Easy, Medium, Hard)
* Recent coding activity logs
* Codeforces synchronization using API

 5. Aptitude Test Tracker

Allows students to log aptitude test performance including:

* Test names
* Score percentages
* Test history
* Average aptitude score

 6. Resume Manager

Students can:

* Upload resumes (PDF)
* Track ATS score estimates
* Maintain resume history

 7. Soft Skills Tracker

Students can rate their proficiency in essential soft skills:

* Communication
* Teamwork
* Leadership
* Presentation
* Problem Solving
* Time Management

8. Mock Interview Logger

Stores interview practice details including:

* Company or interview type
* Questions faced
* Self rating
* Interview history

 9. Personalized Roadmap

Generates weekly tasks based on assessment performance and recommendations.

Example tasks include:

* Solving coding problems daily
* Practicing aptitude tests
* Recording mock interview answers

10. Consistency Tracker

Tracks student discipline using:

* Daily streak counter
* Active days in the current month
* Consistency percentage

11. Reports

Generates a summary report of placement preparation progress.

---

Tech Stack

Frontend:

* HTML5
* CSS3
* Vanilla JavaScript

Storage:

* Browser LocalStorage

External API:

* Codeforces API

Architecture:

* Single Page Application (SPA)

---

# Project Structure


placement-portal/
│
├── index.html
├── styles.css
├── script.js
└── README.md


---

# Data Storage Model

User data is stored in browser localStorage.

Example structure:

users → registered users
currentUser → active logged-in user
appData_userID → user progress data


appData includes:

* coding logs
* aptitude tests
* interview logs
* skills ratings
* roadmap tasks
* resumes
* assessments
* recommendations
* activity streak data

---

# Readiness Score Calculation

The placement readiness score is calculated using two components.

Activity Score (70%)

Average progress across:

* Coding practice
* Aptitude tests
* Resume preparation
* Soft skills
* Mock interviews

Assessment Score (30%)

Average score from the placement readiness assessment.

Final Score:
Overall Readiness logic =
(0.7 × Activity Score) + (0.3 × Assessment Score)


---

# Installation and Usage

1. Clone the repository
git clone https://github.com/your-username/placement-portal.git
2. Open the project folder.
3. Launch `index.html` in a browser.

No server setup is required because the application runs entirely in the browser.

---

# Future Improvements

Possible enhancements include:

* Backend authentication system
* Secure password hashing
* Database integration
* Real resume ATS analysis
* AI interview feedback system
* Machine learning readiness prediction
* Integration with LeetCode and HackerRank APIs
* Real placement company preparation modules

---



---

# Use Case

This system can be used by:

* College students preparing for campus placements
* Training and placement cells
* Coding club communities
* Hackathon prototypes for EdTech platforms

---

# License

This project is intended for educational and prototype purposes.
