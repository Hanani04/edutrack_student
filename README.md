# EduTrack

**Organize Your Academic Journey**

Static web prototype prepared for the IMS566 Individual Project.

## Project Overview

EduTrack helps a secondary school student monitor academic performance, homework completion, attendance, co-curricular achievements, subject registration, and class information. The project is intentionally database-free so it can be published directly with GitHub Pages.

## Demo Login

- Username: `student123`
- Password: `12345`

The login is a client-side simulation using `localStorage`. It is suitable for project demonstration only and does not store real user data.

## Pages Included

- `index.html` - login page
- `register.html` - registration form prototype
- `dashboard.html` - academic performance dashboard
- `tasks.html` - homework and study task tracker
- `students.html` - student profile, subject list, and class directory

## Features

- Responsive navigation and layout for desktop and mobile
- Static authentication flow with route protection
- Dark and light mode icon toggle saved in `localStorage`
- Examination countdown timer
- Chart.js visualizations for attendance and tasks
- Interactive task actions with tick, cross, and reset buttons
- Weekly class timetable on the student profile page
- Academic result tables, task tables, profile details, and classmate directory
- Accessible labels, skip link, semantic page structure, and clean metadata

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js CDN
- GitHub Pages compatible static hosting

## Publish to GitHub Pages

1. Push the project folder to a GitHub repository.
2. Open the repository settings.
3. Go to Pages.
4. Set the source to the main branch and root folder.
5. Save, then open the generated GitHub Pages URL.

## Notes

This project does not require PHP, MySQL, XAMPP, or any database setup. It can run by opening `index.html` in a browser or by publishing the folder to GitHub Pages.
